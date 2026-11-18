import type { ReactNode } from 'react'
import { Header } from '@/components/header'

export interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 p-6 sm:p-12">{children}</main>
    </div>
  )
}
