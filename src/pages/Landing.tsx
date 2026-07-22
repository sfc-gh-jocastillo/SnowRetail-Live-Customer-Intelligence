import { Link } from 'react-router-dom'
import { Users, ShoppingBag, CreditCard, Truck, Megaphone, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'

const kpis = [
  { label: 'CUSTOMER CHURN', value: '−2.1pp', sub: '11.8% → 9.7% YoY', trend: 'down' as const, color: 'text-accent-green' },
  { label: 'SAME-STORE SALES', value: '+4.2%', sub: 'vs −0.3% prior year', trend: 'up' as const, color: 'text-accent-green' },
  { label: 'STOCKOUT RATE', value: '−38%', sub: '4.1% → 2.5%', trend: 'down' as const, color: 'text-accent-green' },
  { label: 'FRAUD PREVENTED', value: '$8.2M', sub: 'annual run rate', trend: 'up' as const, color: 'text-gold-400' },
  { label: 'CAMPAIGN ROAS', value: '+31%', sub: '3.4x → 4.5x', trend: 'up' as const, color: 'text-accent-green' },
  { label: 'TIME TO INSIGHT', value: '3 min', sub: 'vs 47 min baseline', trend: 'down' as const, color: 'text-accent-blue' },
]

const domains = [
  {
    id: 'cic', to: '/command-center', icon: Users, name: 'CIC', title: 'Customer Intelligence',
    description: 'Identity-resolved 360. Churn explainability, next-best-offer, vulnerability-aware care.',
    stat: '−2.1pp churn YoY',
    highlights: ['Customer 360 across all channels', 'NBA + retention engine', 'CLV-driven segmentation'],
  },
  {
    id: 'omn', to: '/omnichannel', icon: ShoppingBag, name: 'OMN', title: 'Omnichannel Ops',
    description: 'Store + eCommerce + App — unified inventory, planogram intelligence, seamless experience.',
    stat: '+19% planogram lift',
    highlights: ['Unified stock visibility', 'AI-driven planogram placement', 'Click-and-collect optimization'],
  },
  {
    id: 'com', to: '/commerce', icon: CreditCard, name: 'COM', title: 'Commerce & Revenue',
    description: 'Pricing engine, promotions, revenue assurance, fraud detection, and card financing.',
    stat: '$2.4M leakage closed',
    highlights: ['Dynamic pricing engine', 'Real-time card fraud detection', 'Revenue assurance automation'],
  },
  {
    id: 'sco', to: '/supply-chain', icon: Truck, name: 'SCO', title: 'Supply Chain & Ops',
    description: 'Demand forecasting, replenishment, warehouse ops, last-mile logistics, returns.',
    stat: '−22% delivery cost',
    highlights: ['ML demand forecasting', 'Auto-replenishment trigger', 'Last-mile route optimization'],
  },
  {
    id: 'mkt', to: '/marketing', icon: Megaphone, name: 'MKT', title: 'Marketing & Growth',
    description: 'Campaign orchestration, attribution, acquisition cost, loyalty programs, cohort analysis.',
    stat: '4.5x ROAS',
    highlights: ['Multi-touch attribution', 'Lookalike audience generation', 'Loyalty tier prediction'],
  },
]

export function Landing() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <div className="inline-block px-3 py-1 rounded-full bg-navy-800 text-xs text-gold-400 border border-navy-700">
          EXECUTIVE BRIEFING · Snowflake AI Data Cloud · Chile/LATAM · synthetic demo
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          Agentic AI across the entire retail stack —<br />
          <span className="text-sf-blue">measured in minutes, dollars, and customer outcomes.</span>
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm leading-relaxed">
          Five domains. One Snowflake-native data plane. Cortex Agents close the loop end-to-end —
          from detect → decide → act → verify — with governed Semantic Views, consent, masking, RBAC
          and full audit. Every metric on this page is defined once in the Semantic Layer and consumed everywhere.
        </p>
      </section>

      {/* KPI Tiles */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-navy-900 border border-navy-700 rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{kpi.label}</div>
            <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              {kpi.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {kpi.sub}
            </div>
          </div>
        ))}
      </section>

      {/* Semantic Layer Callout */}
      <section className="bg-gradient-to-r from-sf-blue/10 to-sf-blue/5 border border-sf-blue/20 rounded-xl p-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="text-xs text-sf-blue uppercase tracking-wider font-medium">Powered by Snowflake Semantic Layer</div>
          <p className="text-sm text-slate-300 max-w-lg">
            Every KPI above is defined once in a Semantic View — the same governed definition powers dashboards,
            Cortex Agents, natural-language queries, and compliance evidence packs. Zero metric drift.
          </p>
        </div>
        <Link to="/semantic-layer" className="flex items-center gap-1 px-4 py-2 bg-sf-blue text-white text-sm font-medium rounded-lg hover:bg-sf-blue-light transition-colors">
          Explore <ArrowUpRight size={14} />
        </Link>
      </section>

      {/* Domain Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Five Domains · One Platform</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map(d => {
            const Icon = d.icon
            return (
              <Link
                key={d.id}
                to={d.to}
                className="group bg-navy-900 border border-navy-700 rounded-xl p-5 space-y-3 hover:border-gold-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-navy-800 text-gold-400">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{d.name}</div>
                      <div className="font-medium text-sm">{d.title}</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-500 group-hover:text-gold-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{d.description}</p>
                <div className="text-sm font-semibold text-accent-green">{d.stat}</div>
                <ul className="space-y-1">
                  {d.highlights.map(h => (
                    <li key={h} className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold-500" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
