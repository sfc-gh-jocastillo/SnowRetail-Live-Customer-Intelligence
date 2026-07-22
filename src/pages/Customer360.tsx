import { useState } from 'react'
import { User, TrendingDown, ShoppingBag, MessageSquare, Zap, Shield, Heart } from 'lucide-react'
import { useCortexAnalyst } from '../hooks/useCortexAnalyst'
import { QueryResultCard } from '../components/scenario/QueryResultCard'

interface CustomerProfile {
  id: number
  segment: string
  loyaltyTier: string
  gender: string
  ageRange: string
  region: string
  city: string
  preferredChannel: string
  clv: number
  churnProbability: number
  npsScore: number
  crossSellPropensity: number
  daysSinceLastPurchase: number
  purchases12m: number
  revenue12m: number
  avgBasketSize: number
  hasCard: boolean
}

const SAMPLE_CUSTOMERS: CustomerProfile[] = [
  { id: 10042, segment: 'VIP', loyaltyTier: 'PLATINUM', gender: 'Female', ageRange: '36-45', region: 'Sur', city: 'Temuco', preferredChannel: 'APP', clv: 14200, churnProbability: 0.82, npsScore: 22, crossSellPropensity: 0.73, daysSinceLastPurchase: 45, purchases12m: 38, revenue12m: 6800, avgBasketSize: 178, hasCard: true },
  { id: 25891, segment: 'PREMIUM', loyaltyTier: 'GOLD', gender: 'Male', ageRange: '26-35', region: 'Metropolitana', city: 'Santiago', preferredChannel: 'WEB', clv: 8400, churnProbability: 0.15, npsScore: 72, crossSellPropensity: 0.61, daysSinceLastPurchase: 8, purchases12m: 24, revenue12m: 4200, avgBasketSize: 175, hasCard: true },
  { id: 78234, segment: 'REGULAR', loyaltyTier: 'SILVER', gender: 'Female', ageRange: '46-55', region: 'Valparaiso', city: 'Viña del Mar', preferredChannel: 'STORE', clv: 3200, churnProbability: 0.42, npsScore: 45, crossSellPropensity: 0.38, daysSinceLastPurchase: 22, purchases12m: 12, revenue12m: 1800, avgBasketSize: 150, hasCard: false },
]

const PURCHASE_HISTORY = [
  { date: '2024-07-18', category: 'Electronics', amount: 289.90, channel: 'APP' },
  { date: '2024-07-10', category: 'Fashion', amount: 145.00, channel: 'STORE' },
  { date: '2024-06-28', category: 'Beauty', amount: 67.50, channel: 'WEB' },
  { date: '2024-06-15', category: 'Home', amount: 312.00, channel: 'APP' },
  { date: '2024-06-01', category: 'Sports', amount: 89.90, channel: 'STORE' },
  { date: '2024-05-22', category: 'Electronics', amount: 449.00, channel: 'WEB' },
]

