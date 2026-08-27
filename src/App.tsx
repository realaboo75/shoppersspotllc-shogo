import { useState, useEffect, createContext, useContext } from 'react'
import { ThemeProvider } from './components/founder-studio/ThemeProvider'
import { Sidebar } from './components/founder-studio/Sidebar'
import { Header } from './components/founder-studio/Header'
import Cherri from './components/founder-studio/Cherri'
import Dashboard from './components/founder-studio/Dashboard'
import Modules from './components/founder-studio/Modules'
import CherriWidget from './components/founder-studio/CherriWidget'
import { ProjectsProvider } from './components/founder-studio/ProjectsContext'
import { AuthProvider, useAuth } from './components/founder-studio/AuthContext'
import LoginPage from './components/founder-studio/LoginPage'
import PublicSite from '@/components/PublicSite'
import './index.css'

const DEFAULT_AVATAR = '/avatars/aboo.svg'
const STORAGE_KEY = 'fs-founder-avatar'

interface AvatarCtx {
  avatarUrl: string
  setAvatar: (url: string) => void
}

const AvatarContext = createContext<AvatarCtx>({ avatarUrl: DEFAULT_AVATAR, setAvatar: () => {} })
export const useFounderAvatar = () => useContext(AvatarContext)

export type NavId = 'dashboard' | 'cherimoya' | 'create' | 'projects' | 'templates' | 'marketing' | 'sales' | 'wallet' | 'marketplace' | 'analytics' | 'settings'
type Page = 'public' | 'studio'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [page, setPage] = useState<Page>(() => {
    try { return (localStorage.getItem('fs-page') as Page) || 'public' } catch { return 'public' }
  })
  const [active, setActive] = useState<NavId>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [avatarUrl, setAvatarUrlState] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_AVATAR } catch { return DEFAULT_AVATAR }
  })

  const setAvatar = (url: string) => {
    setAvatarUrlState(url)
    try { localStorage.setItem(STORAGE_KEY, url) } catch {}
  }

  const goToStudio = () => { setPage('studio'); try { localStorage.setItem('fs-page', 'studio') } catch {} }
  const goToPublic = () => { setPage('public'); try { localStorage.setItem('fs-page', 'public') } catch {} }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') e.preventDefault()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center text-text-secondary">Loading Founder Studio…</div>
  }

  if (page === 'public') {
    return <PublicSite onEnterStudio={goToStudio} />
  }

  if (!isAuthenticated) {
    return <LoginPage onBack={goToPublic} />
  }

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatar }}>
      <ThemeProvider>
        <div className="flex h-screen overflow-hidden bg-bg">
          <div className="mesh-gradient" />
          <Sidebar
            active={active}
            onSelect={setActive}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(c => !c)}
            onExitStudio={goToPublic}
          />
          <div className="flex-1 flex flex-col min-w-0 relative z-10">
            <Header active={active} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {active === 'dashboard' ? (
                <Dashboard onCreateProject={() => setActive('create')} onGoToPublic={goToPublic} />
              ) : active === 'create' ? (
                <Cherri />
              ) : (
                <Modules active={active} />
              )}
            </main>
          </div>
          <CherriWidget />
        </div>
      </ThemeProvider>
    </AvatarContext.Provider>
  )
}

export default function App() {
  return (
    <ProjectsProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ProjectsProvider>
  )
}