import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SummaryStatCardProps extends ComponentProps<'div'> {
  icon: ReactNode
  value: ReactNode
  label: string
}

export function SummaryStatCard({ icon, value, label, className, ...props }: SummaryStatCardProps) {
  return (
    <div
      data-slot="summary-stat-card"
      className={cn(
        'flex items-start gap-4 rounded-[12px] border border-gray-200 bg-white p-6',
        className,
      )}
      {...props}
    >
      <div className="flex size-8 shrink-0 items-center justify-center [&_svg]:size-6">{icon}</div>

      <div className="flex min-w-0 flex-col gap-2">
        <p className="truncate text-[28px] leading-8 font-bold text-gray-800">{value}</p>
        <span className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
          {label}
        </span>
      </div>
    </div>
  )
}
