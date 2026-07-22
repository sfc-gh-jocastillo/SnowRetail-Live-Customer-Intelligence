import { useState, useCallback } from 'react'
import { useSnowflakeConnection } from './useSnowflakeConnection'

export interface AnalystResponse {
  query: string
  semanticView: string
  generatedSQL: string
  result: string
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
    // If not connected to Snowflake, return synthetic response
    if (!connected || !config) {
      return getSyntheticResponse(question, semanticView)
    }

    // Live query via Cortex Analyst REST API
    setLoading(true)
    const startTime = performance.now()
    try {
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

      const executionTimeMs = Math.round(performance.now() - startTime)

      if (!res.ok) {
        // Fallback to synthetic on error
        return { ...getSyntheticResponse(question, semanticView), isLive: false }
      }

      const data = await res.json()

      // Parse the Cortex Analyst response format
      const content = data.message?.content || data.choices?.[0]?.messages?.[0]?.content || []
      let generatedSQL = ''
      let resultText = ''

      for (const block of content) {
        if (block.type === 'sql') {
          generatedSQL = block.statement || block.text || ''
        } else if (block.type === 'text') {
          resultText += block.text + ' '
        }
      }

      return {
        query: question,
        semanticView,
        generatedSQL: generatedSQL || '-- No SQL generated',
        result: resultText.trim() || 'Query executed successfully. See SQL for details.',
        isLive: true,
        executionTimeMs,
      }
    } catch (e: unknown) {
      // Fallback to synthetic on network error
      return { ...getSyntheticResponse(question, semanticView), isLive: false }
    } finally {
      setLoading(false)
    }
  }, [connected, config])

  return { ask, loading, connected }
}

function getSyntheticResponse(question: string, semanticView: string): AnalystResponse {
  const responses: Record<string, AnalystResponse> = {
    'SV_CUSTOMER_INTELLIGENCE': {
      query: question,
      semanticView,
      generatedSQL: `SELECT region, AVG(churn_rate) AS avg_churn_rate,\n  AVG(mom_change) AS avg_mom_change\nFROM SNOWRETAIL.GOLD.CUSTOMER_360\nGROUP BY region\nORDER BY avg_churn_rate DESC`,
      result: 'Region Sur churn spiked +1.8pp (11.5% vs 8.5% national avg), driven by 35-44 age segment (68% of increase). Root cause: premium category price increase 3 weeks ago.',
      isLive: false,
    },
    'SV_OMNICHANNEL_OPS': {
      query: question,
      semanticView,
      generatedSQL: `SELECT aisle, AVG(foot_traffic) AS avg_traffic,\n  AVG(conversion_rate) AS avg_conversion,\n  COUNT(*) FILTER (WHERE campaign_sku) AS campaign_skus\nFROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT\nGROUP BY aisle\nORDER BY avg_conversion ASC`,
      result: '14 promoted SKUs in low-traffic aisles. Recommended: endcap cluster + secondary home-aisle placement for projected +22% sales lift.',
      isLive: false,
    },
    'SV_COMMERCE_REVENUE': {
      query: question,
      semanticView,
      generatedSQL: `SELECT category, SUM(revenue_leakage) AS total_leakage,\n  SUM(revenue_net) AS total_revenue,\n  SUM(revenue_leakage) / NULLIF(SUM(revenue_net), 0) AS leakage_rate\nFROM SNOWRETAIL.GOLD.SALES_DAILY\nGROUP BY category\nORDER BY total_leakage DESC`,
      result: 'Q3 leakage: 0.18% ($1.2M) vs Q2: 0.07% ($460K). Spike driven by Electronics (+0.14pp) due to incorrect discount stacking on 3 campaigns.',
      isLive: false,
    },
    'SV_SUPPLY_CHAIN': {
      query: question,
      semanticView,
      generatedSQL: `SELECT supplier_name, avg_lead_time_days,\n  lead_time_trend_30d, stockout_events_caused,\n  revenue_impact\nFROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE\nWHERE lead_time_trend_30d > 0\nORDER BY revenue_impact DESC`,
      result: '3 suppliers trending late: GlobalTech (+4.2 days, $420K impact), ElectroAsia (+3.8 days, $340K), TechDirect (+5.1 days, $180K). Total revenue at risk: $940K.',
      isLive: false,
    },
    'SV_MARKETING_GROWTH': {
      query: question,
      semanticView,
      generatedSQL: `SELECT channel, audience_segment,\n  AVG(roas) AS avg_roas,\n  SUM(attributed_revenue) AS total_revenue,\n  SUM(total_spend) AS total_spend\nFROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE\nWHERE audience_segment = 'LOYALTY_MEMBERS'\nGROUP BY channel, audience_segment`,
      result: 'Loyalty email ROAS: 4.5x (vs 3.1x non-loyalty). Multi-touch attribution credits 38% to email touchpoint. Platinum tier: 6.2x, Gold: 4.8x, Silver: 3.1x.',
      isLive: false,
    },
  }

  return responses[semanticView] || {
    query: question,
    semanticView,
    generatedSQL: `-- Synthetic response (connect to Snowflake for live data)\nSELECT * FROM SNOWRETAIL.GOLD.MART`,
    result: 'Synthetic response — connect to Snowflake for live results.',
    isLive: false,
  }
}
