import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeCtx { theme: Theme; setTheme: (t: Theme) => void; resolved: 'light' | 'dark' }

const Ctx = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => {}, resolved: 'dark' })

export function useTheme() { return useContext(Ctx) }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem('fs-theme') as Theme) || 'dark' } catch { return 'dark' }
  })
  const [resolved, setResolved] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const compute = () => {
      const r = theme === 'auto' ? (mq.matches ? 'light' : 'dark') : theme
      setResolved(r)
      document.documentElement.classList.toggle('dark', r === 'dark')
      document.documentElement.classList.toggle('light', r === 'light')
    }
    compute()
    mq.addEventListener('change', compute)
    try { localStorage.setItem('fs-theme', theme) } catch {}
    return () => mq.removeEventListener('change', compute)
  }, [theme])

  return <Ctx.Provider value={{ theme, setTheme, resolved }}>{children}</Ctx.Provider>
}