import { Layers, MessageSquare, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { scenarios } from '../../data/scenarios'

interface DomainPageProps {
  domain: string
  title: string
  subtitle: string
  semanticView: string
  metrics: string[]
  sampleQuery: string
}

export function DomainPage({ domain, title, subtitle, semanticView, metrics, sampleQuery }: DomainPageProps) {
  const domainScenarios = scenarios.filter(s => s.domain === domain)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </section>

      {/* Ask This Domain Panel */}
      <section className="bg-navy-900 border border-navy-700 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-gold-400" />
          <span className="text-xs font-medium text-gold-400 uppercase tracking-wider">
            Ask {semanticView}
          </span>
          <span className="text-xs text-slate-500 ml-auto">powered by Cortex Analyst</span>
        </div>
        <div className="bg-navy-950 rounded-lg p-4 border border-navy-700">
          <p className="text-sm text-slate-300 italic">"{sampleQuery}"</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {metrics.map(m => (
            <span key={m} className="text-[10px] px-2 py-1 rounded bg-navy-800 text-accent-blue font-mono border border-navy-700">
              {m}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Layers size={12} />
          <span>Semantic View: <span className="text-slate-300 font-mono">{semanticView}</span></span>
        </div>
      </section>

      {/* Scenarios List */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Scenarios ({domainScenarios.length})</h2>
        <div className="grid gap-3">
          {domainScenarios.map(s => (
            <Link
              key={s.id}
              to={`/scenarios/${s.id}`}
              className="flex items-center gap-4 bg-navy-900 border border-navy-700 rounded-lg p-4 hover:border-gold-500/50 transition-colors group"
            >
              <div className="flex-shrink-0 p-2 rounded-lg bg-navy-800 text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                <Play size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200">{s.title}</div>
                <div className="text-xs text-slate-500 truncate">{s.description}</div>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                {s.isSemanticHero && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                    Semantic Hero
                  </span>
                )}
                {s.primitives.slice(0, 2).map(p => (
                  <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-accent-blue">
                    {p}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
