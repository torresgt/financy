import { Link, NavLink } from 'react-router'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transacoes', label: 'Transações' },
  { to: '/categorias', label: 'Categorias' },
]

export interface HeaderProps {
  initials?: string
}

export function Header({ initials = 'CT' }: HeaderProps) {
  return (
    <header className="w-full border-b border-gray-200 bg-white px-6 py-4 sm:px-12">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/dashboard" aria-label="Financy - Ir para o Dashboard">
          <Logo className="h-6 w-25" />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-5 sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm leading-5 whitespace-nowrap transition-colors',
                  isActive
                    ? 'font-semibold text-brand-base'
                    : 'font-normal text-gray-600 hover:text-gray-800',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/perfil"
          aria-label="Perfil do usuário"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-300 text-sm leading-5 font-medium text-gray-800 transition-opacity hover:opacity-90"
        >
          {initials}
        </Link>
      </div>
    </header>
  )
}
