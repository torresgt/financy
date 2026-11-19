import type { CategoryItem } from '../types'

/**
 * Retorna a categoria com mais transações (a primeira, em caso de empate) ou
 * `null` se nenhuma categoria tiver transações.
 */
export function getMostUsedCategory(categories: CategoryItem[]) {
  return categories.reduce<CategoryItem | null>(
    (top, item) =>
      item.itemsCount > 0 && (!top || item.itemsCount > top.itemsCount) ? item : top,
    null,
  )
}
