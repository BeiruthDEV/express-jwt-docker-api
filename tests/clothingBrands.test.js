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

describe('ClothingBrands CRUD', () => {
  let id;

  test('create', async () => {
    const r = await request(app)
      .post('/clothing-brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nike', country: 'USA', foundedYear: 1964 });
    expect(r.status).toBe(201);
    id = r.body._id;
  });

  test('list', async () => {
    const r = await request(app).get('/clothing-brands').set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
  });

  test('get by id', async () => {
    const r = await request(app).get(`/clothing-brands/${id}`).set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
    expect(r.body.name).toBe('Nike');
  });

  test('update', async () => {
    const r = await request(app)
      .put(`/clothing-brands/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ country: 'Brazil' });
    expect(r.status).toBe(200);
    expect(r.body.country).toBe('Brazil');
  });

  test('delete', async () => {
    const r = await request(app).delete(`/clothing-brands/${id}`).set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(204);
  });

  describe('Validacao backend', () => {
    test('reject create without name', async () => {
      const r = await request(app)
        .post('/clothing-brands')
        .set('Authorization', `Bearer ${token}`)
        .send({ country: 'USA' });
      expect(r.status).toBe(400);
    });

    test('reject create without country', async () => {
      const r = await request(app)
        .post('/clothing-brands')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Nike' });
      expect(r.status).toBe(400);
    });

    test('reject access without token', async () => {
      const r = await request(app).get('/clothing-brands');
      expect(r.status).toBe(401);
    });
  });
});
