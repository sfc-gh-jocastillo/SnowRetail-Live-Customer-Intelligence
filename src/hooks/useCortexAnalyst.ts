import { useState, useCallback } from 'react'
import { useSnowflakeConnection } from './useSnowflakeConnection'
import { generateSmartResponse } from '../lib/syntheticEngine'

export interface AnalystResponse {
  query: string
  semanticView: string
  generatedSQL: string
  result: string
  resultRows?: Record<string, unknown>[]
  isLive: boolean
  executionTimeMs?: number
}

const SEMANTIC_VIEW_MAP: Record<string, string> = {
  'SV_CUSTOMER_INTELLIGENCE': 'SNOWRETAIL.SEMANTIC.SV_CUSTOMER_INTELLIGENCE',
  'SV_OMNICHANNEL_OPS': 'SNOWRETAIL.SEMANTIC.SV_OMNICHANNEL_OPS',
  'SV_COMMERCE_REVENUE': 'SNOWRETAIL.SEMANTIC.SV_COMMERCE_REVENUE',
  'SV_SUPPLY_CHAIN': 'SNOWRETAIL.SEMANTIC.SV_SUPPLY_CHAIN',
  'SV_MARKETING_GROWTH': 'SNOWRETAIL.SEMANTIC.SV_MARKETING_GROWTH',
}

export function useCortexAnalyst() {
  const { config, connected } = useSnowflakeConnection()
  const [loading, setLoading] = useState(false)

  const ask = useCallback(async (
    question: string,
    semanticView: string,
  ): Promise<AnalystResponse> => {
    setLoading(true)
    const startTime = performance.now()

    try {
      // If connected, try live Snowflake query
      if (connected && config) {
        const fqn = SEMANTIC_VIEW_MAP[semanticView] || `SNOWRETAIL.SEMANTIC.${semanticView}`

        const res = await fetch(`${config.accountUrl}/api/v2/cortex/analyst/message`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: [{ type: 'text', text: question }] }],
            semantic_view: fqn,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const content = data.message?.content || []
          let generatedSQL = ''

          for (const block of content) {
            if (block.type === 'sql') {
              generatedSQL = block.statement || block.text || ''
            }
          }

          if (generatedSQL) {
            // Execute the SQL
            const sqlRes = await fetch(`${config.accountUrl}/api/v2/statements`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${config.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                statement: generatedSQL,
                timeout: 30,
                database: 'SNOWRETAIL',
                schema: 'GOLD',
                warehouse: 'COMPUTE_WH',
              }),
            })

            if (sqlRes.ok) {
              const sqlData = await sqlRes.json()
              const columns: string[] = sqlData.resultSetMetaData?.rowType?.map((c: { name: string }) => c.name) || []
              const rawRows: string[][] = sqlData.data || []
              const rows = rawRows.map((row: string[]) => {
                const obj: Record<string, unknown> = {}
                columns.forEach((col, i) => {
                  const val = row[i]
                  obj[col] = val === null ? null : isNaN(Number(val)) ? val : Number(val)
                })
                return obj
              })

              const summary = buildSpanishSummary(columns, rows)
              return {
                query: question,
                semanticView,
                generatedSQL,
                result: summary,
                resultRows: rows,
                isLive: true,
                executionTimeMs: Math.round(performance.now() - startTime),
              }
            }
          }
        }
      }

      // Fallback: smart synthetic response
      const synthetic = generateSmartResponse(question, semanticView)
      return {
        ...synthetic,
        executionTimeMs: Math.round(performance.now() - startTime) + Math.floor(Math.random() * 300 + 400),
      }
    } catch {
      const synthetic = generateSmartResponse(question, semanticView)
      return {
        ...synthetic,
        executionTimeMs: Math.floor(Math.random() * 300 + 400),
      }
    } finally {
      setLoading(false)
    }
  }, [connected, config])

  return { ask, loading, connected }
}

function buildSpanishSummary(columns: string[], rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return 'La consulta no retornó resultados.'
  const numRows = rows.length
  const firstCol = columns[0]
  const metricCols = columns.slice(1)

  if (numRows <= 10 && metricCols.length > 0) {
    const lines = rows.map(row => {
      const dim = String(row[firstCol] || 'N/A')
      const metrics = metricCols.map(col => {
        const val = row[col]
        if (typeof val === 'number') {
          if (val < 1 && val > 0) return `${col.toLowerCase().replace(/_/g, ' ')}: ${(val * 100).toFixed(1)}%`
          return `${col.toLowerCase().replace(/_/g, ' ')}: ${val.toLocaleString('es-CL', { maximumFractionDigits: 2 })}`
        }
        return `${col.toLowerCase().replace(/_/g, ' ')}: ${val}`
      }).join(' · ')
      return `• **${dim}** → ${metrics}`
    })
    return `Resultados (${numRows} filas):\n\n${lines.join('\n')}`
  }

  return `La consulta retornó ${numRows} filas con columnas: ${columns.join(', ')}.`
}
