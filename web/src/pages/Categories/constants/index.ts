import { CATEGORY_ICONS, type CategoryIconName } from '@/components/category-icon'
import type { CategoryColorOption } from '../types'

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
