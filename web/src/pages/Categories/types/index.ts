import type { CategoryIconName } from '@/components/category-icon'
import type { CategoryColor } from '@/components/ui/tag'

/** Cor da paleta (ex.: "green") ou hexadecimal personalizado (#rrggbb). */
export type CategoryColorValue = CategoryColor | (string & {})

/** Categoria como exibida na tela (dados mockados até a integração com a API). */
export interface CategoryItem {
  id: string
  title: string
  description: string
  icon: CategoryIconName
  color: CategoryColorValue
  itemsCount: number
}

export interface CategoryColorOption {
  value: CategoryColor
  label: string
  /** Classe Tailwind de fundo usada na amostra da cor. */
  swatch: string
}
