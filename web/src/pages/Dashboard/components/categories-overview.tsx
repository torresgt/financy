import { ChevronRight } from 'lucide-react'
import { TextLink, Tag } from '@/components/ui'
import { formatCurrency } from '@/lib/format'
import { ENTER_ANIMATION, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { CategorySummaryItem } from '../types'

const SKELETON_ROWS = ['skeleton-1', 'skeleton-2', 'skeleton-3']

export interface CategoriesOverviewProps {
  categories: CategorySummaryItem[]
  loading?: boolean
  enterIndex?: number
}

export function CategoriesOverview({
  categories,
  loading = false,
  enterIndex = 0,
}: CategoriesOverviewProps) {
  return (
    <section
      className={cn(
        ENTER_ANIMATION,
        'flex flex-col self-start overflow-hidden rounded-[12px] border border-gray-200 bg-white',
      )}
      style={stagger(enterIndex)}
    >
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
        <h2 className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
          Categorias
        </h2>
        <TextLink to="/categorias">
          Gerenciar
          <ChevronRight className="size-5" />
        </TextLink>
      </header>

      <div className="flex flex-col gap-5 p-6" aria-busy={loading || undefined}>
        {loading &&
          SKELETON_ROWS.map((row) => (
            <div key={row} className="flex items-center gap-3" aria-hidden>
              <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="ml-auto h-4 w-12 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          ))}

        {!loading && categories.length === 0 && (
          <p className="py-4 text-center text-sm leading-5 font-normal text-gray-500">
            Nenhuma categoria com transações ainda.
          </p>
        )}

        {!loading && categories.map((category, index) => (
          <div
            key={category.id}
            className={cn(ENTER_ANIMATION, 'flex items-center gap-1')}
            style={stagger(enterIndex + 1 + index, { step: 50, max: 12 })}
          >
            <Tag color={category.color}>{category.title}</Tag>

            <span className="min-w-0 flex-1 text-right text-sm leading-5 font-normal text-gray-600">
              {category.itemsCount} {category.itemsCount === 1 ? 'item' : 'itens'}
            </span>

            <span className="w-22 shrink-0 text-right text-sm leading-5 font-semibold text-gray-800">
              {formatCurrency(category.totalAmount)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
