export type TransactionType = 'INCOME' | 'EXPENSE'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthPayload {
  token: string
  user: User
}

export interface Category {
  id: string
  title: string
  description: string | null
  icon: string
  color: string
  transactionsCount: number
  /** Soma em reais das transações vinculadas */
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  description: string
  /** Valor em reais (sempre positivo; o sinal vem do `type`) */
  amount: number
  type: TransactionType
  /** ISO 8601 (UTC) */
  date: string
  category: Category | null
  createdAt: string
  updatedAt: string
}

export interface Summary {
  balance: number
  totalIncome: number
  totalExpense: number
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RequestPasswordResetInput {
  email: string
}

export interface ResetPasswordInput {
  /** Token recebido no link enviado por e-mail */
  token: string
  newPassword: string
  confirmPassword: string
}

export interface CreateCategoryInput {
  title: string
  description?: string | null
  icon?: string
  color?: string
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>

export interface CreateTransactionInput {
  description: string
  amount: number
  type: TransactionType
  /** "YYYY-MM-DD" ou ISO 8601 */
  date: string
  categoryId?: string | null
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>

export interface TransactionFilterInput {
  search?: string
  type?: TransactionType
  categoryId?: string
  startDate?: string
  endDate?: string
}
