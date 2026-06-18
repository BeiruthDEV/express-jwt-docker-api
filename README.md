# Inventory Control

## Descricao

Aplicacao full stack simples de gerenciamento de cadastros, desenvolvida para avaliacao academica. O sistema permite gerenciar carros, motos, marcas de roupa e usuarios em um painel administrativo unificado. O backend fornece a API REST com autenticacao JWT e duas bases de dados (NoSQL e SQL relacional). O frontend consome essa API por meio de uma interface web responsiva em React.

## Objetivo da atividade

O objetivo foi integrar um frontend React + Tailwind CSS ao backend Node.js + Express desenvolvido anteriormente, utilizando autenticacao JWT, rotas protegidas no servidor, CRUDs integrados com dois contextos de persistencia (MongoDB e PostgreSQL) e execucao completa via Docker Compose.

## Observacao sobre escopo academico

Este projeto foi desenvolvido com foco em atender aos requisitos de uma atividade academica. Por isso, algumas decisoes foram propositalmente simplificadas para manter o escopo adequado a avaliacao. Em um ambiente de producao ou em um sistema maior, seriam adicionadas camadas extras de seguranca, observabilidade, auditoria, testes automatizados mais amplos, fluxos completos de recuperacao de senha por e-mail, controle avancado de permissoes, versionamento de API, logs estruturados, CI/CD e monitoramento.

## Tecnologias utilizadas

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- lucide-react (icones)
- logo.dev (logotipos de marcas, opcional via token)

### Backend

- Node.js 20
- Express
- jsonwebtoken (JWT)
- bcryptjs
- express-validator
- helmet
- cors
- express-rate-limit
- pg (PostgreSQL)
- mongoose (MongoDB)
- swagger-ui-express + swagger-jsdoc
- Jest + Supertest

### Bancos de dados

- MongoDB 7 (carros, motos, marcas de roupa)
- PostgreSQL 16 (usuarios)

### Infraestrutura

- Docker
- Docker Compose

## Arquitetura geral

```
express-jwt-docker-api/
  src/                          # backend
    app.js                      # configuracao Express, middlewares globais
    server.js                   # bootstrap (conecta Mongo e Postgres)
    auth.js                     # sign/verify JWT
    middlewares.js              # authRequired, adminOnly, validate
    postgres.js                 # pool pg + initPostgres()
    mongo.js                    # conexao Mongoose
    swagger.js                  # OpenAPI config + /docs
    models/                     # schemas Mongoose (Car, Moto, ClothingBrand)
    routes/                     # auth, users, cars, motos, clothingBrands
  frontend/                     # frontend
    src/
      api.js                    # cliente HTTP com Bearer token
      auth.js                   # sessao + JWT no localStorage
      pages/                    # Login, Dashboard, Cars, Motos, ClothingBrands, Users, Settings
      components/               # Layout, Sidebar, Topbar, Modal, BrandLogo, ForgotPasswordModal, ...
      constants/formOptions.js  # opcoes dos selects de CRUD
      utils/brandLogos.js       # integracao com logo.dev
  tests/                        # Jest + Supertest
  scripts/seed.js               # dados de demonstracao
  docker-compose.yml            # api, mongo, postgres, frontend
  Dockerfile                    # imagem do backend
  frontend/Dockerfile           # imagem do frontend (build + preview)
```

## Funcionalidades do frontend

- Login integrado ao backend.
- Cadastro publico de usuario (`USER`).
- Recuperacao simples de senha pela tela de login.
- Armazenamento do JWT no `localStorage`.
- Rotas protegidas no frontend (redireciona para `/login` sem token).
- Item "Usuarios" do menu visivel apenas para `ADMIN`.
- Dashboard com indicadores e ultimos cadastros.
- CRUD de carros com selects de marca/modelo dependentes.
- CRUD de motos com selects de marca/modelo dependentes e cilindrada.
- CRUD de marcas de roupa.
- CRUD de usuarios para `ADMIN`.
- Pagina de configuracoes da conta (perfil, seguranca, sistema).
- Logos reais das marcas via logo.dev com fallback de iniciais.
- Mensagens visuais de sucesso e erro.
- Estados de carregamento.
- Interface responsiva (desktop e mobile com sidebar colapsavel).

## Funcionalidades do backend

