import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface Project {
  id: string; name: string; emoji: string; description: string
  status: 'Planning' | 'Building' | 'Review' | 'Live' | 'Listed'
  revenue: string; customers: string; category: string
  listed: boolean; listedAt?: string; price?: string
}

const STORAGE_KEY = 'fs-projects'

const DEFAULT_PROJECTS: Project[] = [
  { id: 'p1', name: 'Jewelry Store', emoji: '💎', description: 'Premium Shopify jewelry store with secure checkout', status: 'Live', revenue: '$32,400', customers: '892', category: 'E-commerce', listed: true, listedAt: '2026-07-15', price: '$199' },
  { id: 'p2', name: 'Cherimoya', emoji: '🍈', description: 'SME marketplace platform for Shoppers Spot LLC', status: 'Building', revenue: '$48,200', customers: '456', category: 'Platform', listed: false },
  { id: 'p3', name: 'Health CRM', emoji: '🏥', description: 'Patient management and scheduling system', status: 'Planning', revenue: '$18,600', customers: '234', category: 'Healthcare', listed: false },
  { id: 'p4', name: 'Auto Service App', emoji: '🚗', description: 'Booking and vehicle service management', status: 'Review', revenue: '$42,800', customers: '567', category: 'Services', listed: false },
  { id: 'p5', name: 'Restaurant Platform', emoji: '🍽️', description: 'Online ordering and table reservation system', status: 'Live', revenue: '$28,900', customers: '1,234', category: 'Food & Beverage', listed: true, listedAt: '2026-07-20', price: '$249' },
  { id: 'p6', name: 'Fashion Boutique', emoji: '👗', description: 'E-commerce storefront for fashion retail', status: 'Building', revenue: '$15,200', customers: '178', category: 'Fashion', listed: false },
]

function loadProjects(): Project[] {
  try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) return JSON.parse(stored) } catch {}
  return DEFAULT_PROJECTS
}

function saveProjects(projects: Project[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)) } catch {} }

interface ProjectsCtx {
  projects: Project[]
  addProject: (p: Omit<Project, 'id' | 'listed'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  listOnWebsite: (id: string) => void
  unlistFromWebsite: (id: string) => void
  getMarketplaceProjects: () => Project[]
}

const Ctx = createContext<ProjectsCtx>({
  projects: [], addProject: () => ({} as Project), updateProject: () => {}, removeProject: () => {},
  listOnWebsite: () => {}, unlistFromWebsite: () => {}, getMarketplaceProjects: () => [],
})

export const useProjects = () => useContext(Ctx)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(loadProjects)
  const persist = useCallback((next: Project[]) => { setProjects(next); saveProjects(next) }, [])
  const addProject = useCallback((p: Omit<Project, 'id' | 'listed'>) => { const np: Project = { ...p, id: `p${Date.now()}`, listed: false }; persist([...projects, np]); return np }, [projects, persist])
  const updateProject = useCallback((id: string, updates: Partial<Project>) => { persist(projects.map(p => p.id === id ? { ...p, ...updates } : p)) }, [projects, persist])
  const removeProject = useCallback((id: string) => { persist(projects.filter(p => p.id !== id)) }, [projects, persist])
  const listOnWebsite = useCallback((id: string) => { persist(projects.map(p => p.id === id ? { ...p, listed: true, listedAt: new Date().toISOString().split('T')[0], status: 'Listed' as const } : p)) }, [projects, persist])
  const unlistFromWebsite = useCallback((id: string) => { persist(projects.map(p => p.id === id ? { ...p, listed: false, listedAt: undefined, status: 'Live' as const } : p)) }, [projects, persist])
  const getMarketplaceProjects = useCallback(() => projects.filter(p => p.listed), [projects])
  return <Ctx.Provider value={{ projects, addProject, updateProject, removeProject, listOnWebsite, unlistFromWebsite, getMarketplaceProjects }}>{children}</Ctx.Provider>
}