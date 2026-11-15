import { Route, Routes } from 'react-router'

/**
 * Rotas da aplicação. As páginas serão adicionadas após o Figma:
 * - "/" → Login (deslogado) ou Dashboard (logado)
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={null} />
    </Routes>
  )
}
