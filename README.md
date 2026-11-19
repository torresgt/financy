# Financy

Aplicação fullstack de gerenciamento de finanças pessoais, composta por uma **API GraphQL** (`server/`) e uma interface **React** (`web/`).

## Funcionalidades

- **Autenticação completa**: cadastro, login com JWT e recuperação de senha com código de 6 dígitos enviado por e-mail (ou exibido no console em desenvolvimento).
- **Dashboard**: resumo financeiro (saldo total, receitas e despesas do mês), transações recentes e visão geral por categorias.
- **Transações**: listagem com paginação, busca, filtros por tipo/categoria/período, criação, edição e exclusão.
- **Categorias**: criação e personalização com ícones e cores, estatísticas de uso e categoria mais utilizada.
- **Perfil**: atualização de dados cadastrais do usuário.

---

## Stack

### Back-end (`server/`)
- **Node.js** + **TypeScript** (ESM)
- **Apollo Server 5** + **Express 5** (GraphQL)
- **Prisma 7** + **SQLite** (`@prisma/adapter-better-sqlite3`)
- **JWT** (`jsonwebtoken`) + `bcryptjs`
- **Zod** (validação de dados e variáveis de ambiente)
- **DataLoader** (prevenção de consultas N+1)
- **Nodemailer** (envio de e-mails via SMTP com fallback para console em dev)

### Front-end (`web/`)
- **React 19** + **TypeScript** + **Vite**
- **Apollo Client 4** (GraphQL)
- **React Router 7**
- **Tailwind CSS 4** + **Radix UI** + **Lucide Icons**
- **React Hook Form** + **Zod**
- **Zustand** (gerenciamento de estado de autenticação)

---

## Pré-requisitos

- **Node.js** `>= 20.19` (recomendado Node 20 LTS ou 22 LTS)
- **npm**

> Não é necessário instalar banco de dados externo nem Docker — o projeto utiliza **SQLite** local gerenciado pelo Prisma.

---

## Como executar o projeto após clonar

Clone o repositório:

```bash
git clone <url-do-repositorio>
cd financy
```

Você precisará de **dois terminais** abertos (um para o `server` e outro para o `web`).

### 1. Subindo o Back-end (`server`)

```bash
cd server

# 1. Crie o arquivo .env a partir do exemplo (já vem configurado para desenvolvimento)
cp .env.example .env

# 2. Instale as dependências (o Prisma Client é gerado automaticamente no postinstall)
npm install

# 3. Crie o banco SQLite e aplique as migrations
npm run db:migrate

# 4. Inicie o servidor em modo de desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:4000/graphql` (com Apollo Sandbox habilitado em desenvolvimento).

> **Sobre o envio de e-mails (recuperação de senha):** Por padrão, o `SMTP_HOST` vem vazio no `.env.example` e os códigos de recuperação de senha são exibidos diretamente no **terminal do servidor**. Caso queira testar o envio real por e-mail (Gmail, Outlook, Brevo, Resend etc.), execute `npm run mail:setup` dentro de `server/`. Veja mais detalhes em [`server/README.md`](./server/README.md).

---

### 2. Subindo o Front-end (`web`)

Em outro terminal, a partir da raiz do projeto:

```bash
cd web

# 1. Crie o arquivo .env a partir do exemplo
cp .env.example .env

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento do Vite
npm run dev
```

Acesse a aplicação no navegador em **`http://localhost:5173`**.

> **Nota para Windows (PowerShell / CMD):** Caso o comando `cp` não esteja disponível, use `copy .env.example .env`.

---

## Scripts disponíveis

### Em `server/`

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor em modo watch (`tsx`) na porta `4000` |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Executa a versão compilada (`dist/server.js`) |
| `npm run typecheck` | Verifica a tipagem sem gerar arquivos |
| `npm run db:migrate` | Aplica migrations em ambiente de desenvolvimento |
| `npm run db:deploy` | Aplica migrations pendentes em produção |
| `npm run db:generate` | Regera o Prisma Client |
| `npm run db:studio` | Abre o Prisma Studio para visualizar os dados do SQLite |
| `npm run mail:setup` | Assistente interativo para configurar e testar SMTP no `.env` |
| `npm run mail:test -- <email>` | Envia um e-mail de teste com código de recuperação |

### Em `web/`

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite na porta `5173` |
| `npm run build` | Verifica tipos e gera o bundle de produção em `dist/` |
| `npm run preview` | Visualiza localmente o build de produção |
| `npm run typecheck` | Verifica a tipagem sem gerar arquivos |

---

## Estrutura do Repositório

```text
financy/
├── server/               # API GraphQL (Apollo Server + Express + Prisma + SQLite)
│   ├── prisma/           # Schema e migrations do banco de dados
│   ├── src/              # Código-fonte da API
│   └── README.md         # Documentação detalhada da API e regras de negócio
└── web/                  # Aplicação Front-end (React + Vite + Apollo Client + Tailwind)
    └── src/              # Páginas, componentes, queries GraphQL e rotas
```
