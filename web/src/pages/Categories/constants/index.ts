import { CATEGORY_ICONS, type CategoryIconName } from '@/components/category-icon'
import type { CategoryColorOption, CategoryItem } from '../types'

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: '1',
    title: 'Alimentação',
    description: 'Restaurantes, delivery e refeições',
    icon: 'utensils',
    color: 'blue',
    itemsCount: 12,
  },
  {
    id: '2',
    title: 'Entretenimento',
    description: 'Cinema, jogos e lazer',
    icon: 'ticket',
    color: 'pink',
    itemsCount: 2,
  },
  {
    id: '3',
    title: 'Investimento',
    description: 'Aplicações e retornos financeiros',
    icon: 'piggy-bank',
    color: 'green',
    itemsCount: 1,
  },
  {
    id: '4',
    title: 'Mercado',
    description: 'Compras de supermercado e mantimentos',
    icon: 'shopping-cart',
    color: 'orange',
    itemsCount: 3,
  },
  {
    id: '5',
    title: 'Salário',
    description: 'Renda mensal e bonificações',
    icon: 'briefcase-business',
    color: 'green',
    itemsCount: 3,
  },
  {
    id: '6',
    title: 'Saúde',
    description: 'Medicamentos, consultas e exames',
    icon: 'heart-pulse',
    color: 'red',
    itemsCount: 0,
  },
  {
    id: '7',
    title: 'Transporte',
    description: 'Gasolina, transporte público e viagens',
    icon: 'car-front',
    color: 'purple',
    itemsCount: 8,
  },
  {
    id: '8',
    title: 'Utilidades',
    description: 'Energia, água, internet e telefone',
    icon: 'tool-case',
    color: 'yellow',
    itemsCount: 7,
  },
]

/**
 * Total geral de transações do usuário (mesmo valor da paginação da tela de Transações).
 * Não é a soma de `itemsCount`, pois podem existir transações sem categoria.
 */
export const TOTAL_TRANSACTIONS = 27

export const CATEGORY_COLOR_OPTIONS: CategoryColorOption[] = [
  { value: 'green', label: 'Verde', swatch: 'bg-green-base' },
  { value: 'blue', label: 'Azul', swatch: 'bg-blue-base' },
  { value: 'purple', label: 'Roxo', swatch: 'bg-purple-base' },
  { value: 'pink', label: 'Rosa', swatch: 'bg-pink-base' },
  { value: 'red', label: 'Vermelho', swatch: 'bg-red-base' },
  { value: 'orange', label: 'Laranja', swatch: 'bg-orange-base' },
  { value: 'yellow', label: 'Amarelo', swatch: 'bg-yellow-base' },
]

/** Ícones disponíveis para seleção (o ícone genérico "tag" fica de fora, como no design). */
export const SELECTABLE_CATEGORY_ICONS = (Object.keys(CATEGORY_ICONS) as CategoryIconName[]).filter(
  (name) => name !== 'tag',
)

export const CATEGORY_ICON_LABELS: Partial<Record<CategoryIconName, string>> = {
  'briefcase-business': 'Maleta',
  'car-front': 'Carro',
  'heart-pulse': 'Saúde',
  'piggy-bank': 'Cofrinho',
  'shopping-cart': 'Carrinho de compras',
  ticket: 'Ingresso',
  'tool-case': 'Caixa de ferramentas',
  utensils: 'Talheres',
  'paw-print': 'Pet',
  house: 'Casa',
  gift: 'Presente',
  dumbbell: 'Academia',
  'book-open': 'Livro',
  'baggage-claim': 'Bagagem',
  mailbox: 'Correspondência',
  'receipt-text': 'Recibo',
}

export const DEFAULT_CATEGORY_ICON: CategoryIconName = 'briefcase-business'
export const DEFAULT_CATEGORY_COLOR = 'green'
