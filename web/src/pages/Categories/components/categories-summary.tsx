import { ArrowUpDown, Tag as TagIcon } from 'lucide-react'
import { AnimatedNumber, CATEGORY_ICONS, type CategoryIconName } from '@/components'
import { ENTER_ANIMATION, stagger } from '@/lib/motion'
import type { CategoryItem } from '../types'
import { getMostUsedCategory } from '../utils/get-most-used-category'
import { SummaryStatCard } from './summary-stat-card'

export interface CategoriesSummaryProps {
  categories: CategoryItem[]
  totalTransactions: number
  enterIndex?: number
}

export function CategoriesSummary({
  categories,
  totalTransactions,
  enterIndex = 0,
}: CategoriesSummaryProps) {
  const mostUsed = getMostUsedCategory(categories)
  const MostUsedIcon = (mostUsed && CATEGORY_ICONS[mostUsed.icon as CategoryIconName]) || TagIcon

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <SummaryStatCard
        className={ENTER_ANIMATION}
        style={stagger(enterIndex)}
        icon={<TagIcon className="text-gray-700" />}
        value={<AnimatedNumber value={categories.length} />}
        label="Total de categorias"
      />
      <SummaryStatCard
        className={ENTER_ANIMATION}
        style={stagger(enterIndex + 1)}
        icon={<ArrowUpDown className="text-purple-base" />}
        value={<AnimatedNumber value={totalTransactions} />}
        label="Total de transações"
      />
      <SummaryStatCard
        className={ENTER_ANIMATION}
        style={stagger(enterIndex + 2)}
        icon={<MostUsedIcon className="text-blue-base" />}
        text={mostUsed?.title ?? '—'}
        label="Categoria mais utilizada"
      />
    </section>
  )
}
