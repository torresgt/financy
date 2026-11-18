import { ChevronRight } from 'lucide-react'
import { TextLink } from '@/components/ui/link'
import { Tag } from '@/components/ui/tag'
import { formatCurrency } from '@/lib/format'
import type { CategorySummaryItem } from '../types'

export interface CategoriesOverviewProps {
  categories: CategorySummaryItem[]
}

export function CategoriesOverview({ categories }: CategoriesOverviewProps) {
  return (
    <section className="flex flex-col self-start overflow-hidden rounded-[12px] border border-gray-200 bg-white">
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
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-1">
            <Tag color={category.color}>{category.title}</Tag>

            <span className="min-w-0 flex-1 text-right text-sm leading-5 font-normal text-gray-600">
              {category.itemsCount} {category.itemsCount === 1 ? 'item' : 'itens'}
            </span>

            <span className="w-[88px] shrink-0 text-right text-sm leading-5 font-semibold text-gray-800">
              {formatCurrency(category.totalAmount)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