- API REST com prefixos `/api/...` e tambem nas rotas legadas sem prefixo.
- Autenticacao via JWT assinado com `JWT_SECRET`.
- Cadastro e login com `bcryptjs` (hash 10 rounds, `bcrypt.compare`).
- Middleware `authRequired` para todas as rotas de recursos.
- Middleware `adminOnly` para todas as rotas administrativas de usuarios.
- Validacao de entrada com `express-validator` em todas as rotas de escrita.
- CRUD de carros, motos e marcas de roupa em MongoDB (Mongoose).
- CRUD de usuarios em PostgreSQL (driver `pg`, tabela criada na inicializacao).
- Recuperacao simples de senha (`POST /api/auth/forgot-password`).
- Swagger em `/docs` com Bearer Token.
- Testes de integracao com Jest + Supertest.
- Hardening basico OWASP: `helmet`, `cors` restrito, `express-rate-limit`, body size limit.

## Integracao frontend e backend

- O frontend usa a variavel de ambiente `VITE_API_URL` para acessar a API.
- O token JWT e salvo no `localStorage` apos o login.
- Toda chamada autenticada envia `Authorization: Bearer <token>`.
- O backend valida autenticacao e autorizacao em cada requisicao.
- O frontend nao substitui regras de seguranca do backend.

O frontend possui validacoes e controle visual para melhorar a experiencia do usuario, porem as regras reais de seguranca sao aplicadas no backend. Assim, mesmo que uma requisicao seja feita diretamente para a API, o backend continua exigindo autenticacao, autorizacao e validacao de entrada.

## Seguranca da aplicacao

- **JWT** protege todas as rotas privadas atraves do middleware `authRequired`.
- **Autorizacao por role** via middleware `adminOnly` nas rotas de `/users`.
- **Hash de senha** com `bcryptjs` em cadastro, alteracao e recuperacao.
- **Validacao backend** com `express-validator` (notEmpty, isEmail, isInt com range, isIn).
- **Helmet** adiciona headers de seguranca por padrao.
- **CORS** restrito as origens declaradas em `CORS_ORIGIN`.
- **Rate limit** (200 req / 15 min por IP).
- **dotenv** isola segredos (`JWT_SECRET`, `DATABASE_URL`, `VITE_LOGO_DEV_TOKEN`).
- **Campo `password`** nunca aparece nas respostas.
- **Recuperacao de senha** simplificada para fins academicos. Em producao, o ideal seria token temporario enviado por e-mail.

Detalhes completos em `SECURITY_CHECKLIST.md`.

## Execucao com Docker

1. Crie o arquivo `.env` a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

2. (Opcional) Defina `VITE_LOGO_DEV_TOKEN` em `frontend/.env` para ativar logotipos reais das marcas.

3. Suba todos os servicos:

   ```bash
   docker compose up -d --build
   ```

4. Acesse:

   - Frontend: `http://localhost:5173`
   - API: `http://localhost:3000`
   - Swagger: `http://localhost:3000/docs`
   - Health check: `http://localhost:3000/health`

O fluxo principal de entrega e via Docker Compose. Nao e necessario rodar `npm run dev` manualmente.

## Rodando testes

Com os containers em execucao:

```bash
docker compose exec api npm test
```

Resultado atual: **5 suites, 41 testes, todos passando.**

## Dados de demonstracao

Com os containers em execucao:

```bash
docker compose exec api npm run seed
```

O seed cria um administrador, um usuario comum, 8 carros, 8 motos e 8 marcas de roupa. Senhas armazenadas com bcrypt.

Credenciais de demonstracao:

- **ADMIN**: `admin@test.com` / `123456`
- **USER**: `user@test.com` / `123456`

## Variaveis de ambiente

Variaveis principais (declaradas em `.env.example` na raiz e em `frontend/.env.example`):

| Variavel | Descricao |
|---|---|
| `PORT` | Porta do backend (default 3000) |
| `NODE_ENV` | Ambiente Node (`development`, `production`) |
| `JWT_SECRET` | Segredo para assinar tokens JWT |
| `JWT_EXPIRES_IN` | Tempo de expiracao do token (ex.: `1d`) |
| `MONGO_URI` | URI do MongoDB (ex.: `mongodb://mongo:27017/apidb`) |
| `DATABASE_URL` | URL do PostgreSQL |
| `CORS_ORIGIN` | Lista separada por virgula de origens permitidas |
| `VITE_API_URL` | URL da API consumida pelo frontend |
| `VITE_LOGO_DEV_TOKEN` | Token publishable do logo.dev (opcional) |

