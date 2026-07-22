import { useState, useEffect, useRef } from 'react'
import { Radio, Zap } from 'lucide-react'

interface StreamEvent {
  id: string
  timestamp: string
  terminal: string
  sku: string
  amount: string
  channel: string
  city: string
}

const CITIES = ['Santiago', 'Concepcion', 'Valparaiso', 'Temuco', 'Antofagasta', 'La Serena', 'Rancagua', 'Puerto Montt']
const CHANNELS = ['STORE', 'WEB', 'APP', 'STORE', 'STORE', 'APP']
const TERMINALS = ['POS-SC-003', 'POS-SC-007', 'POS-SC-012', 'POS-VM-001', 'POS-CC-005', 'POS-TM-002', 'WEB-001', 'APP-001']

function generateEvent(): StreamEvent {
  const now = new Date()
  return {
    id: Math.random().toString(36).slice(2, 10),
    timestamp: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`,
    terminal: TERMINALS[Math.floor(Math.random() * TERMINALS.length)],
    sku: `SKU-${Math.floor(Math.random() * 9000 + 1000)}`,
    amount: `$${(Math.random() * 250 + 10).toFixed(2)}`,
    channel: CHANNELS[Math.floor(Math.random() * CHANNELS.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
  }
}

export function StreamingSimulator() {
  const [events, setEvents] = useState<StreamEvent[]>([])
  const [running, setRunning] = useState(false)
  const [totalEvents, setTotalEvents] = useState(0)
  const [eventsPerSec, setEventsPerSec] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const counterRef = useRef(0)

  const start = () => {
    setRunning(true)
    counterRef.current = 0
    intervalRef.current = setInterval(() => {
      const batch = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, generateEvent)
      setEvents(prev => [...batch, ...prev].slice(0, 20))
      counterRef.current += batch.length
      setTotalEvents(t => t + batch.length)
      setEventsPerSec(Math.floor(Math.random() * 400 + 1000))
    }, 80)
  }

  const stop = () => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <div className="bg-navy-950 border border-navy-700 rounded-lg overflow-hidden mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-navy-700 bg-navy-900/50">
        <div className="flex items-center gap-2">
          <Radio size={14} className={running ? 'text-accent-red animate-pulse' : 'text-slate-500'} />
          <span className="text-xs font-medium text-slate-300">Snowpipe Streaming — POS Events</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="text-accent-green font-mono">{eventsPerSec.toLocaleString()} evt/s</span>
          <span>Latency: <span className="text-accent-blue font-mono">{Math.floor(Math.random() * 20 + 8)}ms</span></span>
          <span>Total: <span className="font-mono">{totalEvents.toLocaleString()}</span></span>
        </div>
      </div>

      {/* Event Feed */}
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-navy-950 to-transparent z-10 pointer-events-none" />
        <div className="px-4 py-2 space-y-0.5 font-mono text-[11px]">
          {events.map(e => (
            <div key={e.id} className="flex items-center gap-3 py-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <span className="text-slate-600 w-20">{e.timestamp}</span>
              <span className="text-accent-blue w-20">{e.terminal}</span>
              <span className="text-slate-400 w-16">{e.sku}</span>
              <span className="text-accent-green w-16 text-right">{e.amount}</span>
              <span className="text-gold-400 w-12">{e.channel}</span>
              <span className="text-slate-500">{e.city}</span>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-slate-600 text-center py-8">Click Start to simulate streaming ingestion</div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-navy-700 bg-navy-900/30">
        <button
          onClick={running ? stop : start}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            running
              ? 'bg-accent-red/10 text-accent-red border border-accent-red/30 hover:bg-accent-red/20'
              : 'bg-accent-green/10 text-accent-green border border-accent-green/30 hover:bg-accent-green/20'
          }`}
        >
          <Zap size={12} />
          {running ? 'Stop Stream' : 'Start Stream'}
        </button>
        <span className="text-[10px] text-slate-500">Sub-second ingestion from 50 stores into Snowflake</span>
      </div>
    </div>
  )
}
