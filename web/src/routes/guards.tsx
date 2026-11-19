import { Navigate, Outlet, useLocation } from 'react-router'
import { useIsAuthenticated } from '@/stores/auth'

export function PrivateRoute() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
