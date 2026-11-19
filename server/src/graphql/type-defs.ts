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

  input UpdateProfileInput {
    name: String!
  }

  input RequestPasswordResetInput {
    email: String!
    newPassword: String!
    confirmPassword: String!
  }

  input ConfirmPasswordResetInput {
    email: String!
    "Código de 6 dígitos recebido por e-mail"
    code: String!
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
    "Atualiza o perfil do usuário autenticado"
    updateProfile(data: UpdateProfileInput!): User!
    """
    Registra a nova senha como pendente e envia um código de 6 dígitos, se houver
    conta com o e-mail. Sempre retorna true, para não revelar quais e-mails estão
    cadastrados.
    """
    requestPasswordReset(data: RequestPasswordResetInput!): Boolean!
    "Confirma o pedido com o código recebido por e-mail e aplica a nova senha"
    confirmPasswordReset(data: ConfirmPasswordResetInput!): Boolean!

    createCategory(data: CreateCategoryInput!): Category!
    updateCategory(id: ID!, data: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(data: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, data: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
