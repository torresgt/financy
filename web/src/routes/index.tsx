import { Navigate, Route, Routes } from 'react-router'
import { LoginPage } from '@/pages/auth/Login'
import { RecoverPasswordPage } from '@/pages/auth/RecoverPassword'
import { RegisterPage } from '@/pages/auth/Register'
import { CategoriesPage } from '@/pages/Categories'
import { DashboardPage } from '@/pages/Dashboard'
import { ProfilePage } from '@/pages/Profile'
import { TransactionsPage } from '@/pages/Transaction'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transacoes" element={<TransactionsPage />} />
      <Route path="/categorias" element={<CategoriesPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
