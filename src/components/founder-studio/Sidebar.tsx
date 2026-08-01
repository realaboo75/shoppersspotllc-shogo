import { Home, Apple, FolderOpen, Store, Megaphone, DollarSign, Wallet, Globe, BarChart3, Settings, ChevronLeft, Sparkles, LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { NavId } from '@/App'
import { useFounderAvatar } from '@/App'

const NAV: { id: NavId; label: string; icon: typeof Home; special?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'create', label: 'Talk to Cherri', icon: Sparkles, special: true },
  { id: 'cherimoya', label: 'Cherimoya', icon: Apple },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'templates', label: 'SME Templates', icon: Store },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'sales', label: 'Sales', icon: DollarSign },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'marketplace', label: 'Marketplace', icon: Globe },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface Props {
  active: NavId
  onSelect: (id: NavId) => void
  collapsed: boolean
  onToggleCollapse: () => void
  onExitStudio?: () => void
}

export function Sidebar({ active, onSelect, collapsed, onToggleCollapse, onExitStudio }: Props) {
  const { avatarUrl } = useFounderAvatar()
  return (
    <aside className={cn(
      'h-screen flex flex-col border-r border-border bg-bg-card/80 backdrop-blur-xl transition-all duration-300 relative z-20',
      collapsed ? 'w-[68px]' : 'w-[240px]'
    )}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0">
        <img src={avatarUrl} alt="Aboobakar" className="w-8 h-8 rounded-full border-2 border-accent/30 object-cover flex-shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">Founder Studio</p>
            <p className="text-[10px] text-text-muted truncate">Shoppers Spot LLC</p>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(item => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button key={item.id} onClick={() => onSelect(item.id)} className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              item.special ? 'bg-gradient-to-r from-rose-500/15 to-pink-500/15 text-rose-400 hover:from-rose-500/25 hover:to-pink-500/25 border border-rose-500/20'
              : isActive ? 'bg-accent/12 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            )} title={collapsed ? item.label : undefined}>
              <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', item.special && 'text-rose-400')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>
      {onExitStudio && (
        <div className="px-2 py-2 border-t border-border space-y-1">
          <button onClick={onExitStudio} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-400 hover:from-purple-500/25 hover:to-pink-500/25 border border-purple-500/20 transition-all">
            <Globe className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="truncate">View on Website</span>}
          </button>
          <button onClick={onExitStudio} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="truncate">Back to Public Site</span>}
          </button>
        </div>
      )}
      <button onClick={onToggleCollapse} className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all z-30">
        <ChevronLeft className={cn('w-3 h-3 transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  )
}