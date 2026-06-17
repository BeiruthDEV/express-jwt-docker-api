process.env.JWT_SECRET = 'testsecret';
process.env.JWT_EXPIRES_IN = '1h';

const { startMongo, stopMongo, makePostgresMock } = require('./setup');

const mockPostgres = makePostgresMock();
jest.mock('../src/postgres', () => mockPostgres);

const request = require('supertest');
const app = require('../src/app');

beforeAll(async () => { await startMongo(); });
afterAll(async () => { await stopMongo(); });

async function register(role) {
  const email = `${role.toLowerCase()}@a.com`;
  await request(app).post('/auth/register').send({ name: role, email, password: '123456', role });
  const res = await request(app).post('/auth/login').send({ email, password: '123456' });
  return res.body.token;
}

describe('Users', () => {
  let adminToken;
  let createdUserId;

  test('list requires admin', async () => {
    const userToken = await register('USER');
    const r = await request(app).get('/users').set('Authorization', `Bearer ${userToken}`);
    expect(r.status).toBe(403);
  });

  test('admin lists users', async () => {
    adminToken = await register('ADMIN');
    const r = await request(app).get('/users').set('Authorization', `Bearer ${adminToken}`);
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });

  test('admin gets user by id', async () => {
    const create = await request(app)
      .post('/auth/register')
      .send({ name: 'Target', email: 'target@a.com', password: '123456' });
    createdUserId = create.body.id;

    const r = await request(app).get(`/users/${createdUserId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(r.status).toBe(200);
    expect(r.body.email).toBe('target@a.com');
  });

  test('admin updates user', async () => {
    const r = await request(app)
      .put(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Target Updated', role: 'USER' });
    expect(r.status).toBe(200);
    expect(r.body.name).toBe('Target Updated');
  });

  test('admin deletes user', async () => {
    const r = await request(app).delete(`/users/${createdUserId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(r.status).toBe(204);
  });

  test('no token rejected', async () => {
    const r = await request(app).get('/users');
    expect(r.status).toBe(401);
  });
});
