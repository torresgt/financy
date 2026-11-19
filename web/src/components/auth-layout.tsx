import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'
import { ENTER_ANIMATION, stagger } from '@/lib/motion'

export interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-6 sm:p-12">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Logo className="animate-page-in" />

        <main
          className={`${ENTER_ANIMATION} flex w-full flex-col gap-8 rounded-[12px] border border-gray-200 bg-white p-6 sm:p-8`}
          style={stagger(1, { step: 100 })}
        >
          <header className="flex flex-col items-center justify-center gap-1 text-center">
            <h1 className="text-xl leading-7 font-bold text-gray-800">{title}</h1>
            <p className="text-base leading-6 font-normal text-gray-600">{subtitle}</p>
          </header>

          {children}
        </main>
      </div>
    </div>
  )
}
