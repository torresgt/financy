import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface DividerProps extends ComponentProps<'div'> {
  label?: string
}

export function Divider({ label, className, ...props }: DividerProps) {
  if (!label) {
    return (
      <div
        className={cn('h-px w-full border-t border-gray-300', className)}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn('flex w-full items-center justify-center gap-3', className)}
      {...props}
    >
      <div className="h-px flex-1 border-t border-gray-300" />
      <span className="shrink-0 text-sm leading-5 font-normal text-gray-500">{label}</span>
      <div className="h-px flex-1 border-t border-gray-300" />
    </div>
  )
}