O `.env` real **nao deve ser enviado ao GitHub**. Apenas o `.env.example` esta versionado.

## Checklist dos requisitos da atividade

| Requisito | Status | Onde foi implementado |
|---|---|---|
| Frontend em React | Atendido | `frontend/src` |
| Estilizacao com Tailwind CSS | Atendido | `frontend/tailwind.config.js`, `frontend/src/index.css` |
| Frontend consome o backend | Atendido | `frontend/src/api.js` |
| Integracao completa frontend/backend | Atendido | Login + CRUDs + recuperacao + settings |
| Frontend roda em container Docker | Atendido | `frontend/Dockerfile` |
| Execucao via Docker Compose | Atendido | `docker-compose.yml` |
| Sem dependencia de `npm run dev` manual | Atendido | Compose faz build + preview |
| Tela de login integrada com JWT | Atendido | `frontend/src/pages/Login.jsx` |
| Token JWT armazenado e utilizado | Atendido | `frontend/src/auth.js`, `api.js` |
| Controle de rotas no frontend | Atendido | `components/ProtectedRoute.jsx` |
| Navegacao entre telas | Atendido | `App.jsx` + `react-router-dom` |
| CRUD de usuarios (visivel para ADMIN) | Atendido | `pages/Users.jsx` |
| CRUD de carros | Atendido | `pages/Cars.jsx` |
| CRUD de motos | Atendido | `pages/Motos.jsx` |
| CRUD de marcas de roupa | Atendido | `pages/ClothingBrands.jsx` |
| Mensagens de sucesso e erro | Atendido | `components/Modal.jsx`, `Alert.jsx`, toasts |
| Interface responsiva | Atendido | Tailwind breakpoints + sidebar colapsavel |
| Dockerfile do frontend | Atendido | `frontend/Dockerfile` |
| docker-compose com api + mongo + postgres + frontend | Atendido | `docker-compose.yml` |
| `.env.example` | Atendido | `.env.example`, `frontend/.env.example` |
| Documentacao de execucao | Atendido | Este `README.md` |

## Criterios de avaliacao atendidos

| Criterio | Como foi atendido |
|---|---|
| Correta utilizacao de React e Tailwind CSS | Componentes funcionais, hooks, utilitarios Tailwind, paleta consistente |
| Qualidade da integracao com o backend | Cliente HTTP central, Bearer token automatico, tratamento padronizado de erros |
| Funcionamento das rotas protegidas | `ProtectedRoute` no frontend + `authRequired`/`adminOnly` no backend |
| Organizacao do codigo e da interface | Separacao por `pages/`, `components/`, `constants/`, `utils/` |
| Responsividade | Layout adaptativo (mobile drawer, desktop sidebar colapsavel) |
| Funcionamento via Docker | `docker compose up -d --build` levanta API, frontend, MongoDB e PostgreSQL |
| Clareza da documentacao | README, SECURITY_CHECKLIST, FRONTEND_CHECKLIST, PROJECT_SUMMARY |

## Limitacoes e possiveis melhorias futuras

- Recuperacao de senha com token temporario enviado por e-mail.
- Upload real de foto de perfil em storage externo (S3, Cloudinary).
- Refresh token + revogacao por blacklist.
- Logs estruturados (pino, winston) com correlacao por request id.
- CI/CD com GitHub Actions executando testes e build a cada push.
- Testes E2E com Cypress ou Playwright cobrindo fluxos de login + CRUD.
- Controle granular de permissoes por recurso (RBAC ou ABAC).
- Auditoria de acoes administrativas (quem alterou, quando, o que mudou).
- Paginacao, ordenacao e filtros server-side nas listagens.
- Monitoramento e observabilidade (Prometheus, Grafana, OpenTelemetry).
- Deploy em ambiente cloud (Render, Fly.io, AWS ECS).

## Conclusao

O projeto atende aos requisitos propostos pela atividade academica, integrando frontend e backend com autenticacao JWT, CRUDs em dois bancos diferentes, execucao via Docker Compose e documentacao completa. Toda a seguranca real esta no backend; o frontend cumpre o papel de interface e oferece uma experiencia responsiva e organizada.
