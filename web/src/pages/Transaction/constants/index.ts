import type { SelectOption } from '@/components/ui/select'

/** Transações por página na tabela. */
export const PAGE_SIZE = 10

/** Quantos meses (a partir do atual, para trás) aparecem no filtro de período. */
export const PERIOD_MONTHS = 12

export const TYPE_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

export const ALL_CATEGORIES_OPTION: SelectOption = { value: 'ALL', label: 'Todas' }

export const ALL_PERIODS_OPTION: SelectOption = { value: 'ALL', label: 'Todo o período' }
