import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/types/api'

export interface TransactionTypeBadgeProps extends ComponentProps<'div'> {
  type: TransactionType
}

export function TransactionTypeBadge({
  type,
  className,
  ...props
}: TransactionTypeBadgeProps) {
  const isIncome = type === 'INCOME'

  return (
    <div
      data-slot="transaction-type"
      className={cn('inline-flex items-center justify-center gap-2', className)}
      {...props}
    >
      {isIncome ? (
        <>
          <CircleArrowUp className="size-4 shrink-0 text-green-base" />
          <span className="text-sm leading-5 font-medium whitespace-nowrap text-green-dark">
            Entrada
          </span>
        </>
      ) : (
        <>
          <CircleArrowDown className="size-4 shrink-0 text-red-base" />
          <span className="text-sm leading-5 font-medium whitespace-nowrap text-red-dark">
            Saída
          </span>
        </>
      )}
    </div>
  )
}
