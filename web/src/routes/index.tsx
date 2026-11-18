import { Navigate, Route, Routes } from 'react-router'
import { CategoriesPage } from '@/pages/categories'
import { DashboardPage } from '@/pages/dashboard'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { LoginPage } from '@/pages/login'
import { SignUpPage } from '@/pages/sign-up'
import { TransactionsPage } from '@/pages/transactions'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignUpPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transacoes" element={<TransactionsPage />} />
      <Route path="/categorias" element={<CategoriesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
