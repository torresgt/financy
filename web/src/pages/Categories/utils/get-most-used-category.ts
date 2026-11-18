import type { CategoryItem } from '../types'

/** Retorna a categoria com mais transações (a primeira, em caso de empate) ou `null` se a lista estiver vazia. */
export function getMostUsedCategory(categories: CategoryItem[]) {
  return categories.reduce<CategoryItem | null>(
    (top, item) => (!top || item.itemsCount > top.itemsCount ? item : top),
    null,
  )
}