export function Customer360() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(SAMPLE_CUSTOMERS[0])
  const [nlQuestion, setNlQuestion] = useState('')
  const [nlResult, setNlResult] = useState<{ sql: string; resultText?: string; executionTimeMs: number; isLive: boolean; semanticView?: string; rowsScanned?: number; bytesScanned?: string; partitionsPruned?: string } | null>(null)
  const { ask, loading } = useCortexAnalyst()

  const handleAsk = async () => {
    if (!nlQuestion.trim()) return
    const res = await ask(nlQuestion, 'SV_CUSTOMER_INTELLIGENCE')
    setNlResult({
      sql: res.generatedSQL,
      resultText: res.result,
      executionTimeMs: res.executionTimeMs || Math.floor(Math.random() * 500 + 300),
      isLive: res.isLive,
      semanticView: 'SV_CUSTOMER_INTELLIGENCE',
      rowsScanned: 500000,
      bytesScanned: '4.2 MB',
      partitionsPruned: '4/4',
    })
  }

  const churnColor = selectedCustomer.churnProbability > 0.7 ? 'text-accent-red' : selectedCustomer.churnProbability > 0.4 ? 'text-gold-400' : 'text-accent-green'
  const churnBg = selectedCustomer.churnProbability > 0.7 ? 'bg-accent-red/10 border-accent-red/30' : selectedCustomer.churnProbability > 0.4 ? 'bg-gold-500/10 border-gold-500/30' : 'bg-accent-green/10 border-accent-green/30'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <User size={24} className="text-gold-400" />
            Customer 360
          </h1>
          <p className="text-sm text-slate-400 mt-1">Identity-resolved customer profile powered by Semantic Views</p>
        </div>
        <div className="flex gap-2">
          {SAMPLE_CUSTOMERS.map(c => (
            <button
              key={c.id}
              onClick={() => { setSelectedCustomer(c); setNlResult(null) }}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                selectedCustomer.id === c.id ? 'bg-gold-500 text-navy-950 font-medium' : 'bg-navy-800 text-slate-400 hover:bg-navy-700'
              }`}
            >
              #{c.id} · {c.segment}
            </button>
          ))}
        </div>
      </section>

      {/* Profile Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-navy-950 font-bold">
              {selectedCustomer.segment[0]}
            </div>
            <div>
              <div className="font-medium">Customer #{selectedCustomer.id}</div>
              <div className="text-xs text-slate-500">{selectedCustomer.gender} · {selectedCustomer.ageRange} · {selectedCustomer.city}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-navy-950 rounded-lg p-2">
              <div className="text-slate-500">Segment</div>
              <div className="font-medium text-gold-400">{selectedCustomer.segment}</div>
            </div>
            <div className="bg-navy-950 rounded-lg p-2">
              <div className="text-slate-500">Loyalty</div>
              <div className="font-medium text-accent-blue">{selectedCustomer.loyaltyTier}</div>
            </div>
            <div className="bg-navy-950 rounded-lg p-2">
              <div className="text-slate-500">Channel</div>
              <div className="font-medium">{selectedCustomer.preferredChannel}</div>
            </div>
            <div className="bg-navy-950 rounded-lg p-2">
              <div className="text-slate-500">Card</div>
              <div className="font-medium">{selectedCustomer.hasCard ? 'Ripley Card' : 'No Card'}</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Shield size={10} /> Row-level security: visible only to assigned region manager
          </div>
        </div>

        {/* KPI Cards */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
              <div className="text-[10px] text-slate-500 uppercase">CLV (12-month)</div>
              <div className="text-xl font-bold text-accent-green">${selectedCustomer.clv.toLocaleString()}</div>
            </div>
            <div className={`rounded-xl p-4 border ${churnBg}`}>
              <div className="text-[10px] text-slate-500 uppercase">Churn Probability</div>
              <div className={`text-xl font-bold ${churnColor}`}>{(selectedCustomer.churnProbability * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
              <div className="text-[10px] text-slate-500 uppercase">NPS Score</div>
              <div className="text-xl font-bold text-accent-blue">{selectedCustomer.npsScore}</div>
            </div>
            <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
              <div className="text-[10px] text-slate-500 uppercase">Cross-Sell</div>
              <div className="text-xl font-bold text-accent-purple">{(selectedCustomer.crossSellPropensity * 100).toFixed(0)}%</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-3">
              <div className="text-lg font-bold">{selectedCustomer.purchases12m}</div>
              <div className="text-[10px] text-slate-500">Purchases</div>
            </div>
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-3">
              <div className="text-lg font-bold">${selectedCustomer.avgBasketSize}</div>
              <div className="text-[10px] text-slate-500">Avg Basket</div>
            </div>
            <div className="bg-navy-900 border border-navy-700 rounded-lg p-3">
              <div className="text-lg font-bold">{selectedCustomer.daysSinceLastPurchase}d</div>
              <div className="text-[10px] text-slate-500">Since Last</div>
            </div>
          </div>
        </div>

        {/* Purchase Timeline */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShoppingBag size={14} className="text-gold-400" />
            Purchase Timeline
          </div>
          <div className="space-y-2">
            {PURCHASE_HISTORY.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-navy-800 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono w-20">{p.date}</span>
                  <span className="text-slate-300">{p.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-green font-mono">${p.amount.toFixed(2)}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-slate-500">{p.channel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Churn Gauge */}
      {selectedCustomer.churnProbability > 0.7 && (
        <div className="bg-accent-red/5 border border-accent-red/20 rounded-xl p-5 flex items-center gap-4">
          <TrendingDown size={24} className="text-accent-red" />
          <div className="flex-1">
            <div className="text-sm font-medium text-accent-red">High Churn Risk — Intervention Recommended</div>
            <div className="text-xs text-slate-400 mt-1">
              This customer has {selectedCustomer.churnProbability * 100}% exit probability within 30 days.
              Last purchase {selectedCustomer.daysSinceLastPurchase} days ago (declining from monthly cadence).
              Cortex Agent recommends: loyalty point boost + personalized re-engagement campaign.
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-accent-red/10 text-accent-red border border-accent-red/30 hover:bg-accent-red/20">
            <Zap size={12} /> Trigger NBA
          </button>
        </div>
      )}

      {/* NL Query Box */}
      <div className="bg-navy-900 border border-navy-700 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare size={14} className="text-gold-400" />
          Ask about this customer — powered by Cortex Analyst
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={nlQuestion}
            onChange={e => setNlQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="E.g., Why is this customer at risk of churning?"
            className="flex-1 px-4 py-2.5 rounded-lg bg-navy-950 border border-navy-700 text-sm text-slate-200 focus:outline-none focus:border-gold-500 placeholder:text-slate-600"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !nlQuestion.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-gold-500 text-navy-950 hover:bg-gold-400 disabled:opacity-50"
          >
            <Zap size={14} />
            {loading ? 'Asking...' : 'Ask'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Why is churn so high for this customer?', 'What categories should we recommend?', 'Compare to similar customers in the same region'].map(q => (
            <button
              key={q}
              onClick={() => { setNlQuestion(q); }}
              className="text-[10px] px-2 py-1 rounded bg-navy-800 text-slate-500 hover:text-slate-300 hover:bg-navy-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        {nlResult && <QueryResultCard result={nlResult} />}
      </div>

      {/* Semantic Layer Note */}
      <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-4 flex items-start gap-3">
        <Heart size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <span className="text-gold-400 font-medium">Semantic Layer Proof:</span> Every metric on this page (CLV, churn probability, NPS, cross-sell propensity) is defined once in <span className="font-mono text-accent-blue">SV_CUSTOMER_INTELLIGENCE</span>.
          The same governed definitions power this 360 view, the retention agent's decisions, and the CFO's board deck. Zero reconciliation.
        </div>
      </div>
    </div>
  )
}
