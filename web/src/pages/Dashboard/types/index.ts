import type { CategoryIconName } from '@/components/category-icon'
import type { CategoryColor } from '@/components/ui/tag'
import type { Category, Summary, Transaction, TransactionType } from '@/types/api'

/** Cor da paleta ou hexadecimal personalizado, como vem da API. */
type ColorValue = CategoryColor | (string & {})

export interface RecentTransactionItem {
  id: string
  description: string
  date: string
  category: string
  color: ColorValue
  icon: CategoryIconName | (string & {})
  amount: number
  type: TransactionType
}

export interface CategorySummaryItem {
  id: string
  title: string
  color: ColorValue
  itemsCount: number
  totalAmount: number
}

export interface DashboardQueryData {
  balance: Pick<Summary, 'balance'>
  month: Pick<Summary, 'totalIncome' | 'totalExpense'>
  transactions: Transaction[]
  categories: Category[]
}
