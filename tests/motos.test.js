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

describe('Motos CRUD', () => {
  let id;

  test('create', async () => {
    const r = await request(app)
      .post('/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Honda', model: 'CG', year: 2021, cc: 160 });
    expect(r.status).toBe(201);
    id = r.body._id;
  });

  test('list', async () => {
    const r = await request(app).get('/motos').set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
  });

  test('get by id', async () => {
    const r = await request(app).get(`/motos/${id}`).set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
    expect(r.body.model).toBe('CG');
  });

  test('update', async () => {
    const r = await request(app)
      .put(`/motos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ cc: 250 });
    expect(r.status).toBe(200);
    expect(r.body.cc).toBe(250);
  });

  test('delete', async () => {
    const r = await request(app).delete(`/motos/${id}`).set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(204);
  });

  describe('Validacao backend', () => {
    test('reject create without required fields', async () => {
      const r = await request(app)
        .post('/motos')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(r.status).toBe(400);
    });

    test('reject access without token', async () => {
      const r = await request(app).get('/motos');
      expect(r.status).toBe(401);
    });
  });
});
