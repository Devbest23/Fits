import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// WHY: esta clave es solo para la demo. En la versión final la autenticación
// vivirá en la API, con contraseña hasheada y cookie HttpOnly.
export const DEMO_PASSWORD = 'fits2026'

interface AuthState {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password) => {
        const valid = password.trim() === DEMO_PASSWORD
        if (valid) set({ isAuthenticated: true })
        return valid
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'fits-demo-auth-v1',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
