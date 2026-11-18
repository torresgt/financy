import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { User } from '@/types/api'

interface AuthState {
  token: string | null
  user: User | null
  /** Quando `false`, a sessão fica só no sessionStorage e some ao fechar o navegador. */
  remember: boolean
  signIn: (data: { token: string; user: User }, options?: { remember?: boolean }) => void
  setUser: (user: User) => void
  signOut: () => void
}

/**
 * Lê de localStorage ou sessionStorage e grava em um dos dois conforme o
 * `remember` do estado, removendo a cópia do outro para não haver sobra.
 */
const authStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    let remember = true
    try {
      remember = JSON.parse(value)?.state?.remember !== false
    } catch {
      // mantém o padrão
    }
    const [target, other] = remember ? [localStorage, sessionStorage] : [sessionStorage, localStorage]
    target.setItem(name, value)
    other.removeItem(name)
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      remember: true,
      signIn: ({ token, user }, { remember = true } = {}) => set({ token, user, remember }),
      setUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null, remember: true }),
    }),
    {
      name: 'financy:auth',
      storage: createJSONStorage(() => authStorage),
      partialize: ({ token, user, remember }) => ({ token, user, remember }),
    },
  ),
)

export const useIsAuthenticated = () => useAuthStore((state) => !!state.token)
