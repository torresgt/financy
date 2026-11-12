import { gql } from 'graphql-tag'

export const typeDefs = gql`
  """
  Data/hora no formato ISO 8601 (ex.: 2026-11-12T17:00:00.000Z ou 2026-11-12)
  """
  scalar DateTime

  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    title: String!
    description: String
    icon: String!
    color: String!
    "Quantidade de transações vinculadas à categoria"
    transactionsCount: Int!
    "Soma (em reais) das transações vinculadas à categoria"
    totalAmount: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Transaction {
    id: ID!
    description: String!
    "Valor em reais (sempre positivo; o sinal é dado pelo tipo)"
    amount: Float!
    type: TransactionType!
    date: DateTime!
    category: Category
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Summary {
    balance: Float!
    totalIncome: Float!
    totalExpense: Float!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateCategoryInput {
    title: String!
    description: String
    icon: String
    color: String
  }

  input UpdateCategoryInput {
    title: String
    description: String
    icon: String
    color: String
  }

  input CreateTransactionInput {
    description: String!
    amount: Float!
    type: TransactionType!
    date: DateTime!
    categoryId: ID
  }

  input UpdateTransactionInput {
    description: String
    amount: Float
    type: TransactionType
    date: DateTime
    "Envie null para remover a categoria da transação"
    categoryId: ID
  }

  input TransactionFilterInput {
    "Busca pela descrição"
    search: String
    type: TransactionType
    categoryId: ID
    startDate: DateTime
    endDate: DateTime
  }

  type Query {
    "Usuário autenticado"
    me: User!

    categories: [Category!]!
    category(id: ID!): Category!

    transactions(filter: TransactionFilterInput): [Transaction!]!
    transaction(id: ID!): Transaction!

    "Resumo financeiro (saldo, entradas e saídas)"
    summary(filter: TransactionFilterInput): Summary!
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
`
