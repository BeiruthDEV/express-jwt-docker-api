# Express JWT Docker API

API simples em Node.js + Express para atividade academica de 2 pontos.

O projeto usa:

- MongoDB com Mongoose para carros, motos e marcas de roupa.
- PostgreSQL com `pg` para usuarios.
- Cadastro e login com JWT.
- Rotas protegidas por `Authorization: Bearer <token>`.
- Roles `USER` e `ADMIN`.
- Rotas de usuarios permitidas somente para `ADMIN`.
- Swagger em `/docs`.
- Testes de integracao com Jest e Supertest.
- Docker Compose com `api`, `mongo` e `postgres`.

## Como rodar com Docker

```bash
cp .env.example .env
docker compose up --build
```

Depois de subir:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- Health check: `http://localhost:3000/health`

A API chama `initPostgres()` ao iniciar e cria automaticamente a tabela `users` no PostgreSQL se ela ainda nao existir.

## Como rodar os testes

```bash
npm install
npm test
```

Ou, com a API rodando no Docker:

```bash
docker compose exec api npm test
```

Os testes usam Jest + Supertest. Para MongoDB, usam `mongodb-memory-server`. Para usuarios, usam mock simples do `pool.query`, mantendo os testes rapidos e sem depender dos bancos reais.

## Endpoints principais

### Auth publico

- `POST /auth/register` cria usuario com `name`, `email`, `password` e `role` opcional (`USER` ou `ADMIN`).
- `POST /auth/login` retorna `{ token, user }`.

### Users somente ADMIN

- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

### Cars com JWT

- `GET /cars`
- `POST /cars`
- `GET /cars/:id`
- `PUT /cars/:id`
- `DELETE /cars/:id`

### Motos com JWT

- `GET /motos`
- `POST /motos`
- `GET /motos/:id`
- `PUT /motos/:id`
- `DELETE /motos/:id`

### Clothing Brands com JWT

- `GET /clothing-brands`
- `POST /clothing-brands`
- `GET /clothing-brands/:id`
- `PUT /clothing-brands/:id`
- `DELETE /clothing-brands/:id`

## Prova dos requisitos

| Requisito | Onde esta |
|---|---|
| API roda com Docker | `Dockerfile` |
| Compose sobe api, mongo e postgres | `docker-compose.yml` |
| CRUD de carros no MongoDB | `src/routes/cars.routes.js`, `src/models/Car.js` |
| CRUD de motos no MongoDB | `src/routes/motos.routes.js`, `src/models/Moto.js` |
| CRUD de marcas de roupa no MongoDB | `src/routes/clothingBrands.routes.js`, `src/models/ClothingBrand.js` |
| CRUD de usuarios no PostgreSQL com pg | `src/routes/users.routes.js`, `src/postgres.js` |
| Cadastro e login | `src/routes/auth.routes.js` |
| Login retorna JWT | `src/auth.js`, `src/routes/auth.routes.js` |
| Rotas protegidas exigem Bearer token | `src/middlewares.js` |
| Roles USER e ADMIN | `src/postgres.js`, `src/routes/auth.routes.js` |
| Rotas de usuarios exigem ADMIN | `src/routes/users.routes.js` |
| Swagger | `src/swagger.js` |
| Testes de integracao | `tests/*.test.js` |
| `.env.example` | `.env.example` |
| Checklist final | `CHECKLIST_ENTREGA.md` |
