import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { env } from '@/env'
import { useAuthStore } from '@/stores/auth'

const httpLink = new HttpLink({ uri: env.VITE_BACKEND_URL })

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token

  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

const errorLink = new ErrorLink(({ error }) => {
  if (!CombinedGraphQLErrors.is(error)) return

  const isUnauthenticated = error.errors.some((err) => err.extensions?.code === 'UNAUTHENTICATED')

  if (isUnauthenticated && useAuthStore.getState().token) {
    useAuthStore.getState().signOut()
    void apolloClient.clearStore()
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
})
