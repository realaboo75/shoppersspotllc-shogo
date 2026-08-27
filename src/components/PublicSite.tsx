import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { useProjects } from './founder-studio/ProjectsContext'

export default function PublicSite({ onEnterStudio }: { onEnterStudio: () => void }) {
  const { getMarketplaceProjects } = useProjects()
  const projects = getMarketplaceProjects()
  return (
    <main className="min-h-screen bg-bg text-text-primary">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="font-semibold">Shoppers Spot LLC</div>
        <button onClick={onEnterStudio} className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold">Founder Studio</button>
      </nav>
      <section className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium"><Sparkles className="w-4 h-4" /> Build, launch, and scale</div>
          <h1 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight">Turn your next business idea into momentum.</h1>
          <p className="mt-6 text-lg text-text-secondary max-w-xl">Founder Studio brings planning, building, marketing, and growth tools into one focused workspace.</p>
          <button onClick={onEnterStudio} className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold">Enter Founder Studio <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="glass rounded-3xl p-8 gradient-border">
          <h2 className="text-xl font-semibold">A practical operating system for founders</h2>
          <div className="mt-6 space-y-4">
            {['Plan and validate ideas', 'Build repeatable business workflows', 'Track projects and marketplace listings'].map(item => <div key={item} className="flex items-center gap-3 text-text-secondary"><Check className="w-4 h-4 text-success" />{item}</div>)}
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold">Featured projects</h2>
        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {projects.length ? projects.map(project => <article key={project.id} className="glass rounded-2xl p-5"><div className="text-3xl">{project.emoji}</div><h3 className="mt-3 font-semibold">{project.name}</h3><p className="mt-2 text-sm text-text-secondary">{project.description}</p></article>) : <p className="text-text-secondary">Projects will appear here as they are published.</p>}
        </div>
      </section>
    </main>
  )
}
