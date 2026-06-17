process.env.JWT_SECRET = 'testsecret';
process.env.JWT_EXPIRES_IN = '1h';

const { startMongo, stopMongo, makePostgresMock } = require('./setup');

const mockPostgres = makePostgresMock();
jest.mock('../src/postgres', () => mockPostgres);

const request = require('supertest');
const app = require('../src/app');

beforeAll(async () => { await startMongo(); });
afterAll(async () => { await stopMongo(); });

describe('Auth', () => {
  test('register + login', async () => {
    const reg = await request(app)
      .post('/auth/register')
      .send({ name: 'A', email: 'a@a.com', password: '123456' });
    expect(reg.status).toBe(201);

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'a@a.com', password: '123456' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });

  test('login invalid', async () => {
    const r = await request(app)
      .post('/auth/login')
      .send({ email: 'nope@a.com', password: '123456' });
    expect(r.status).toBe(401);
  });

  test('register validation', async () => {
    const r = await request(app)
      .post('/auth/register')
      .send({ name: 'X', email: 'bad', password: '1' });
    expect(r.status).toBe(400);
  });
});
