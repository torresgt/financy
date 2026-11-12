# Financy — API (back-end)

API GraphQL para organizar finanças pessoais: cadastro e login de usuários, além do gerenciamento de **transações** e **categorias**. Cada usuário só vê e altera os próprios dados.

## Stack

- **TypeScript** + Node.js (ESM)
- **GraphQL** com Apollo Server 5 + Express 5
- **Prisma 7** + **SQLite** (driver adapter `better-sqlite3`)
- JWT (`jsonwebtoken`) + `bcryptjs` para autenticação
- `zod` para validar entradas e variáveis de ambiente
- `dataloader` para evitar consultas N+1
- CORS habilitado (origens definidas por variável de ambiente)

## Como rodar

```bash
cp .env.example .env        # preencha o JWT_SECRET
npm install                 # instala dependências e gera o Prisma Client
npm run db:migrate          # cria o banco SQLite e aplica as migrations
npm run dev                 # http://localhost:4000/graphql
```

Para produção: `npm run build && npm run db:deploy && npm start`.

### Scripts

| Script | Descrição |
| --- | --- |
| `dev` | Inicia em modo watch (tsx) |
| `build` / `start` | Compila para `dist/` e executa |
| `typecheck` | Verificação de tipos |
| `db:migrate` | Cria e aplica migrations (desenvolvimento) |
| `db:deploy` | Aplica migrations (produção) |
| `db:generate` | Gera o Prisma Client |
| `db:studio` | Abre o Prisma Studio |

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `JWT_SECRET` | ✅ | — | Segredo usado para assinar os tokens |
| `DATABASE_URL` | ✅ | — | URL do SQLite (ex.: `file:./dev.db`) |
| `JWT_EXPIRES_IN` | | `7d` | Validade do token |
| `PORT` | | `4000` | Porta HTTP |
| `NODE_ENV` | | `development` | `development` \| `production` \| `test` |
| `CORS_ORIGIN` | | `*` | Origens permitidas, separadas por vírgula |

## Autenticação

`register` e `login` retornam `{ token, user }`. Nas demais operações, envie o token no cabeçalho:

```
Authorization: Bearer <token>
```

## Schema (resumo)

```graphql
type Query {
  me: User!
  categories: [Category!]!
  category(id: ID!): Category!
  transactions(filter: TransactionFilterInput): [Transaction!]!
  transaction(id: ID!): Transaction!
  summary(filter: TransactionFilterInput): Summary!   # saldo, entradas e saídas
}

type Mutation {
  register(data: RegisterInput!): AuthPayload!
  login(data: LoginInput!): AuthPayload!

  createCategory(data: CreateCategoryInput!): Category!
  updateCategory(id: ID!, data: UpdateCategoryInput!): Category!
  deleteCategory(id: ID!): Boolean!

  createTransaction(data: CreateTransactionInput!): Transaction!
  updateTransaction(id: ID!, data: UpdateTransactionInput!): Transaction!
  deleteTransaction(id: ID!): Boolean!
}
```

O schema completo fica em [`src/graphql/type-defs.ts`](src/graphql/type-defs.ts) e pode ser explorado pelo Apollo Sandbox em `http://localhost:4000/graphql` (a introspecção fica desativada em produção).

### Exemplo

```graphql
mutation {
  createTransaction(data: {
    description: "Supermercado"
    amount: 150.35
    type: EXPENSE
    date: "2026-11-10"
    categoryId: "<id-da-categoria>"
  }) {
    id amount type date
    category { title color }
  }
}
```

## Regras de negócio

- E-mail único (salvo em minúsculas); senha com no mínimo 8 caracteres, guardada com hash bcrypt.
- Todas as consultas são filtradas pelo usuário autenticado. Acessar um recurso de outro usuário retorna `NOT_FOUND`.
- Os títulos de categoria são únicos por usuário, sem diferenciar maiúsculas de minúsculas.
- Ao excluir uma categoria, as transações ligadas a ela são **mantidas** e ficam sem categoria.
- Os valores são enviados e retornados em reais (`Float`), mas ficam guardados em **centavos** (`Int`) no banco para evitar erros de ponto flutuante.
- Os erros seguem um padrão em `extensions.code`: `UNAUTHENTICATED`, `BAD_USER_INPUT` (com `fieldErrors`), `NOT_FOUND` e `CONFLICT`.

## Estrutura

```
prisma/
  schema.prisma          # modelos User, Category, Transaction
  migrations/
src/
  server.ts              # Express + Apollo + CORS + /health
  env.ts                 # validação das variáveis de ambiente
  errors/                # erros de domínio (GraphQLError)
  lib/                   # prisma, auth (JWT/bcrypt), conversão de valores
  validators/            # schemas zod
  services/              # regras de negócio (auth, category, transaction)
  graphql/               # typeDefs, resolvers, context, dataloaders, scalars
```
