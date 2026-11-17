import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/utils'

export interface PaginationButtonProps extends ComponentProps<'button'> {
  active?: boolean
}

export function PaginationButton({
  active = false,
  className,
  type = 'button',
  ...props
}: PaginationButtonProps) {
  return (
    <button
      data-slot="pagination-button"
      data-active={active || undefined}
      type={type}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm leading-5 font-medium transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-brand-base/30',
        'disabled:pointer-events-none disabled:opacity-50',
        active
          ? 'bg-brand-base text-white hover:bg-brand-dark'
          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-200',
        className,
      )}
      {...props}
    />
  )
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1)

  return (
    <div
      data-slot="pagination"
      className={cn('flex items-center justify-between px-6 py-5', className)}
    >
      <p className="text-sm leading-5 font-normal text-gray-700">
        <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> |{' '}
        <span className="font-medium">{totalItems}</span>{' '}
        {totalItems === 1 ? 'resultado' : 'resultados'}
      </p>

      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Página anterior"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft />
        </IconButton>

        {pages.map((page) => (
          <PaginationButton
            key={page}
            active={page === currentPage}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationButton>
        ))}

        <IconButton
          aria-label="Próxima página"
          disabled={currentPage >= safeTotalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight />
        </IconButton>
      </div>
    </div>
  )
}
