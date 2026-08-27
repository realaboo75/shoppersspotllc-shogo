import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

export interface AuthUser { name: string; email: string }
export interface AuthResult { ok: boolean; error?: string; message?: string }

interface AuthCtx {
  isAuthenticated: boolean
  loading: boolean
  user: AuthUser | null
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<AuthResult>
}

const Ctx = createContext<AuthCtx>({
  isAuthenticated: false, loading: true, user: null,
  login: async () => ({ ok: false, error: 'Authentication is unavailable.' }),
  logout: async () => {}, requestPasswordReset: async () => ({ ok: false, error: 'Password reset is unavailable.' }),
})

export const useAuth = () => useContext(Ctx)

async function readResponse(response: Response): Promise<AuthResult & { user?: AuthUser }> {
  const body = await response.json().catch(() => ({})) as Partial<AuthResult> & { user?: AuthUser }
  if (!response.ok) return { ok: false, error: body.error || 'Authentication request failed.' }
  return { ok: true, ...body }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(readResponse)
      .then(result => { if (active && result.ok) setUser(result.user ?? null) })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result = await readResponse(response)
      if (result.ok) setUser(result.user ?? null)
      return result
    } catch {
      return { ok: false, error: 'Unable to reach the authentication service.' }
    }
  }, [])

  const logout = useCallback(async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }) } finally { setUser(null) }
  }, [])

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      return await readResponse(response)
    } catch {
      return { ok: false, error: 'Unable to reach the password reset service.' }
    }
  }, [])

  return <Ctx.Provider value={{ isAuthenticated: !!user, loading, user, login, logout, requestPasswordReset }}>{children}</Ctx.Provider>
}
