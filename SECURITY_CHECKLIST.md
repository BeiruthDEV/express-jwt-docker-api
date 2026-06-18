# Security Checklist

Relatorio resumido das medidas de seguranca aplicadas no backend e onde estao localizadas.

| Item | Status | Onde foi implementado |
|---|---|---|
| JWT no backend | OK | `src/auth.js` (sign/verify) com `JWT_SECRET` do `.env` |
| Rotas protegidas (cars, motos, clothing-brands, users) | OK | Middleware `authRequired` em `src/middlewares.js`, aplicado em cada `routes/*.js` via `router.use(authRequired)` |
| Autorizacao ADMIN nas rotas de usuarios | OK | Middleware `adminOnly` em `src/middlewares.js`, aplicado em `src/routes/users.routes.js` via `router.use(adminOnly)` |
| Validacao backend com express-validator | OK | `src/routes/auth.routes.js`, `users.routes.js`, `cars.routes.js`, `motos.routes.js`, `clothingBrands.routes.js`, middleware `validate` |
| Hash de senha com bcrypt | OK | `src/routes/auth.routes.js` (register, forgot-password) e `src/routes/users.routes.js` (create/update) |
| Comparacao de senha com bcrypt.compare | OK | `src/routes/auth.routes.js` (login) |
| Rate limit | OK | `express-rate-limit` configurado em `src/app.js` (200 req / 15 min) |
| Helmet (headers seguros) | OK | `app.use(helmet())` em `src/app.js` |
| CORS restrito | OK | `cors({ origin: ... })` em `src/app.js`, lista vinda de `CORS_ORIGIN` env (default localhost:5173 e localhost:3000) |
| Variaveis sensiveis em `.env` | OK | `JWT_SECRET`, `JWT_EXPIRES_IN`, `MONGO_URI`, `DATABASE_URL`, `CORS_ORIGIN` lidos via `dotenv` |
| Senha nunca retornada nas respostas | OK | Queries em users.routes.js selecionam `id, name, email, role` sem `password`. Login retorna `{ token, user: { id, name, email, role } }` |
| Body size limitado | OK | `express.json({ limit: '100kb' })` em `src/app.js` |
| Tratamento centralizado de erros | OK | Handler de erro em `src/app.js` retorna `Internal server error` sem stack trace |
| Forgot password com bcrypt | OK | `src/routes/auth.routes.js` POST `/auth/forgot-password` (fluxo academico simplificado) |
| Validacao de inteiros (year, foundedYear, cc) | OK | `body('year').isInt({ min, max })` em cars/motos; `foundedYear` em clothing-brands |
| Testes de acesso negado (401/403) | OK | `tests/cars.test.js`, `tests/motos.test.js`, `tests/clothingBrands.test.js`, `tests/users.test.js` |
| Testes de validacao backend (400) | OK | `tests/cars.test.js`, `tests/motos.test.js`, `tests/clothingBrands.test.js`, `tests/auth.test.js` |
| Teste de password nao retornado | OK | `tests/auth.test.js` (register/login), `tests/users.test.js` (list) |
| Swagger com Bearer Token | OK | `src/swagger.js` define `securitySchemes.bearerAuth` aplicado por default; rotas `/auth/*` usam `security: []` para abrir o endpoint |

## Resumo

- Autenticacao: JWT obrigatorio para todas as rotas de recursos.
- Autorizacao: `ADMIN` obrigatorio nas rotas de usuarios.
- Validacao: backend usa `express-validator` em todas as rotas mutaveis; frontend valida apenas para UX.
- Senhas: armazenadas com `bcrypt`, nunca retornadas em respostas.
- Headers e abuso: `helmet`, `cors` restrito e `express-rate-limit`.
- Segredos: `JWT_SECRET` e `DATABASE_URL` em `.env` (gitignored).
- Recuperacao de senha: fluxo simplificado para fins academicos; em producao, usar token temporario enviado por e-mail.
