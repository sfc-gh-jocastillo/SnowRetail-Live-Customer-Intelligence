import { useState, useCallback } from 'react'
import { useSnowflakeConnection } from './useSnowflakeConnection'

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
    if (!connected || !config) {
      return getSyntheticResponse(question, semanticView)
    }

    setLoading(true)
    const startTime = performance.now()
    try {
      const fqn = SEMANTIC_VIEW_MAP[semanticView] || `SNOWRETAIL.SEMANTIC.${semanticView}`

      // Step 1: Ask Cortex Analyst for the SQL
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

      if (!res.ok) {
        return { ...getSyntheticResponse(question, semanticView), isLive: false }
      }

      const data = await res.json()
      const content = data.message?.content || []
      let generatedSQL = ''

      for (const block of content) {
        if (block.type === 'sql') {
          generatedSQL = block.statement || block.text || ''
        }
      }

      if (!generatedSQL) {
        // If no SQL was generated (e.g., clarification question), show the text
        let textResponse = ''
        for (const block of content) {
          if (block.type === 'text') textResponse += block.text + ' '
        }
        return {
          query: question,
          semanticView,
          generatedSQL: '-- No se generó SQL',
          result: textResponse.trim() || 'No se pudo generar una consulta para esta pregunta.',
          isLive: true,
          executionTimeMs: Math.round(performance.now() - startTime),
        }
      }

      // Step 2: Execute the generated SQL to get actual data
      const sqlRes = await fetch(`${config.accountUrl}/api/v2/statements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          statement: generatedSQL,
          timeout: 30,
          database: 'SNOWRETAIL',
          schema: 'GOLD',
          warehouse: 'COMPUTE_WH',
        }),
      })

      const executionTimeMs = Math.round(performance.now() - startTime)

      if (!sqlRes.ok) {
        return {
          query: question,
          semanticView,
          generatedSQL,
          result: 'Error al ejecutar la consulta.',
          isLive: true,
          executionTimeMs,
        }
      }

      const sqlData = await sqlRes.json()

      // Parse SQL API response into rows
      const columns: string[] = sqlData.resultSetMetaData?.rowType?.map((col: { name: string }) => col.name) || []
      const rawRows: string[][] = sqlData.data || []
      const resultRows = rawRows.map((row: string[]) => {
        const obj: Record<string, unknown> = {}
        columns.forEach((col, i) => {
          const val = row[i]
          obj[col] = val === null || val === undefined ? null : isNaN(Number(val)) ? val : Number(val)
        })
        return obj
      })

      // Step 3: Generate a natural language summary in Spanish from the data
      const nlSummary = generateSpanishSummary(question, columns, resultRows)

      return {
        query: question,
        semanticView,
        generatedSQL,
        result: nlSummary,
        resultRows,
        isLive: true,
        executionTimeMs,
      }
    } catch {
      return { ...getSyntheticResponse(question, semanticView), isLive: false }
    } finally {
      setLoading(false)
    }
  }, [connected, config])

  return { ask, loading, connected }
}

function generateSpanishSummary(_question: string, columns: string[], rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return 'La consulta no retornó resultados.'

  const numRows = rows.length
  const firstCol = columns[0] || 'categoría'
  const metricCols = columns.slice(1)

  if (numRows <= 8 && metricCols.length > 0) {
    // Tabular summary in natural language
    const lines = rows.map(row => {
      const dim = String(row[firstCol] || 'N/A')
      const metrics = metricCols.map(col => {
        const val = row[col]
        if (typeof val === 'number') {
          return `${col.replace(/_/g, ' ')}: ${val < 1 && val > 0 ? (val * 100).toFixed(1) + '%' : val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        }
        return `${col.replace(/_/g, ' ')}: ${val}`
      }).join(', ')
      return `• ${dim} → ${metrics}`
    })

    return `Resultados para ${numRows} ${firstCol.replace(/_/g, ' ').toLowerCase()}(s):\n\n${lines.join('\n')}`
  }

  // Generic summary
  if (metricCols.length > 0) {
    const firstMetric = metricCols[0]
    const values = rows.map(r => Number(r[firstMetric])).filter(v => !isNaN(v))
    if (values.length > 0) {
      const max = Math.max(...values)
      const min = Math.min(...values)
      const maxRow = rows.find(r => Number(r[firstMetric]) === max)
      const minRow = rows.find(r => Number(r[firstMetric]) === min)
      return `Se encontraron ${numRows} registros. El valor más alto de ${firstMetric.replace(/_/g, ' ')} es ${max.toLocaleString()} (${maxRow?.[firstCol]}), el más bajo es ${min.toLocaleString()} (${minRow?.[firstCol]}).`
    }
  }

  return `La consulta retornó ${numRows} filas con las columnas: ${columns.join(', ')}.`
}

