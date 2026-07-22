import { Layers, Search, Shield, Database } from 'lucide-react'

const semanticViews = [
  { name: 'SV_CUSTOMER_INTELLIGENCE', metrics: 15, dimensions: 8, vqrs: 15, domain: 'CIC' },
  { name: 'SV_OMNICHANNEL_OPS', metrics: 12, dimensions: 10, vqrs: 12, domain: 'OMN' },
  { name: 'SV_COMMERCE_REVENUE', metrics: 14, dimensions: 9, vqrs: 14, domain: 'COM' },
  { name: 'SV_SUPPLY_CHAIN', metrics: 12, dimensions: 8, vqrs: 12, domain: 'SCO' },
  { name: 'SV_MARKETING_GROWTH', metrics: 13, dimensions: 9, vqrs: 13, domain: 'MKT' },
]

const sampleQueries = [
  { question: 'Why is churn spiking in Region Sur?', sv: 'SV_CUSTOMER_INTELLIGENCE', sql: 'SELECT region, churn_rate, MoM_change\nFROM gold.customer_360\nWHERE region = \'Sur\'\nGROUP BY 1 ORDER BY MoM_change DESC', result: 'Region Sur churn +1.8pp driven by 35-44 segment post price increase' },
  { question: 'Which aisles should I reconfigure for Back to School?', sv: 'SV_OMNICHANNEL_OPS', sql: 'SELECT aisle, foot_traffic, conversion_rate,\n  campaign_sku_count\nFROM gold.planogram_current p\nJOIN gold.campaign_skus c ON p.sku_id = c.sku_id\nWHERE campaign = \'Back to School\'\n  AND conversion_rate < avg_store_conversion', result: '14 SKUs in low-traffic aisles. Recommended: endcap cluster + secondary placement → +22% projected lift' },
  { question: 'What\'s our true ROAS on loyalty emails?', sv: 'SV_MARKETING_GROWTH', sql: 'SELECT campaign_type, attributed_revenue,\n  total_spend, attributed_revenue/total_spend as roas\nFROM gold.campaign_performance\nWHERE channel = \'email\'\n  AND audience = \'loyalty_members\'', result: 'Loyalty email ROAS: 4.5x (vs 3.1x non-loyalty). Multi-touch attribution credits 38% to email touchpoint.' },
]

export function SemanticLayer() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <section className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Semantic Layer Cockpit</h1>
            <p className="text-sm text-slate-400">One definition. Many consumers. Zero drift.</p>
          </div>
        </div>
      </section>

      {/* Message: One Definition, Many Consumers */}
      <section className="bg-navy-900 border border-navy-700 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">The Power of Governed Metrics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-accent-blue font-medium text-sm">Define Once</div>
            <p className="text-xs text-slate-400">Each metric (e.g., "same-store sales growth") is defined exactly once in a Semantic View with its formula, grain, and business logic.</p>
          </div>
          <div className="space-y-2">
            <div className="text-accent-green font-medium text-sm">Consume Everywhere</div>
            <p className="text-xs text-slate-400">Dashboards, Cortex Agents, natural-language queries, and compliance packs all read from the same definition. No reconciliation meetings.</p>
          </div>
          <div className="space-y-2">
            <div className="text-accent-purple font-medium text-sm">Govern by Design</div>
            <p className="text-xs text-slate-400">Row-level security, column masking, and VQR accuracy guarantees are embedded in the Semantic View — not bolted on after.</p>
          </div>
        </div>
      </section>

      {/* Five Semantic Views */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Database size={18} className="text-gold-400" />
          Five Domain Semantic Views
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semanticViews.map(sv => (
            <div key={sv.name} className="bg-navy-900 border border-navy-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded bg-navy-800 text-gold-400 font-mono">{sv.domain}</span>
                <Layers size={14} className="text-slate-500" />
              </div>
              <div className="font-mono text-sm text-slate-200">{sv.name}</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-accent-blue">{sv.metrics}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Metrics</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent-green">{sv.dimensions}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Dimensions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent-purple">{sv.vqrs}</div>
                  <div className="text-[10px] text-slate-500 uppercase">VQRs</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Consumers: Dashboard · Agent · NL Query · Compliance
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Query Panel */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Search size={18} className="text-gold-400" />
          Ask Your Data — Powered by Cortex Analyst
        </h2>
        <div className="space-y-4">
          {sampleQueries.map((q, i) => (
            <div key={i} className="bg-navy-900 border border-navy-700 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-navy-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-slate-400">NATURAL LANGUAGE</span>
                </div>
                <div className="text-sm font-medium text-slate-200">"{q.question}"</div>
              </div>
              <div className="grid md:grid-cols-2 divide-x divide-navy-700">
                <div className="p-4 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Semantic View → SQL Generated</div>
                  <div className="text-xs text-accent-blue font-mono">{q.sv}</div>
                  <pre className="text-xs text-slate-300 bg-navy-950 rounded p-3 overflow-x-auto font-mono leading-relaxed">{q.sql}</pre>
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Result</div>
                  <p className="text-sm text-slate-200 leading-relaxed">{q.result}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield size={12} className="text-accent-green" />
                    <span className="text-[10px] text-accent-green">VQR verified · Row-filtered to user's role</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Governance Proof */}
      <section className="bg-navy-900 border border-navy-700 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">Governance Proof</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-200">What the Store Leader sees</div>
            <div className="bg-navy-950 rounded p-3 text-xs font-mono text-slate-300">
              Store: Santiago Centro<br/>
              Churn Rate: 9.2%<br/>
              Top Segment: Families 35-44<br/>
              <span className="text-slate-600">PII: [MASKED] · Other stores: [FILTERED]</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-200">What the Regional VP sees</div>
            <div className="bg-navy-950 rounded p-3 text-xs font-mono text-slate-300">
              Region: Metropolitana (12 stores)<br/>
              Churn Rate: 9.7% (avg)<br/>
              Top Segment: Families 35-44<br/>
              Worst Store: Mall Plaza Oeste (11.2%)<br/>
              <span className="text-accent-green">Full PII access · All stores visible</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500">Same Semantic View, same query, same metric definition — different row-level security applied by role. No separate reports needed.</p>
      </section>
    </div>
  )
}
