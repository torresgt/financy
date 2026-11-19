import type { ReactNode } from 'react'
import { ENTER_ANIMATION } from '@/lib/motion'

export interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className={`${ENTER_ANIMATION} flex flex-wrap items-center justify-between gap-4`}>
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl leading-8 font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="text-base leading-6 font-normal text-gray-600">{description}</p>
        )}
      </div>

      {action}
    </header>
  )
}
