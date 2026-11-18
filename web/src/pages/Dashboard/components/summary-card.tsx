import type { ReactNode } from 'react'
import { formatCurrency } from '@/lib/format'

export interface SummaryCardProps {
  icon: ReactNode
  label: string
  /** Valor em reais. */
  value: number
}

export function SummaryCard({ icon, label, value }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3 [&_svg]:size-5 [&_svg]:shrink-0">
        {icon}
        <span className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
          {label}
        </span>
      </div>
      <p className="text-[28px] leading-8 font-bold text-gray-800">{formatCurrency(value)}</p>
    </div>
  )
}
