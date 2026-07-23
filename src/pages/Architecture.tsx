import { Network } from 'lucide-react'

export function Architecture() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Network size={24} className="text-gold-400" />
          Arquitectura
        </h1>
        <p className="text-sm text-slate-400">Blueprint de Snowflake — el Semantic Layer se ubica entre los marts gold y todos los consumidores.</p>
      </section>

      {/* Architecture Diagram */}
      <section className="bg-navy-900 border border-navy-700 rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-5 gap-4 text-center">
          {['POS Events', 'eCommerce', 'Inventory', 'CRM', 'Logistics'].map(src => (
            <div key={src} className="text-xs p-2 rounded bg-navy-800 text-slate-400 border border-navy-700">{src}</div>
          ))}
        </div>
        <div className="text-center text-slate-600 text-xs">↓ Snowpipe Streaming + External Tables (S3/Glue)</div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded bg-navy-800 border border-navy-700">
            <div className="text-[10px] text-slate-500 uppercase">Bronze</div>
            <div className="text-xs text-slate-300">Ingesta cruda</div>
          </div>
          <div className="p-3 rounded bg-navy-800 border border-navy-700">
            <div className="text-[10px] text-slate-500 uppercase">Silver</div>
            <div className="text-xs text-slate-300">Limpio + conformado</div>
          </div>
          <div className="p-3 rounded bg-navy-800 border border-navy-700">
            <div className="text-[10px] text-slate-500 uppercase">Gold</div>
            <div className="text-xs text-slate-300">Marts de negocio (Dynamic Tables)</div>
          </div>
        </div>
        <div className="text-center text-slate-600 text-xs">↓ Dynamic Tables (siempre frescos)</div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-500/30 text-center space-y-1">
          <div className="text-gold-400 font-semibold text-sm">SEMANTIC LAYER</div>
          <div className="text-xs text-slate-400">5 Semantic Views · 66 métricas · 44 dimensiones · 66 VQRs</div>
          <div className="text-xs text-slate-500">Definiciones gobernadas · Seguridad a nivel de fila · Column Masking</div>
        </div>
        <div className="text-center text-slate-600 text-xs">↓ Una verdad, muchos consumidores</div>

        <div className="grid grid-cols-5 gap-4 text-center">
          {['Cortex Agent', 'Cortex Analyst', 'Dashboards', 'Store Tablet', 'Compliance'].map(c => (
            <div key={c} className="text-xs p-2 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/30">{c}</div>
          ))}
        </div>
      </section>

      {/* Snowflake Primitives */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Primitivas Snowflake en Juego</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Semantic Views', 'Cortex Agents', 'Cortex Analyst', 'Cortex Complete',
            'Cortex Search', 'AISQL', 'Snowpark ML', 'ML Registry',
            'SPCS (GPU)', 'Snowpipe Streaming', 'Dynamic Tables', 'Time Travel',
            'Horizon Catalog', 'Iceberg Tables', 'Tri-Secret Secure', 'Marketplace'
          ].map(p => (
            <div key={p} className="text-xs p-2 rounded bg-navy-900 border border-navy-700 text-slate-300 text-center">
              {p}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
