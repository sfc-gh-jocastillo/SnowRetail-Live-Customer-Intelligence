import { useState } from 'react'
import { Layers, MessageSquare, Play, Zap, Wifi, WifiOff, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { scenarios } from '../../data/scenarios'
import { useCortexAnalyst } from '../../hooks/useCortexAnalyst'
import { DomainDashboard } from '../dashboard/DomainDashboard'
import { DOMAIN_DASHBOARDS } from '../../lib/dashboardQueries'

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
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<{ sql: string; text: string; isLive: boolean; timeMs: number } | null>(null)
  const { ask, loading, connected } = useCortexAnalyst()
  const dashboardConfig = DOMAIN_DASHBOARDS[domain]

  const handleAsk = async (q?: string) => {
    const query = q || question
    if (!query.trim()) return
    setQuestion(query)
    const res = await ask(query, semanticView)
    setResult({
      sql: res.generatedSQL,
      text: res.result,
      isLive: res.isLive,
      timeMs: res.executionTimeMs || Math.floor(Math.random() * 500 + 300),
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </section>

      {/* Analytics Dashboard */}
      {dashboardConfig && <DomainDashboard config={dashboardConfig} />}

      {/* Interactive Ask Panel */}
      <section className="bg-navy-900 border border-navy-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-sf-blue" />
            <span className="text-xs font-medium text-sf-blue uppercase tracking-wider">
              Ask {semanticView}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {connected ? (
              <span className="flex items-center gap-1 text-accent-green"><Wifi size={10} /> En vivo</span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500"><WifiOff size={10} /> Sin conexión</span>
            )}
            <span className="text-slate-500">powered by Cortex Analyst</span>
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder={sampleQuery}
            className="flex-1 px-4 py-2.5 rounded-lg bg-navy-950 border border-navy-700 text-sm text-slate-200 focus:outline-none focus:border-sf-blue placeholder:text-slate-600"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-sf-blue text-white hover:bg-sf-blue-light disabled:opacity-50 transition-colors"
          >
            <Zap size={14} />
            {loading ? 'Consultando...' : 'Preguntar'}
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAsk(sampleQuery)} className="text-[10px] px-2 py-1 rounded bg-navy-800 text-slate-400 hover:text-sf-blue hover:bg-navy-700 transition-colors">
            {sampleQuery}
          </button>
          {metrics.slice(0, 3).map(m => (
            <button
              key={m}
              onClick={() => handleAsk(`¿Cuál es el promedio de ${m.replace(/_/g, ' ')} por región?`)}
              className="text-[10px] px-2 py-1 rounded bg-navy-800 text-slate-400 hover:text-sf-blue hover:bg-navy-700 transition-colors"
            >
              {m.replace(/_/g, ' ')} por región
            </button>
          ))}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-navy-950 border border-navy-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-navy-700">
              <div className="flex items-center gap-2">
                {result.isLive ? (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/30"><Wifi size={10} /> En vivo</span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-navy-800 text-slate-500 border border-navy-700"><WifiOff size={10} /> Sintético</span>
                )}
                <span className="text-[10px] text-sf-blue font-mono">{semanticView}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Clock size={10} className="text-sf-blue" />
                <span className="text-sf-blue font-mono">{result.timeMs}ms</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{result.text}</p>
              <details className="group">
                <summary className="text-[10px] text-slate-500 cursor-pointer hover:text-sf-blue transition-colors">
                  Ver SQL generado hacia Semantic View
                </summary>
                <pre className="mt-2 text-xs text-slate-300 font-mono bg-navy-900 rounded p-3 overflow-x-auto whitespace-pre-wrap">{result.sql}</pre>
              </details>
            </div>
          </div>
        )}

        {/* Metrics & SV info */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {metrics.map(m => (
              <span key={m} className="text-[10px] px-2 py-1 rounded bg-navy-800 text-accent-blue font-mono border border-navy-700">
                {m}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Layers size={12} />
            <span className="font-mono text-slate-400">{semanticView}</span>
          </div>
        </div>
      </section>

      {/* Scenarios List */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Escenarios ({domainScenarios.length})</h2>
        <div className="grid gap-3">
          {domainScenarios.map(s => (
            <Link
              key={s.id}
              to={`/scenarios/${s.id}`}
              className="flex items-center gap-4 bg-navy-900 border border-navy-700 rounded-lg p-4 hover:border-sf-blue/50 transition-colors group"
            >
              <div className="flex-shrink-0 p-2 rounded-lg bg-navy-800 text-sf-blue group-hover:bg-sf-blue group-hover:text-white transition-colors">
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
