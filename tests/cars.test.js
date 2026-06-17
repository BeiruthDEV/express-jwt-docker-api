process.env.JWT_SECRET = 'testsecret';
process.env.JWT_EXPIRES_IN = '1h';

const { startMongo, stopMongo, makePostgresMock } = require('./setup');

const mockPostgres = makePostgresMock();
jest.mock('../src/postgres', () => mockPostgres);

const request = require('supertest');
const app = require('../src/app');

let token;

beforeAll(async () => {
  await startMongo();
  await request(app).post('/auth/register').send({ name: 'U', email: 'u@a.com', password: '123456' });
  const r = await request(app).post('/auth/login').send({ email: 'u@a.com', password: '123456' });
  token = r.body.token;
});

afterAll(async () => { await stopMongo(); });

describe('Cars CRUD', () => {
  let id;

  test('reject without token', async () => {
    const r = await request(app).get('/cars');
    expect(r.status).toBe(401);
  });

  test('create', async () => {
    const r = await request(app)
      .post('/cars')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Ford', model: 'Ka', year: 2020, color: 'red' });
    expect(r.status).toBe(201);
    id = r.body._id;
  });

  test('list', async () => {
    const r = await request(app).get('/cars').set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
    expect(r.body.length).toBeGreaterThan(0);
  });

  test('get by id', async () => {
    const r = await request(app).get(`/cars/${id}`).set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
  });

  test('update', async () => {
    const r = await request(app)
      .put(`/cars/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ color: 'blue' });
    expect(r.status).toBe(200);
    expect(r.body.color).toBe('blue');
  });

  test('delete', async () => {
    const r = await request(app).delete(`/cars/${id}`).set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(204);
  });
});
