import { useState, useEffect } from 'react'
import { RefreshCw, Database, CheckCircle } from 'lucide-react'

export function DynamicTableRefresh() {
  const [lastRefresh, setLastRefresh] = useState(new Date(Date.now() - 35000))
  const [secondsAgo, setSecondsAgo] = useState(35)
  const [refreshing, setRefreshing] = useState(false)
  const [showChange, setShowChange] = useState(false)
  const targetLag = 60

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastRefresh.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [lastRefresh])

  const simulateRefresh = () => {
    setRefreshing(true)
    setShowChange(false)
    setTimeout(() => {
      setLastRefresh(new Date())
      setSecondsAgo(0)
      setRefreshing(false)
      setShowChange(true)
    }, 1800)
  }

  const progress = Math.min((secondsAgo / targetLag) * 100, 100)

  return (
    <div className="bg-navy-950 border border-navy-700 rounded-lg overflow-hidden mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-navy-700 bg-navy-900/50">
        <div className="flex items-center gap-2">
          <RefreshCw size={14} className={refreshing ? 'text-accent-blue animate-spin' : 'text-slate-400'} />
          <span className="text-xs font-medium text-slate-300">Dynamic Table — gold.customer_360</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/30">
          Target Lag: {targetLag}s
        </span>
      </div>

      {/* Status */}
      <div className="px-4 py-4 space-y-3">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">Last Refresh</div>
            <div className="text-slate-300 font-mono">{lastRefresh.toLocaleTimeString()}</div>
            <div className="text-slate-500">({secondsAgo}s ago)</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">Next Refresh</div>
            <div className="text-slate-300 font-mono">~{Math.max(0, targetLag - secondsAgo)}s</div>
            <div className="text-slate-500">remaining</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">Rows</div>
            <div className="text-slate-300 font-mono">500,000</div>
            <div className="flex items-center gap-1 text-accent-green text-[10px]">
              <CheckCircle size={10} /> FRESH
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-blue rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>0s</span>
            <span>{targetLag}s target lag</span>
          </div>
        </div>

        {/* Before/After */}
        {showChange && (
          <div className="border border-accent-green/20 bg-accent-green/5 rounded-lg p-3 space-y-1 animate-in fade-in">
            <div className="text-[10px] text-accent-green uppercase font-medium">Change Detected</div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500">Before:</span>
                <span className="text-slate-400 ml-2">churn_rate Sur = 0.1148</span>
              </div>
              <div>
                <span className="text-slate-500">After:</span>
                <span className="text-accent-green ml-2">churn_rate Sur = 0.1152 (+0.04pp)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500">3 customers crossed P1 churn threshold — NBA triggered</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-navy-700 bg-navy-900/30">
        <button
          onClick={simulateRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/20 disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Trigger Refresh'}
        </button>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <Database size={10} />
          <span>Incremental refresh — only changed partitions recomputed</span>
        </div>
      </div>
    </div>
  )
}
