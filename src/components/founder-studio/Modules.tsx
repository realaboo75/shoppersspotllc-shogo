import { useProjects } from './ProjectsContext'
import type { NavId } from '@/App'

export default function Modules({ active }: { active: NavId }) {
  const { projects, getMarketplaceProjects } = useProjects()
  const titles: Record<string, string> = { cherimoya: 'Cherimoya', projects: 'Projects', templates: 'SME Templates', marketing: 'Marketing', sales: 'Sales', wallet: 'Wallet', marketplace: 'Marketplace', analytics: 'Analytics', settings: 'Settings' }
  const title = titles[active] || active
  const data = active === 'marketplace' ? getMarketplaceProjects() : projects
  return <section className="max-w-6xl mx-auto space-y-6"><div><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-1 text-sm text-text-secondary">This workspace is connected to your Founder Studio account.</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{data.map(project => <article key={project.id} className="glass rounded-2xl p-5"><div className="text-3xl">{project.emoji}</div><h3 className="mt-3 font-semibold">{project.name}</h3><p className="mt-2 text-sm text-text-secondary">{project.description}</p><p className="mt-4 text-xs text-text-muted">Status: {project.status}</p></article>)}</div></section>
}
