import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const AVG_CHAR_WIDTH_EM = 0.62
const MAX_FONT_PX = 28
const MIN_FONT_PX = 16

function fitFontSize(text: string): CSSProperties {
  const chars = Math.max(text.length, 1)
  return {
    fontSize: `clamp(${MIN_FONT_PX}px, calc(100cqi / ${(chars * AVG_CHAR_WIDTH_EM).toFixed(2)}), ${MAX_FONT_PX}px)`,
    lineHeight: 1.15,
  }
}

export interface SummaryStatCardProps extends ComponentProps<'div'> {
  icon: ReactNode
  label: string
  value?: ReactNode
  text?: string
}

export function SummaryStatCard({
  icon,
  label,
  value,
  text,
  className,
  ...props
}: SummaryStatCardProps) {
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

      <div className="@container flex min-w-0 flex-1 flex-col gap-2">
        {text === undefined ? (
          <p className="truncate text-[28px] leading-8 font-bold text-gray-800">{value}</p>
        ) : (
          <p
            key={text}
            title={text}
            style={fitFontSize(text)}
            className="line-clamp-2 animate-fade-up font-bold wrap-break-words text-gray-800"
          >
            {text}
          </p>
        )}
        <span className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
          {label}
        </span>
      </div>
    </div>
  )
}
