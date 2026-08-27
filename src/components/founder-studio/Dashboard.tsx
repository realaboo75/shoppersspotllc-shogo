import { useState, useEffect, useRef } from 'react'
import { Send, Mic, Image as ImageIcon, Paperclip, TrendingUp, ShoppingCart, Users, Target, Award, ChevronRight, Plus, Camera, Globe, Eye } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useFounderAvatar } from '@/App'
import { useProjects } from './ProjectsContext'

const REV_DATA = [
  { m: 'Jan', v: 8200 }, { m: 'Feb', v: 9800 }, { m: 'Mar', v: 11400 },
  { m: 'Apr', v: 13100 }, { m: 'May', v: 14800 }, { m: 'Jun', v: 16200 },
  { m: 'Jul', v: 18500 },
]

const BRIEFING = [
  { icon: '📈', text: 'Your Jewelry Store revenue is up 23% this week — Instagram campaign is working great.' },
  { icon: '🆕', text: 'Cherimoya landing page is 85% complete. Ready for your review by tomorrow.' },
  { icon: '🎯', text: 'You have 3 new marketplace inquiries from SME owners wanting to list their businesses.' },
  { icon: '💡', text: 'Tip: Based on your Auto Service App traffic, I recommend launching a Google Ads campaign. Want me to set it up?' },
]

const TEMPLATES = [
  { emoji: '💎', name: 'Jewelry Store', color: 'from-purple-500/20 to-pink-500/20' },
  { emoji: '🍽️', name: 'Restaurant', color: 'from-orange-500/20 to-red-500/20' },
  { emoji: '🏥', name: 'Healthcare', color: 'from-green-500/20 to-emerald-500/20' },
  { emoji: '🏠', name: 'Real Estate', color: 'from-blue-500/20 to-indigo-500/20' },
]

interface Props { onCreateProject: () => void; onGoToPublic?: () => void }

