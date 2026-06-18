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
    expect(reg.body).not.toHaveProperty('password');

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'a@a.com', password: '123456' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
    expect(login.body.user).not.toHaveProperty('password');
  });

  test('api prefix login returns token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Api User', email: 'api@a.com', password: '123456' });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'api@a.com', password: '123456' });

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

  describe('Forgot password', () => {
    test('updates password and allows login with new password', async () => {
      await request(app)
        .post('/auth/register')
        .send({ name: 'F', email: 'forgot@a.com', password: 'oldpass' });

      const r = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'forgot@a.com', newPassword: 'newpass', confirmPassword: 'newpass' });
      expect(r.status).toBe(200);
      expect(r.body.message).toMatch(/sucesso/i);

      const loginOld = await request(app)
        .post('/auth/login')
        .send({ email: 'forgot@a.com', password: 'oldpass' });
      expect(loginOld.status).toBe(401);

      const loginNew = await request(app)
        .post('/auth/login')
        .send({ email: 'forgot@a.com', password: 'newpass' });
      expect(loginNew.status).toBe(200);
      expect(loginNew.body.token).toBeDefined();
    });

    test('returns 404 when user does not exist', async () => {
      const r = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'ghost@a.com', newPassword: 'whatever', confirmPassword: 'whatever' });
      expect(r.status).toBe(404);
      expect(r.body.error).toMatch(/nao encontrado/i);
    });

    test('returns 400 when passwords do not match', async () => {
      await request(app)
        .post('/auth/register')
        .send({ name: 'M', email: 'mismatch@a.com', password: 'oldpass' });

      const r = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'mismatch@a.com', newPassword: 'abcdef', confirmPassword: 'zzzzzz' });
      expect(r.status).toBe(400);
      expect(r.body.error).toMatch(/nao coincidem/i);
    });

    test('returns 400 when password is shorter than 6 characters', async () => {
      await request(app)
        .post('/auth/register')
        .send({ name: 'S', email: 'short@a.com', password: 'oldpass' });

      const r = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'short@a.com', newPassword: '123', confirmPassword: '123' });
      expect(r.status).toBe(400);
    });

    test('works through /api prefix', async () => {
      await request(app)
        .post('/auth/register')
        .send({ name: 'P', email: 'prefix@a.com', password: 'oldpass' });

      const r = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'prefix@a.com', newPassword: 'newpass', confirmPassword: 'newpass' });
      expect(r.status).toBe(200);
    });
  });
});
