import type { CSSProperties, ReactNode } from 'react'
import { AnimatedNumber } from '@/components'
import { formatCurrency } from '@/lib/format'
import { ENTER_ANIMATION } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface SummaryCardProps {
  icon: ReactNode
  label: string
  value: number
  className?: string
  style?: CSSProperties
}

export function SummaryCard({ icon, label, value, className, style }: SummaryCardProps) {
  return (
    <div
      className={cn(
        ENTER_ANIMATION,
        'flex flex-col gap-4 rounded-[12px] border border-gray-200 bg-white p-6',
        className,
      )}
      style={style}
    >
      <div className="flex items-center gap-3 [&_svg]:size-5 [&_svg]:shrink-0">
        {icon}
        <span className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
          {label}
        </span>
      </div>
      <p className="text-[28px] leading-8 font-bold text-gray-800">
        <AnimatedNumber value={value} format={formatCurrency} />
      </p>
    </div>
  )
}
