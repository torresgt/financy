import { SquarePen, Trash } from 'lucide-react'
import type { ComponentProps } from 'react'
import { CategoryIconBox, type CategoryIconName } from '@/components/category-icon'
import { IconButton } from '@/components/ui/icon-button'
import { Tag } from '@/components/ui/tag'
import { cn } from '@/lib/utils'
import type { CategoryColorValue } from '../types'

export interface CategoryCardProps extends Omit<ComponentProps<'article'>, 'color'> {
  title: string
  description?: string | null
  icon: CategoryIconName | (string & {})
  color: CategoryColorValue
  itemsCount: number
  onEdit?: () => void
  onDelete?: () => void
}

export function CategoryCard({
  title,
  description,
  icon,
  color,
  itemsCount,
  onEdit,
  onDelete,
  className,
  ...props
}: CategoryCardProps) {
  return (
    <article
      data-slot="category-card"
      className={cn(
        'group flex flex-col gap-5 rounded-[12px] border border-gray-200 bg-white p-6',
        'transition-[translate,box-shadow,border-color] duration-300 ease-(--ease-out-expo)',
        'hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_24px_-12px_rgba(17,24,39,0.18)]',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <CategoryIconBox
          icon={icon}
          color={color}
          className="transition-transform duration-300 ease-(--ease-spring) group-hover:scale-110 group-hover:-rotate-6"
        />

        <div className="flex items-center gap-2">
          <IconButton variant="danger" aria-label={`Excluir ${title}`} onClick={onDelete}>
            <Trash />
          </IconButton>
          <IconButton aria-label={`Editar ${title}`} onClick={onEdit}>
            <SquarePen />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="truncate text-base leading-6 font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="line-clamp-2 text-sm leading-5 font-normal text-gray-600">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Tag color={color}>{title}</Tag>
        <span className="text-sm leading-5 font-normal whitespace-nowrap text-gray-600">
          {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
        </span>
      </div>
    </article>
  )
}
