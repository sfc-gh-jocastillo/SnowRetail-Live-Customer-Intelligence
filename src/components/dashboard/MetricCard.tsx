interface MetricCardProps {
  label: string
  value: number | string
  format: 'number' | 'currency' | 'percent' | 'decimal'
  loading?: boolean
  isLive?: boolean
}

export function MetricCard({ label, value, format, loading, isLive }: MetricCardProps) {
  const formatted = formatValue(value, format)

  return (
    <div className="bg-navy-900 border border-navy-700 rounded-xl p-4 relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-navy-900/80 flex items-center justify-center">
          <div className="h-4 w-4 border-2 border-sf-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold mt-1 text-slate-100">{formatted}</div>
      {isLive !== undefined && (
        <div className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${isLive ? 'bg-accent-green' : 'bg-slate-600'}`} />
      )}
    </div>
  )
}

function formatValue(value: number | string, format: string): string {
  if (typeof value === 'string') return value
  switch (format) {
    case 'currency':
      return value >= 1000000
        ? `$${(value / 1000000).toFixed(1)}M`
        : `$${value.toLocaleString('es-CL')}`
    case 'percent':
      return `${(value * 100).toFixed(1)}%`
    case 'decimal':
      return value.toFixed(2)
    case 'number':
    default:
      return value.toLocaleString('es-CL')
  }
}
