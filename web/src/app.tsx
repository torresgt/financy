import { ApolloProvider } from '@apollo/client/react'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import { apolloClient } from '@/lib/apollo'
import { AppRoutes } from '@/routes'

export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ApolloProvider>
  )
}
