import type { CategoryIconName } from '@/components/category-icon'
import type { CategoryColor } from '@/components/ui/tag'
import type { TransactionType } from '@/types/api'

/** Linha da tabela de transações, já formatada para exibição. */
export interface TransactionRowItem {
  id: string
  description: string
  date: string
  category: string
  /** Cor da paleta ou hexadecimal personalizado, como vem da API. */
  color: CategoryColor | (string & {})
  icon: CategoryIconName | (string & {})
  type: TransactionType
  amount: number
}

/** Valores dos filtros da tela ("ALL" = sem filtro). */
export interface TransactionFilters {
  search: string
  type: 'ALL' | TransactionType
  /** Id da categoria ou "ALL" */
  category: string
  /** Mês no formato "yyyy-MM" ou "ALL" */
  period: string
}
