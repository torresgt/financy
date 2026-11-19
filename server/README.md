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
| `mail:setup` | Assistente que configura o SMTP no `.env`, testa a conexão e envia um e-mail de teste |
| `mail:test -- <email>` | Envia o e-mail do código de recuperação (com código fictício) usando a configuração atual |

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `JWT_SECRET` | ✅ | — | Segredo usado para assinar os tokens |
| `DATABASE_URL` | ✅ | — | URL do SQLite (ex.: `file:./dev.db`) |
| `JWT_EXPIRES_IN` | | `7d` | Validade do token |
| `PORT` | | `4000` | Porta HTTP |
| `NODE_ENV` | | `development` | `development` \| `production` \| `test` |
| `CORS_ORIGIN` | | `*` | Origens permitidas, separadas por vírgula |
| `PASSWORD_RESET_CODE_TTL_MINUTES` | | `15` | Validade do código de redefinição de senha |
| `PASSWORD_RESET_RESEND_COOLDOWN_SECONDS` | | `60` | Intervalo mínimo entre dois envios de código para o mesmo usuário |
| `SMTP_HOST` | em produção | — | Servidor SMTP. Sem ele, em desenvolvimento, o e-mail vai para o console |
| `SMTP_PORT` / `SMTP_SECURE` | | `587` / `false` | Porta e TLS direto (`true` na porta 465) |
| `SMTP_USER` / `SMTP_PASS` | | — | Credenciais SMTP (senha de app ou chave de API) |
| `MAIL_FROM` | | `Financy <no-reply@financy.local>` | Remetente |

## Envio de e-mails

O código de recuperação de senha é enviado por SMTP para o e-mail do usuário, a partir de uma conta remetente configurada uma única vez. Funciona com qualquer provedor (Gmail, Outlook, Brevo, Resend, Amazon SES etc.).

**Configuração rápida:**

```bash
npm run mail:setup   # escolha o provedor e informe as credenciais (a senha não aparece na tela)
npm run dev          # reinicie: o log deve mostrar "✉️ SMTP pronto"
```

O assistente testa a conexão **antes** de salvar (se falhar, o `.env` não é alterado), grava as variáveis `SMTP_*`/`MAIL_FROM` e envia um e-mail de teste. Para conferir depois: `npm run mail:test -- voce@exemplo.com`. Também é possível preencher o `.env` à mão (exemplos no [`.env.example`](.env.example)).

- Ao subir, o servidor testa a conexão e o login SMTP e mostra no log `✉️ SMTP pronto` ou o motivo da falha (ex.: senha recusada).
- Falhas temporárias (rede, servidor ocupado) têm até 3 tentativas; cada conexão tem tempo-limite.
- Para não enviar e-mails em sequência, um novo código só é gerado depois de `PASSWORD_RESET_RESEND_COOLDOWN_SECONDS`; até lá, o código já enviado continua valendo.
- **Gmail**: ative a verificação em 2 etapas e gere uma "Senha de app"; o `MAIL_FROM` deve usar o mesmo endereço do `SMTP_USER`. Para produção, prefira um provedor transacional com domínio próprio (SPF/DKIM), para os e-mails não caírem no spam.
- Credenciais ficam só no `.env` (fora do git), nunca no código.

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
