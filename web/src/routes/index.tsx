import { Navigate, Route, Routes } from 'react-router'
import { LoginPage } from '@/pages/auth/Login'
import { RecoverPasswordPage } from '@/pages/auth/RecoverPassword'
import { RegisterPage } from '@/pages/auth/Register'
import { ResetPasswordPage } from '@/pages/auth/ResetPassword'
import { CategoriesPage } from '@/pages/Categories'
import { DashboardPage } from '@/pages/Dashboard'
import { ProfilePage } from '@/pages/Profile'
import { TransactionsPage } from '@/pages/Transaction'
import { PrivateRoute, PublicOnlyRoute } from './guards'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transacoes" element={<TransactionsPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>

      {/* Acessível com ou sem sessão: o link chega por e-mail */}
      <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
