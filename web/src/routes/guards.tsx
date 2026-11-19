import { Navigate, Outlet, useLocation } from 'react-router'
import { useIsAuthenticated } from '@/stores/auth'

/** Só deixa passar usuários autenticados; os demais vão para o login. */
export function PrivateRoute() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}

/** Páginas de login/cadastro: quem já está autenticado vai direto ao dashboard. */
export function PublicOnlyRoute() {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