function getSyntheticResponse(question: string, semanticView: string): AnalystResponse {
  const responses: Record<string, AnalystResponse> = {
    'SV_CUSTOMER_INTELLIGENCE': {
      query: question,
      semanticView,
      generatedSQL: `SELECT region, AVG(churn_rate) AS avg_churn_rate,\n  AVG(clv) AS avg_clv\nFROM SNOWRETAIL.GOLD.CUSTOMER_360\nGROUP BY region\nORDER BY avg_clv DESC`,
      result: 'Resultados para 6 región(es):\n\n• Metropolitana → avg churn rate: 8.5%, avg clv: $6,280\n• Valparaiso → avg churn rate: 8.5%, avg clv: $6,120\n• Biobio → avg churn rate: 8.5%, avg clv: $6,050\n• Sur → avg churn rate: 11.5%, avg clv: $5,890\n• Norte → avg churn rate: 8.5%, avg clv: $5,820\n• Austral → avg churn rate: 8.5%, avg clv: $5,750',
      isLive: false,
    },
    'SV_OMNICHANNEL_OPS': {
      query: question,
      semanticView,
      generatedSQL: `SELECT aisle, AVG(foot_traffic) AS avg_traffic,\n  AVG(conversion_rate) AS avg_conversion\nFROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT\nGROUP BY aisle\nORDER BY avg_conversion ASC`,
      result: 'Resultados para 20 pasillo(s):\n\n• Aisle 14 → avg traffic: 1,200, avg conversion: 3.2%\n• Aisle 7 → avg traffic: 890, avg conversion: 4.1%\n• Aisle 3 → avg traffic: 2,100, avg conversion: 5.8%\n\n14 SKUs promocionados están en pasillos de bajo tráfico. Recomendación: cluster en endcap + ubicación secundaria para +22% lift proyectado.',
      isLive: false,
    },
    'SV_COMMERCE_REVENUE': {
      query: question,
      semanticView,
      generatedSQL: `SELECT category, SUM(revenue_leakage) AS total_leakage,\n  SUM(revenue_net) AS total_revenue\nFROM SNOWRETAIL.GOLD.SALES_DAILY\nGROUP BY category\nORDER BY total_leakage DESC`,
      result: 'Resultados para 6 categoría(s):\n\n• Electronics → fuga total: $480K, revenue neto: $42M\n• Fashion → fuga total: $320K, revenue neto: $38M\n• Home → fuga total: $210K, revenue neto: $28M\n\nFuga Q3: 0.18% ($1.2M) vs Q2: 0.07% ($460K). Spike por stacking incorrecto de descuentos en 3 campañas.',
      isLive: false,
    },
    'SV_SUPPLY_CHAIN': {
      query: question,
      semanticView,
      generatedSQL: `SELECT supplier_name, avg_lead_time_days,\n  lead_time_trend_30d, stockout_events_caused,\n  revenue_impact\nFROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE\nWHERE lead_time_trend_30d > 0\nORDER BY revenue_impact DESC`,
      result: 'Resultados para 3 proveedor(es) con tendencia de retraso:\n\n• GlobalTech Supply Co → trend +4.2 días, 12 quiebres, impacto $420K\n• ElectroAsia Trading → trend +3.8 días, 9 quiebres, impacto $340K\n• TechDirect Korea → trend +5.1 días, 6 quiebres, impacto $180K\n\nIngreso total en riesgo: $940K.',
      isLive: false,
    },
    'SV_MARKETING_GROWTH': {
      query: question,
      semanticView,
      generatedSQL: `SELECT channel, audience_segment,\n  AVG(roas) AS avg_roas,\n  SUM(attributed_revenue) AS total_revenue\nFROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE\nWHERE audience_segment = 'LOYALTY_MEMBERS'\nGROUP BY channel, audience_segment`,
      result: 'Resultados para campañas de miembros de fidelidad:\n\n• EMAIL → ROAS promedio: 4.5x, revenue atribuido: $2.8M\n• PUSH → ROAS promedio: 3.8x, revenue atribuido: $1.2M\n• SMS → ROAS promedio: 3.2x, revenue atribuido: $890K\n\nAtribución multi-touch asigna 38% al touchpoint de email. Tier Platinum: 6.2x, Gold: 4.8x, Silver: 3.1x.',
      isLive: false,
    },
  }

  return responses[semanticView] || {
    query: question,
    semanticView,
    generatedSQL: `-- Respuesta sintética (conecta a Snowflake para datos en vivo)\nSELECT * FROM SNOWRETAIL.GOLD.MART`,
    result: 'Respuesta sintética — conecta a Snowflake para resultados en vivo.',
    isLive: false,
  }
}
