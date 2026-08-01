import { Sun, Moon, Monitor, Search } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useFounderAvatar } from '@/App'
import { cn } from '@/lib/cn'

const TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  create: 'Talk to Cherri',
  cherimoya: 'Cherimoya',
  projects: 'Projects',
  templates: 'SME Templates',
  marketing: 'Marketing',
  sales: 'Sales',
  wallet: 'Wallet',
  marketplace: 'Marketplace',
  analytics: 'Analytics',
  settings: 'Settings',
}

export function Header({ active }: { active: string }) {
  const { theme, setTheme } = useTheme()
  const { avatarUrl } = useFounderAvatar()

  const cycleTheme = () => {
    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'auto' : 'dark'
    setTheme(next)
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <header className="h-16 border-b border-border bg-bg-card/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{TITLES[active] || active}</h1>
        <p className="text-xs text-text-muted">Shoppers Spot LLC</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated border border-border-subtle">
          <Search className="w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search..." className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-40" />
          <kbd className="text-[10px] text-text-muted bg-bg-hover px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </div>
        <button onClick={cycleTheme} className="w-9 h-9 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" title={`Theme: ${theme}`}>
          <ThemeIcon className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <img src={avatarUrl} alt="Aboobakar" className="w-8 h-8 rounded-full border-2 border-accent/30 object-cover" />
          <div>
            <p className="text-sm font-medium text-text-primary">Aboobakar</p>
            <p className="text-[10px] text-text-muted">Founder</p>
          </div>
        </div>
      </div>
    </header>
  )
}