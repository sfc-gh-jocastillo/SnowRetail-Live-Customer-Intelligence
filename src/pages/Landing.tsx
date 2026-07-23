import { Link } from 'react-router-dom'
import { Users, ShoppingBag, CreditCard, Truck, Megaphone, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'

const kpis = [
  { label: 'CHURN CLIENTES', value: '−2.1pp', sub: '11.8% → 9.7% YoY', trend: 'down' as const, color: 'text-accent-green' },
  { label: 'VENTAS MISMA TIENDA', value: '+4.2%', sub: 'vs −0.3% año anterior', trend: 'up' as const, color: 'text-accent-green' },
  { label: 'QUIEBRE DE STOCK', value: '−38%', sub: '4.1% → 2.5%', trend: 'down' as const, color: 'text-accent-green' },
  { label: 'FRAUDE PREVENIDO', value: '$8.2M', sub: 'tasa anual', trend: 'up' as const, color: 'text-gold-400' },
  { label: 'ROAS CAMPAÑAS', value: '+31%', sub: '3.4x → 4.5x', trend: 'up' as const, color: 'text-accent-green' },
  { label: 'TIEMPO A INSIGHT', value: '3 min', sub: 'vs 47 min baseline', trend: 'down' as const, color: 'text-accent-blue' },
]

const domains = [
  {
    id: 'cic', to: '/command-center', icon: Users, name: 'CIC', title: 'Inteligencia de Clientes',
    description: 'Customer 360 con resolución de identidad. Predicción de churn, next-best-offer, atención proactiva.',
    stat: '−2.1pp churn YoY',
    highlights: ['Customer 360 omnicanal', 'Motor NBA + retención', 'Segmentación basada en CLV'],
  },
  {
    id: 'omn', to: '/omnichannel', icon: ShoppingBag, name: 'OMN', title: 'Operaciones Omnicanal',
    description: 'Tienda + eCommerce + App — inventario unificado, inteligencia de planograma, experiencia sin fricción.',
    stat: '+19% lift planograma',
    highlights: ['Visibilidad de stock unificada', 'Planograma impulsado por IA', 'Optimización click-and-collect'],
  },
  {
    id: 'com', to: '/commerce', icon: CreditCard, name: 'COM', title: 'Comercio e Ingresos',
    description: 'Motor de pricing, promociones, revenue assurance, detección de fraude, Tarjeta Ripley.',
    stat: '$2.4M fuga cerrada',
    highlights: ['Motor de pricing dinámico', 'Detección de fraude en tiempo real', 'Revenue assurance automatizado'],
  },
  {
    id: 'sco', to: '/supply-chain', icon: Truck, name: 'SCO', title: 'Cadena de Suministro',
    description: 'Forecasting de demanda, reposición, operaciones de bodega, logística última milla, devoluciones.',
    stat: '−22% costo delivery',
    highlights: ['Forecasting de demanda con ML', 'Reposición automática', 'Optimización última milla'],
  },
  {
    id: 'mkt', to: '/marketing', icon: Megaphone, name: 'MKT', title: 'Marketing y Crecimiento',
    description: 'Orquestación de campañas, atribución, costo de adquisición, programas de fidelidad, análisis de cohortes.',
    stat: '4.5x ROAS',
    highlights: ['Atribución multi-touch', 'Audiencias lookalike', 'Predicción de tier de fidelidad'],
  },
]

export function Landing() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <div className="inline-block px-3 py-1 rounded-full bg-navy-800 text-xs text-gold-400 border border-navy-700">
          RESUMEN EJECUTIVO · Snowflake AI Data Cloud · Chile/LATAM · demo sintética
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          IA Agéntica en toda la operación retail —<br />
          <span className="text-sf-blue">medido en minutos, dólares y resultados de clientes.</span>
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm leading-relaxed">
          Cinco dominios. Un plano de datos nativo en Snowflake. Cortex Agents cierran el loop de punta a punta —
          detectar → decidir → actuar → verificar — con Semantic Views gobernadas, consentimiento, masking, RBAC
          y auditoría completa. Cada métrica en esta página se define una vez en el Semantic Layer y se consume en todos lados.
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
          <div className="text-xs text-sf-blue uppercase tracking-wider font-medium">Impulsado por Snowflake Semantic Layer</div>
          <p className="text-sm text-slate-300 max-w-lg">
            Cada KPI se define una vez en una Semantic View — la misma definición gobernada alimenta dashboards,
            Cortex Agents, consultas en lenguaje natural y packs de evidencia regulatoria. Cero deriva de métricas.
          </p>
        </div>
        <Link to="/semantic-layer" className="flex items-center gap-1 px-4 py-2 bg-sf-blue text-white text-sm font-medium rounded-lg hover:bg-sf-blue-light transition-colors">
          Explorar <ArrowUpRight size={14} />
        </Link>
      </section>

      {/* Domain Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Cinco Dominios · Una Plataforma</h2>
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
