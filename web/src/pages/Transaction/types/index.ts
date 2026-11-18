import type { CategoryIconName } from '@/components/category-icon'
import type { CategoryColor } from '@/components/ui/tag'
import type { TransactionType } from '@/types/api'

/** Linha da tabela de transações (dados mockados até a integração com a API). */
export interface TransactionRowItem {
  id: string
  description: string
  date: string
  category: string
  color: CategoryColor
  icon: CategoryIconName
  type: TransactionType
  amount: number
}

export interface TransactionFilters {
  search: string
  type: string
  category: string
  period: string
}
