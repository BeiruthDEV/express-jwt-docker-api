# Inventory Control — Resumo do Projeto

## O que e o projeto

Inventory Control e uma aplicacao full stack desenvolvida para avaliacao academica. Trata-se de um painel administrativo que centraliza o cadastro de carros, motos, marcas de roupa e usuarios. O backend expoe uma API REST autenticada por JWT e o frontend oferece uma interface web responsiva para operar o sistema.

## Tecnologias

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, lucide-react.
- **Backend**: Node.js 20, Express, jsonwebtoken, bcryptjs, express-validator, helmet, cors, express-rate-limit, Swagger.
- **Persistencia**: MongoDB 7 (recursos de catalogo) e PostgreSQL 16 (usuarios).
- **Testes**: Jest + Supertest.
- **Infraestrutura**: Docker + Docker Compose.

## Integracao frontend e backend

O frontend usa a variavel `VITE_API_URL` para localizar a API. Em todas as requisicoes protegidas, o cliente HTTP envia automaticamente o header `Authorization: Bearer <token>`. O JWT e obtido no login e armazenado em `localStorage`. O frontend tambem oculta visualmente menus baseados na role do usuario, mas a regra real esta no backend.

## Autenticacao e autorizacao

- O login (`POST /api/auth/login`) retorna um JWT assinado com `JWT_SECRET`.
- O middleware `authRequired` exige o Bearer token em todas as rotas privadas.
- O middleware `adminOnly` exige role `ADMIN` para rotas de `/users`.
- Senhas sao armazenadas com `bcryptjs` (10 rounds) e comparadas com `bcrypt.compare`.
- O frontend salva o token no `localStorage` e o limpa no logout ou em resposta 401.
- O fluxo de recuperacao de senha e simplificado para fins academicos: o usuario informa e-mail e nova senha; em producao, o ideal seria token temporario por e-mail.

## CRUDs

- **Carros** (MongoDB): `brand`, `model`, `year`, `color`.
- **Motos** (MongoDB): `brand`, `model`, `year`, `cc`.
- **Marcas de roupa** (MongoDB): `name`, `country`, `foundedYear`.
- **Usuarios** (PostgreSQL): `id`, `name`, `email`, `password` (bcrypt), `role`.

Todos os CRUDs sao executados via API REST autenticada. O frontend usa selects controlados (marca e modelo dependentes) para reduzir entrada invalida, mas o backend valida novamente com `express-validator` (ranges numericos, campos obrigatorios, roles permitidas).

## Execucao via Docker

A entrega principal e via Docker Compose. Depois de criar o `.env` a partir de `.env.example`, basta executar:

```bash
docker compose up -d --build
```

Os servicos sobem nas portas:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

Os testes de integracao rodam dentro do container:

```bash
docker compose exec api npm test
```

## O que foi simplificado por ser atividade academica

- Recuperacao de senha sem envio de e-mail (apenas valida o e-mail no banco).
- Upload de avatar persistido em `localStorage` (sem storage externo).
- Sem refresh token, sem blacklist de JWT.
- Sem CI/CD configurado.
- Sem logs estruturados, sem observabilidade.
- Sem deploy em ambiente cloud.

Essas decisoes mantem o escopo proporcional a avaliacao, sem mascarar boas praticas. As regras de seguranca essenciais (autenticacao, autorizacao, validacao backend, hash de senha, headers seguros, rate limit) estao implementadas e cobertas por testes.

## O que seria feito em producao

- Recuperacao de senha com token temporario assinado e expiracao curta, enviado por e-mail.
- Upload de imagem em S3/Cloudinary com URL assinada.
- Refresh token + revogacao.
- Logs estruturados com correlacao por request id.
- Pipeline CI/CD executando testes, build e deploy automatico.
- Testes E2E com Cypress ou Playwright.
- Paginacao, ordenacao e filtros server-side.
- Monitoramento com Prometheus/Grafana, alertas e tracing distribuido.
- Controle de permissoes mais granular (RBAC ou ABAC).
- Auditoria de acoes administrativas.

## Estado final da entrega

- Backend: 5 suites de teste, 41 testes passando.
- Frontend: build de producao funcionando (`npm run build`).
- Docker Compose: 4 servicos saudaveis (api, mongo, postgres, frontend).
- Documentacao: `README.md`, `FRONTEND_CHECKLIST.md`, `SECURITY_CHECKLIST.md`, `PROJECT_SUMMARY.md`.
