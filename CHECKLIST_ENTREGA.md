# Checklist de Entrega

| # | Requisito | Status | Arquivo(s) |
|---|---|---|---|
| 1 | A API roda com Docker. | Atendido | `Dockerfile`, `README.md` |
| 2 | O docker-compose sobe api, mongo e postgres. | Atendido | `docker-compose.yml` |
| 3 | Existe CRUD de carros no MongoDB. | Atendido | `src/routes/cars.routes.js`, `src/models/Car.js` |
| 4 | Existe CRUD de motos no MongoDB. | Atendido | `src/routes/motos.routes.js`, `src/models/Moto.js` |
| 5 | Existe CRUD de marcas de roupa no MongoDB. | Atendido | `src/routes/clothingBrands.routes.js`, `src/models/ClothingBrand.js` |
| 6 | Existe CRUD de usuarios no PostgreSQL com SQL relacional usando pg. | Atendido | `src/routes/users.routes.js`, `src/postgres.js` |
| 7 | Existe cadastro e login. | Atendido | `src/routes/auth.routes.js` |
| 8 | Login retorna JWT. | Atendido | `src/routes/auth.routes.js`, `src/auth.js` |
| 9 | Rotas protegidas exigem Authorization: Bearer token. | Atendido | `src/middlewares.js`, rotas em `src/routes/` |
| 10 | Existe role USER e ADMIN. | Atendido | `src/postgres.js`, `src/routes/auth.routes.js` |
| 11 | Rotas de usuarios exigem ADMIN. | Atendido | `src/routes/users.routes.js`, `src/middlewares.js` |
| 12 | Existe Swagger. | Atendido | `src/swagger.js`, rotas em `src/routes/` |
| 13 | Existem testes de integracao com Jest e Supertest para todos os recursos. | Atendido | `tests/*.test.js`, `tests/setup.js` |
| 14 | Existe .env.example. | Atendido | `.env.example` |
| 15 | README explica como rodar via Docker e prova que os requisitos foram atendidos. | Atendido | `README.md`, `CHECKLIST_ENTREGA.md` |
| 16 | Frontend em React com Vite. | Atendido | `frontend/src/App.jsx`, `frontend/package.json` |
| 17 | Frontend estilizado com Tailwind CSS. | Atendido | `frontend/tailwind.config.js`, `frontend/src/index.css` |
| 18 | Frontend consome o backend com JWT. | Atendido | `frontend/src/api.js`, `frontend/src/auth.js` |
| 19 | Telas de login, dashboard e CRUDs. | Atendido | `frontend/src/pages/` |
| 20 | Frontend roda via Docker Compose. | Atendido | `frontend/Dockerfile`, `docker-compose.yml` |
