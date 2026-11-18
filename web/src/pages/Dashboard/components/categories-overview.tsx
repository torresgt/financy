import { ChevronRight } from 'lucide-react'
import { TextLink, Tag } from '@/components/ui'
import { formatCurrency } from '@/lib/format'
import { ENTER_ANIMATION, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { CategorySummaryItem } from '../types'

export interface CategoriesOverviewProps {
  categories: CategorySummaryItem[]
  /** Posição do bloco na sequência de entrada da página. */
  enterIndex?: number
}

export function CategoriesOverview({ categories, enterIndex = 0 }: CategoriesOverviewProps) {
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

      <div className="flex flex-col gap-5 p-6">
        {categories.map((category, index) => (
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