export default function Dashboard({ onCreateProject, onGoToPublic }: Props) {
  const [clock, setClock] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [input, setInput] = useState('')
  const { avatarUrl, setAvatar } = useFounderAvatar()
  const { projects, listOnWebsite, unlistFromWebsite } = useProjects()
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) setAvatar(ev.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 gradient-border card-shine animate-fade-in">
        <div className="relative group">
          <img src={avatarUrl} alt="Aboobakar" className="w-14 h-14 rounded-full border-2 border-accent/40 object-cover" />
          <button onClick={() => fileRef.current?.click()} className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-text-primary">Welcome back, Aboobakar 👋</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-text-secondary">
            <span>📍 Texas, US</span>
            <span>🌡️ 82°F Clear</span>
            <span>🕐 {clock}</span>
            <span className="text-text-muted">·</span>
            <span>{dateStr}</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 gradient-border card-shine animate-fade-in stagger-1">
        <div className="flex items-center gap-3 mb-4">
          <img src="/avatars/cherri.svg" alt="Cherri" className="w-10 h-10 rounded-full object-cover border-2 border-rose-400/30" />
          <div>
            <h2 className="text-base font-semibold text-text-primary">What would you like to build?</h2>
            <p className="text-xs text-text-secondary">Tell me your idea — I'll handle everything else</p>
          </div>
        </div>
        <div className="flex items-end gap-3 bg-bg-elevated rounded-xl border border-border-subtle p-3 focus-within:border-accent/50 transition-all">
          <button className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary transition-colors"><Mic className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary transition-colors"><ImageIcon className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary transition-colors"><Paperclip className="w-4 h-4" /></button>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onCreateProject() } }} placeholder="Ask Cherri what you want to build..." rows={1} className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none resize-none py-1.5 px-1" />
          <button onClick={onCreateProject} disabled={!input.trim()} className="p-1.5 rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-30 transition-all"><Send className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {['Build a Shopify store', 'Create a healthcare CRM', 'Build a mobile app'].map(s => (
            <button key={s} onClick={onCreateProject} className="text-xs px-3 py-1 rounded-full bg-accent/8 text-accent hover:bg-accent/15 transition-colors">{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in stagger-2">
        {[
          { icon: <TrendingUp className="w-4 h-4" />, label: 'Revenue', val: '$142,800', change: '+18%', positive: true },
          { icon: <ShoppingCart className="w-4 h-4" />, label: 'Orders', val: '2,847', change: '+12%', positive: true },
          { icon: <Users className="w-4 h-4" />, label: 'Customers', val: '1,234', change: '+8%', positive: true },
          { icon: <Target className="w-4 h-4" />, label: 'Conversion', val: '4.8%', change: '+0.3%', positive: true },
        ].map((m, i) => (
          <div key={i} className="glass rounded-xl p-4 card-shine">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-xs">{m.label}</span>
              <span className="text-accent">{m.icon}</span>
            </div>
            <p className="text-xl font-bold text-text-primary">{m.val}</p>
            <span className={`text-xs font-medium ${m.positive ? 'text-success' : 'text-error'}`}>{m.change} this month</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 glass rounded-2xl p-5 animate-fade-in stagger-3">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Revenue Growth</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REV_DATA}>
                <defs>
                  <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="v" stroke="#8b5cf6" fill="url(#rv)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-2xl p-5 animate-fade-in stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-secondary">My Projects</h3>
            <button onClick={onCreateProject} className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"><Plus className="w-3 h-3" />New</button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 6).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-bg-elevated hover:bg-bg-hover border border-border-subtle transition-all group">
                <span className="text-lg flex-shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                    {p.listed && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/15 text-success font-medium">Listed</span>}
                  </div>
                  <p className="text-xs text-text-muted truncate">{p.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!p.listed ? (
                    <button onClick={() => listOnWebsite(p.id)} title="List on Website" className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all opacity-0 group-hover:opacity-100">
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button onClick={() => unlistFromWebsite(p.id)} title="Unlist from Website" className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-all opacity-0 group-hover:opacity-100">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-text-secondary transition-colors" />
                </div>
              </div>
            ))}
          </div>
          {onGoToPublic && (
            <button onClick={onGoToPublic} className="w-full mt-3 py-2 rounded-xl bg-purple-500/8 text-purple-400 text-xs font-medium hover:bg-purple-500/15 transition-all flex items-center justify-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> View on Website
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-5 animate-fade-in stagger-5">
          <div className="flex items-center gap-2 mb-4">
            <img src="/avatars/cherri.svg" alt="Cherri" className="w-6 h-6 rounded-full object-cover" />
            <h3 className="text-sm font-medium text-text-secondary">Cherri's Daily Briefing</h3>
          </div>
          <div className="space-y-3">
            {BRIEFING.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated border border-border-subtle">
                <span className="text-base mt-0.5">{b.icon}</span>
                <p className="text-sm text-text-secondary leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 animate-fade-in stagger-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber" />
            <h3 className="text-sm font-medium text-text-secondary">Recent Achievements</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: '🎉', text: 'First $1K revenue day', time: '2 days ago' },
              { icon: '🚀', text: 'Jewelry Store launched', time: '1 week ago' },
              { icon: '📈', text: '1000th customer', time: '2 weeks ago' },
              { icon: '✨', text: 'Cherimoya MVP complete', time: '3 weeks ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-bg-elevated border border-border-subtle">
                <span className="text-lg">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{a.text}</p>
                  <p className="text-xs text-text-muted">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 animate-fade-in">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Quick Start Templates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEMPLATES.map(t => (
            <button key={t.name} onClick={onCreateProject} className={`bg-gradient-to-br ${t.color} rounded-xl p-4 text-center hover:scale-[1.02] border border-border-subtle transition-all`}>
              <span className="text-2xl">{t.emoji}</span>
              <p className="text-sm font-medium text-text-primary mt-2">{t.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}