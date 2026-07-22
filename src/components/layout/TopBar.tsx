import { useState, useEffect } from 'react'
import { Menu, Wifi, WifiOff, Command } from 'lucide-react'

export function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [signals, setSignals] = useState(42817)
  const [decisions, setDecisions] = useState(18)
  const [actions, setActions] = useState(4)
  const [connected] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(s => s + Math.floor(Math.random() * 200))
      if (Math.random() > 0.7) setDecisions(d => d + 1)
      if (Math.random() > 0.9) setActions(a => a + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-navy-700 bg-navy-900/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="text-slate-400 hover:text-white">
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>
            <span className="text-gold-400 font-mono">{signals.toLocaleString()}</span> signals
          </span>
          <span>
            <span className="text-accent-blue font-mono">{decisions}</span> agent decisions
          </span>
          <span>
            <span className="text-accent-green font-mono">{actions}</span> closed-loop actions
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-navy-800 text-xs text-slate-300 hover:bg-navy-700">
          <Command size={12} />
          <span>K</span>
        </button>
        <div className={`flex items-center gap-1.5 text-xs ${connected ? 'text-accent-green' : 'text-slate-500'}`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{connected ? 'Live' : 'Offline'}</span>
        </div>
      </div>
    </header>
  )
}
