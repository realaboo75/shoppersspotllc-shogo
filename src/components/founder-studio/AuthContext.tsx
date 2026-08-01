import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthCtx {
  isAuthenticated: boolean
  user: { name: string; email: string } | null
  login: (email: string, password: string) => boolean
  logout: () => void
  requestPasswordReset: (email: string) => boolean
}

const Ctx = createContext<AuthCtx>({
  isAuthenticated: false, user: null,
  login: () => false, logout: () => {}, requestPasswordReset: () => false,
})

export const useAuth = () => useContext(Ctx)

const VALID_EMAIL = 'founder@shoppersspotllc.com'
const VALID_PASSWORD = 'Founder@1975'
const VALID_NAME = 'Aboobakar'
const STORAGE_KEY = 'fs-auth-session'
const RESET_KEY = 'fs-password-reset'

function loadSession(): { name: string; email: string } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(loadSession)

  const login = useCallback((email: string, password: string) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const u = { name: VALID_NAME, email: VALID_EMAIL }
      setUser(u)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)) } catch {}
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  const requestPasswordReset = useCallback((email: string) => {
    if (email === VALID_EMAIL) {
      try {
        localStorage.setItem(RESET_KEY, JSON.stringify({
          email, timestamp: Date.now(),
          message: 'Password reset link sent to usaaboo@gmail.com'
        }))
      } catch {}
      return true
    }
    return false
  }, [])

  return <Ctx.Provider value={{ isAuthenticated: !!user, user, login, logout, requestPasswordReset }}>{children}</Ctx.Provider>
}