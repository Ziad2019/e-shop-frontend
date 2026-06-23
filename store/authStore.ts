import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  _id:    string
  name:   string
  email:  string
  role:   string
  avatar?: string  
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: (user, token) => set({ user, accessToken: token }),
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'auth',
    }
  )
)