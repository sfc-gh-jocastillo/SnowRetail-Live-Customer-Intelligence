import { Wifi, WifiOff, Clock, Database, Layers } from 'lucide-react'

interface QueryResult {
  sql: string
  resultText?: string
  rows?: Record<string, unknown>[]
  executionTimeMs: number
  rowsScanned?: number
  bytesScanned?: string
  partitionsPruned?: string
  isLive: boolean
  semanticView?: string
}

export function QueryResultCard({ result }: { result: QueryResult }) {
  return (
    <div className="bg-navy-950 border border-navy-700 rounded-lg overflow-hidden mt-4 animate-in fade-in slide-in-from-top-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-navy-700 bg-navy-900/50">
        <div className="flex items-center gap-2">
          {result.isLive ? (
            <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/30">
              <Wifi size={10} /> Live Query
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded bg-navy-800 text-slate-500 border border-navy-700">
              <WifiOff size={10} /> Synthetic
            </span>
          )}
          {result.semanticView && (
            <span className="flex items-center gap-1 text-[10px] text-gold-400">
              <Layers size={10} /> {result.semanticView}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={10} className="text-accent-blue" />
            <span className="text-accent-blue font-mono">{result.executionTimeMs}ms</span>
          </span>
          {result.rowsScanned && (
            <span className="flex items-center gap-1">
              <Database size={10} />
              {result.rowsScanned.toLocaleString()} rows
            </span>
          )}
          {result.bytesScanned && (
            <span>{result.bytesScanned}</span>
          )}
        </div>
      </div>

      {/* SQL */}
      <div className="px-4 py-3 border-b border-navy-700">
        <div className="text-[10px] text-slate-500 uppercase mb-1">Generated SQL</div>
        <pre className="text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">{result.sql}</pre>
      </div>

      {/* Results */}
      <div className="px-4 py-3">
        {result.rows && result.rows.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="text-[10px] text-slate-500 uppercase mb-2">Results ({result.rows.length} rows)</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700">
                  {Object.keys(result.rows[0]).map(col => (
                    <th key={col} className="text-left py-1 px-2 text-slate-500 font-mono font-normal">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b border-navy-800/50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="py-1 px-2 text-slate-300 font-mono">
                        {typeof val === 'number' ? Number(val).toLocaleString(undefined, { maximumFractionDigits: 4 }) : String(val ?? 'NULL')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : result.resultText ? (
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">Analysis</div>
            <p className="text-sm text-slate-300 leading-relaxed">{result.resultText}</p>
          </div>
        ) : null}
      </div>

      {/* Performance Strip */}
      {(result.partitionsPruned || result.rowsScanned) && (
        <div className="px-4 py-2 border-t border-navy-700 bg-navy-900/30 flex items-center gap-4 text-[10px] text-slate-500">
          <span>Warehouse: <span className="text-slate-300">XS</span></span>
          {result.partitionsPruned && <span>Partitions: <span className="text-accent-green">{result.partitionsPruned}</span></span>}
          {result.rowsScanned && <span>Scanned: <span className="text-slate-300">{result.rowsScanned.toLocaleString()}</span></span>}
          {result.bytesScanned && <span>Bytes: <span className="text-slate-300">{result.bytesScanned}</span></span>}
        </div>
      )}
    </div>
  )
}
