# Inventory Control API + Frontend

Projeto academico simples com backend em Node.js + Express e frontend em React. A aplicacao foi feita para demonstrar autenticacao JWT, rotas protegidas, CRUDs integrados e execucao completa via Docker Compose.

O backend usa Express, JWT, bcrypt, MongoDB com Mongoose e PostgreSQL com `pg`. Carros, motos e marcas de roupa ficam no MongoDB. Usuarios ficam no PostgreSQL, em uma tabela `users` criada automaticamente na inicializacao da API. O frontend usa React com Vite e Tailwind CSS. Ele consome a API, armazena o token JWT no `localStorage` e envia `Authorization: Bearer TOKEN` nas requisicoes protegidas.

## Como rodar

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Suba tudo com Docker Compose:

```bash
docker compose up --build
```

Servicos disponiveis:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- Health check: `http://localhost:3000/health`

O fluxo principal da entrega e pelo Docker. Nao e necessario usar `npm start` ou `npm run dev` manualmente para apresentar o projeto.

## Login

A tela inicial do frontend permite login e cadastro. O cadastro publico cria usuario comum (`USER`). Para acessar a tela de usuarios, e necessario entrar com uma conta `ADMIN`, pois o backend protege as rotas de usuarios com autorizacao administrativa.

Depois do login, o backend retorna um JWT. O frontend salva esse token no navegador e usa o token automaticamente em todas as chamadas para carros, motos, marcas de roupa e usuarios.

Para criar um administrador de teste, use o Swagger ou outro cliente HTTP em `POST /api/auth/register` enviando:

```json
{
  "name": "Admin",
  "email": "admin@email.com",
  "password": "123456",
  "role": "ADMIN"
}
```

Depois acesse o frontend com esse e-mail e senha.

## Telas do frontend

- Login e cadastro.
- Dashboard com resumo dos recursos.
- Carros: listar, cadastrar, editar e remover.
- Motos: listar, cadastrar, editar e remover.
- Marcas de roupa: listar, cadastrar, editar e remover.
- Usuarios: listar, cadastrar, editar e remover, somente para `ADMIN`.

## Integracao frontend/backend

O frontend usa a variavel de ambiente:

```bash
VITE_API_URL=http://localhost:3000
```

No Docker Compose, essa variavel ja e configurada no servico `frontend`. As chamadas sao feitas para os endpoints `/api/...`, por exemplo `/api/auth/login`, `/api/cars` e `/api/users`. O backend tambem mantem as rotas antigas sem `/api` para compatibilidade.

## Testes

Com os containers em execucao:

```bash
docker compose exec api npm test
```

Os testes de integracao usam Jest e Supertest. Para MongoDB, os testes usam Mongo em memoria localmente ou o Mongo do Compose quando rodam dentro do container. Para usuarios, os testes usam mock simples do `pool.query`.

## Checklist backend

| Requisito | Status |
|---|---|
| Node.js com Express | Atendido |
| Variaveis de ambiente com `.env` ou `.env.example` | Atendido |
| Autenticacao JWT | Atendido |
| Rotas protegidas | Atendido |
| Autorizacao com USER e ADMIN | Atendido |
| CRUD de carros no MongoDB | Atendido |
| CRUD de motos no MongoDB | Atendido |
| CRUD de marcas de roupa no MongoDB | Atendido |
| CRUD de usuarios no PostgreSQL com `pg` | Atendido |
| Swagger em `/docs` | Atendido |
| Dockerfile e docker-compose | Atendido |
| Testes Jest + Supertest | Atendido |

## Checklist frontend

| Requisito | Status |
|---|---|
| React com Vite | Atendido |
| Tailwind CSS | Atendido |
| Frontend consome o backend | Atendido |
| Login integrado ao JWT | Atendido |
| Token salvo e enviado como Bearer token | Atendido |
| Controle de acesso para autenticados | Atendido |
| Tela de usuarios somente para ADMIN | Atendido |
| CRUD visual de carros | Atendido |
| CRUD visual de motos | Atendido |
| CRUD visual de marcas de roupa | Atendido |
| CRUD visual de usuarios | Atendido |
| Mensagens de sucesso e erro | Atendido |
| Estados de carregamento | Atendido |
| Interface responsiva | Atendido |
| Dockerfile do frontend | Atendido |
| Frontend no Docker Compose em `localhost:5173` | Atendido |
