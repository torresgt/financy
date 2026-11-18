import type { SelectOption } from '@/components/ui/select'
import type { TransactionFilters, TransactionRowItem } from '../types'

export const TRANSACTIONS_DATA: TransactionRowItem[] = [
  {
    id: '1',
    description: 'Jantar no Restaurante',
    date: '30/11/25',
    category: 'Alimentação',
    color: 'blue',
    icon: 'utensils',
    type: 'EXPENSE',
    amount: 89.5,
  },
  {
    id: '2',
    description: 'Posto de Gasolina',
    date: '29/11/25',
    category: 'Transporte',
    color: 'purple',
    icon: 'car-front',
    type: 'EXPENSE',
    amount: 100.0,
  },
  {
    id: '3',
    description: 'Compras no Mercado',
    date: '28/11/25',
    category: 'Mercado',
    color: 'orange',
    icon: 'shopping-cart',
    type: 'EXPENSE',
    amount: 156.8,
  },
  {
    id: '4',
    description: 'Retorno de Investimento',
    date: '26/11/25',
    category: 'Investimento',
    color: 'green',
    icon: 'piggy-bank',
    type: 'INCOME',
    amount: 340.25,
  },
  {
    id: '5',
    description: 'Aluguel',
    date: '26/11/25',
    category: 'Utilidades',
    color: 'yellow',
    icon: 'tool-case',
    type: 'EXPENSE',
    amount: 1700.0,
  },
  {
    id: '6',
    description: 'Freelance',
    date: '24/11/25',
    category: 'Salário',
    color: 'green',
    icon: 'briefcase-business',
    type: 'INCOME',
    amount: 2500.0,
  },
  {
    id: '7',
    description: 'Compras Jantar',
    date: '22/11/25',
    category: 'Mercado',
    color: 'orange',
    icon: 'shopping-cart',
    type: 'EXPENSE',
    amount: 150.0,
  },
  {
    id: '8',
    description: 'Cinema',
    date: '18/12/25',
    category: 'Entretenimento',
    color: 'pink',
    icon: 'ticket',
    type: 'EXPENSE',
    amount: 88.0,
  },
]

export const TYPE_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'mercado', label: 'Mercado' },
  { value: 'investimento', label: 'Investimento' },
  { value: 'utilidades', label: 'Utilidades' },
  { value: 'salario', label: 'Salário' },
  { value: 'entretenimento', label: 'Entretenimento' },
]

/** Categorias selecionáveis no formulário (sem a opção "Todas" do filtro). */
export const CATEGORY_FORM_OPTIONS = CATEGORY_OPTIONS.filter((option) => option.value !== 'ALL')

export const PERIOD_OPTIONS: SelectOption[] = [
  { value: '2025-11', label: 'Novembro / 2025' },
  { value: '2025-12', label: 'Dezembro / 2025' },
  { value: '2026-01', label: 'Janeiro / 2026' },
  { value: 'ALL', label: 'Todo o período' },
]

export const INITIAL_FILTERS: TransactionFilters = {
  search: '',
  type: 'ALL',
  category: 'ALL',
  period: '2025-11',
}

/** Paginação mockada até a integração com a API. */
export const PAGINATION_MOCK = {
  totalPages: 3,
  totalItems: 27,
  pageSize: 10,
}
