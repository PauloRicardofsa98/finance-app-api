<h1 align="center">
  Finance App API
</h1>

## Sobre o Projeto

API RESTful para gerenciamento de finanças pessoais construída com Node.js e Express. Permite aos usuários controlar suas transações financeiras (receitas, despesas e investimentos) com autenticação JWT, oferecendo endpoints para criação de usuários, login com refresh tokens, e CRUD completo de transações com cálculo de saldo por período.

---

## Funcionalidades

- **Autenticação JWT** - Sistema completo com access token e refresh token
- **Gestão de Usuários** - Criação, atualização, exclusão e consulta de perfil
- **Transações Financeiras** - CRUD de receitas, despesas e investimentos
- **Cálculo de Saldo** - Balanço financeiro por período (data inicial e final)
- **Documentação Swagger** - API docs interativa em `/docs`
- **Proteção de Rotas** - Middleware de autenticação para endpoints privados

---

## Tecnologias

### Backend
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework web minimalista
- **[Prisma ORM](https://www.prisma.io/)** - ORM moderno para PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação baseada em tokens
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas
- **[Zod](https://zod.dev/)** - Validação de schemas

### DevOps & Ferramentas
- **[Docker Compose](https://docs.docker.com/compose/)** - Containerização do PostgreSQL
- **[Jest](https://jestjs.io/)** - Framework de testes unitários e E2E
- **[Swagger UI](https://swagger.io/tools/swagger-ui/)** - Documentação interativa da API
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Qualidade de código
- **[Husky](https://typicode.github.io/husky/)** - Git hooks para commits

---

## Estrutura do Projeto

```
finance-app-api/
├── prisma/
│   ├── migrations/           # Migrações do banco de dados
│   └── schema.prisma         # Schema do Prisma (User, Transaction)
├── src/
│   ├── controllers/          # Controladores HTTP
│   │   ├── transaction/      # CRUD de transações
│   │   └── user/             # CRUD de usuários
│   ├── use-cases/            # Regras de negócio
│   │   ├── transaction/      # Lógica de transações
│   │   └── user/             # Lógica de usuários (login, balance)
│   ├── repositories/         # Camada de acesso a dados (Prisma)
│   ├── middlewares/          # Auth middleware (JWT)
│   ├── routes/               # Definição de rotas
│   │   ├── users.js          # POST /, POST /login, GET/PATCH/DELETE /me
│   │   └── transactions.js   # GET/POST/PATCH/DELETE /me
│   ├── schemas/              # Validação com Zod
│   ├── errors/               # Custom errors
│   ├── adapters/             # Adapters (bcrypt, JWT, etc.)
│   └── tests/                # Testes unitários e E2E
├── docs/
│   └── swagger.json          # Documentação OpenAPI
└── docker-compose.yml        # PostgreSQL (dev e test)
```

---

## English Version

### About

RESTful API for personal finance management built with Node.js and Express. Enables users to track financial transactions (earnings, expenses, and investments) with JWT authentication, providing endpoints for user creation, login with refresh tokens, and full transaction CRUD with balance calculation by period.

### Features

- **JWT Authentication** - Complete system with access and refresh tokens
- **User Management** - Create, update, delete, and retrieve profile
- **Financial Transactions** - CRUD for earnings, expenses, and investments
- **Balance Calculation** - Financial balance by date range
- **Swagger Documentation** - Interactive API docs at `/docs`
- **Route Protection** - Authentication middleware for private endpoints

### Tech Stack

**Backend:** Node.js, Express, Prisma ORM, PostgreSQL, JWT, Bcrypt, Zod

**DevOps:** Docker Compose, Jest, Swagger UI, ESLint, Prettier, Husky
