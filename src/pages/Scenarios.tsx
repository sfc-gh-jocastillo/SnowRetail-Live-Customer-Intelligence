import { Link } from 'react-router-dom'
import { scenarios } from '../data/scenarios'
import { Play, Layers } from 'lucide-react'

const domainLabels: Record<string, string> = {
  cic: 'CIC', omn: 'OMN', com: 'COM', sco: 'SCO', mkt: 'MKT'
}

export function Scenarios() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Todos los Escenarios ({scenarios.length})</h1>
      <div className="grid gap-3">
        {scenarios.map(s => (
          <Link
            key={s.id}
            to={`/scenarios/${s.id}`}
            className="flex items-center gap-4 bg-navy-900 border border-navy-700 rounded-lg p-4 hover:border-gold-500/50 transition-colors group"
          >
            <div className="flex-shrink-0 p-2 rounded-lg bg-navy-800 text-gold-400">
              <Play size={14} />
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-navy-800 text-slate-400 font-mono">
              {domainLabels[s.domain]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200">{s.title}</div>
              <div className="text-xs text-slate-500 truncate">{s.description}</div>
            </div>
            {s.isSemanticHero && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                <Layers size={10} /> Semantic Hero
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
