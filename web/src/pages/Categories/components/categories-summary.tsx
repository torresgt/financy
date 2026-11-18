import { ArrowUpDown, Tag as TagIcon } from 'lucide-react'
import { CATEGORY_ICONS } from '@/components/category-icon'
import type { CategoryItem } from '../types'
import { getMostUsedCategory } from '../utils/get-most-used-category'
import { SummaryStatCard } from './summary-stat-card'

export interface CategoriesSummaryProps {
  categories: CategoryItem[]
  totalTransactions: number
}

export function CategoriesSummary({ categories, totalTransactions }: CategoriesSummaryProps) {
  const mostUsed = getMostUsedCategory(categories)
  const MostUsedIcon = mostUsed ? CATEGORY_ICONS[mostUsed.icon] : TagIcon

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <SummaryStatCard
        icon={<TagIcon className="text-gray-700" />}
        value={categories.length}
        label="Total de categorias"
      />
      <SummaryStatCard
        icon={<ArrowUpDown className="text-purple-base" />}
        value={totalTransactions}
        label="Total de transações"
      />
      <SummaryStatCard
        icon={<MostUsedIcon className="text-blue-base" />}
        value={mostUsed?.title ?? '—'}
        label="Categoria mais utilizada"
      />
    </section>
  )
}
