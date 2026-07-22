import { Wifi, WifiOff, Clock } from 'lucide-react'

interface LiveBadgeProps {
  isLive: boolean
  executionTimeMs?: number
}

export function LiveBadge({ isLive, executionTimeMs }: LiveBadgeProps) {
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/30">
        <Wifi size={10} />
        Live Query
        {executionTimeMs && (
          <span className="flex items-center gap-0.5 ml-1 text-accent-green/70">
            <Clock size={8} />
            {executionTimeMs}ms
          </span>
        )}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded bg-navy-800 text-slate-500 border border-navy-700">
      <WifiOff size={10} />
      Synthetic
    </span>
  )
}
