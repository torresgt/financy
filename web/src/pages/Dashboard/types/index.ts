import type { CategoryIconName } from '@/components/category-icon'
import type { CategoryColor } from '@/components/ui/tag'
import type { TransactionType } from '@/types/api'

export interface RecentTransactionItem {
  id: string
  description: string
  date: string
  category: string
  color: CategoryColor
  icon: CategoryIconName
  amount: number
  type: TransactionType
}

export interface CategorySummaryItem {
  id: string
  title: string
  color: CategoryColor
  itemsCount: number
  totalAmount: number
}
