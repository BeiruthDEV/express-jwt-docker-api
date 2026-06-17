const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

async function startMongo() {
  if (process.env.MONGO_URI) {
    await mongoose.connect(testMongoUri(process.env.MONGO_URI));
    await mongoose.connection.dropDatabase();
    return;
  }

  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function stopMongo() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}

function testMongoUri(uri) {
  const [base, query] = uri.split('?');
  const testBase = base.replace(/\/[^/]*$/, '/apidb_test');
  return query ? `${testBase}?${query}` : testBase;
}

function makePostgresMock() {
  const users = new Map();
  let seq = 0;

  const pool = {
    query: jest.fn(async (sql, params = []) => {
      const text = sql.replace(/\s+/g, ' ').trim().toLowerCase();

      if (text.startsWith('create table')) {
        return { rows: [] };
      }

      if (text.startsWith('select id from users where email')) {
        const user = [...users.values()].find((u) => u.email === params[0]);
        return { rows: user ? [{ id: user.id }] : [] };
      }

      if (text.startsWith('insert into users')) {
        seq += 1;
        const user = {
          id: seq,
          name: params[0],
          email: params[1],
          password: params[2],
          role: params[3] || 'USER',
          created_at: new Date(),
        };
        users.set(user.id, user);
        return { rows: [withoutPassword(user)] };
      }

      if (text.startsWith('select id, name, email, password, role from users where email')) {
        const user = [...users.values()].find((u) => u.email === params[0]);
        return { rows: user ? [user] : [] };
      }

      if (text.startsWith('select id, name, email, role, created_at from users')) {
        return { rows: [...users.values()].map(withoutPassword) };
      }

      if (text.startsWith('select id, name, email, role from users where id')) {
        const user = users.get(Number(params[0]));
        return { rows: user ? [withoutPassword(user)] : [] };
      }

      if (text.startsWith('update users')) {
        const id = Number(params[4]);
        const user = users.get(id);
        if (!user) return { rows: [] };
        const emailInUse = [...users.values()].some((u) => u.id !== id && u.email === params[1]);
        if (params[1] && emailInUse) {
          const err = new Error('duplicate key');
          err.code = '23505';
          throw err;
        }
        user.name = params[0] || user.name;
        user.email = params[1] || user.email;
        user.password = params[2] || user.password;
        user.role = params[3] || user.role;
        users.set(id, user);
        return { rows: [withoutPassword(user)] };
      }

      if (text.startsWith('delete from users where id')) {
        const id = Number(params[0]);
        if (!users.has(id)) return { rows: [] };
        users.delete(id);
        return { rows: [{ id }] };
      }

      throw new Error(`Unhandled SQL in test mock: ${sql}`);
    }),
    _store: users,
  };

  return {
    pool,
    initPostgres: jest.fn(async () => pool.query('CREATE TABLE users')),
  };
}

function withoutPassword(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

module.exports = { startMongo, stopMongo, makePostgresMock };
