import type { AnalystResponse } from '../hooks/useCortexAnalyst'

// Synthetic data that mimics real SNOWRETAIL tables
const REGIONS = ['Metropolitana', 'Valparaiso', 'Biobio', 'Sur', 'Norte', 'Austral']
const SEGMENTS = ['VIP', 'PREMIUM', 'REGULAR', 'NEW', 'LAPSED']
const TIERS = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'NONE']
const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Kids']
const CHANNELS = ['STORE', 'WEB', 'APP']
const MKT_CHANNELS = ['EMAIL', 'PUSH', 'SOCIAL', 'DISPLAY', 'SEARCH', 'SMS']
const SUPPLIERS = ['GlobalTech Supply Co', 'Andina Fashion Group', 'Pacific Home Imports', 'SportsGear Chile', 'BeautyLab LATAM', 'ElectroAsia Trading', 'TechDirect Korea']
const AISLES = ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4', 'Aisle 5', 'Aisle 6', 'Aisle 7', 'Aisle 8', 'Aisle 9', 'Aisle 10']
const AUDIENCES = ['LOYALTY_MEMBERS', 'LAPSED', 'NEW', 'LOOKALIKE', 'BROAD']

const DATA = {
  regionMetrics: REGIONS.map(r => ({
    region: r,
    avg_clv: r === 'Metropolitana' ? 6280 : r === 'Sur' ? 5890 : r === 'Valparaiso' ? 6120 : r === 'Biobio' ? 6050 : r === 'Norte' ? 5820 : 5750,
    avg_churn_rate: r === 'Sur' ? 0.115 : 0.085,
    customer_count: r === 'Metropolitana' ? 167000 : r === 'Valparaiso' ? 83500 : r === 'Biobio' ? 83000 : r === 'Sur' ? 83500 : r === 'Norte' ? 52000 : 31000,
    avg_nps: r === 'Sur' ? 38 : r === 'Metropolitana' ? 52 : 47,
    mom_change: r === 'Sur' ? 0.018 : -0.002,
  })),
  segmentMetrics: SEGMENTS.map(s => ({
    segment: s,
    avg_clv: s === 'VIP' ? 14200 : s === 'PREMIUM' ? 8400 : s === 'REGULAR' ? 3200 : s === 'NEW' ? 1800 : 950,
    customer_count: s === 'VIP' ? 25000 : s === 'PREMIUM' ? 75000 : s === 'REGULAR' ? 250000 : s === 'NEW' ? 75000 : 75000,
    avg_churn: s === 'VIP' ? 0.05 : s === 'PREMIUM' ? 0.08 : s === 'REGULAR' ? 0.12 : s === 'NEW' ? 0.15 : 0.35,
    avg_basket: s === 'VIP' ? 320 : s === 'PREMIUM' ? 210 : s === 'REGULAR' ? 120 : s === 'NEW' ? 85 : 60,
  })),
  categoryRevenue: CATEGORIES.map(c => ({
    category: c,
    revenue_net: c === 'Electronics' ? 42000000 : c === 'Fashion' ? 38000000 : c === 'Home' ? 28000000 : c === 'Sports' ? 18000000 : c === 'Beauty' ? 15000000 : 12000000,
    units_sold: c === 'Electronics' ? 185000 : c === 'Fashion' ? 420000 : c === 'Home' ? 210000 : c === 'Sports' ? 150000 : c === 'Beauty' ? 280000 : 190000,
    gross_margin_pct: c === 'Electronics' ? 0.18 : c === 'Fashion' ? 0.45 : c === 'Home' ? 0.38 : c === 'Sports' ? 0.42 : c === 'Beauty' ? 0.52 : 0.48,
    revenue_leakage: c === 'Electronics' ? 480000 : c === 'Fashion' ? 320000 : c === 'Home' ? 210000 : c === 'Sports' ? 95000 : c === 'Beauty' ? 65000 : 42000,
  })),
  channelMetrics: CHANNELS.map(ch => ({
    channel: ch,
    revenue_pct: ch === 'STORE' ? 0.52 : ch === 'WEB' ? 0.32 : 0.16,
    transactions: ch === 'STORE' ? 2800000 : ch === 'WEB' ? 1500000 : 800000,
    avg_basket: ch === 'STORE' ? 145 : ch === 'WEB' ? 178 : 125,
    conversion_rate: ch === 'STORE' ? 0.28 : ch === 'WEB' ? 0.034 : 0.048,
  })),
  supplierPerf: SUPPLIERS.map((s, i) => ({
    supplier: s,
    avg_lead_time: [28, 14, 32, 12, 8, 35, 42][i],
    lead_time_trend: [4.2, -0.5, 1.2, -0.3, 0.1, 3.8, 5.1][i],
    stockouts: [12, 1, 4, 0, 1, 9, 6][i],
    revenue_impact: [420000, 12000, 85000, 0, 5000, 340000, 180000][i],
    fill_rate: [0.88, 0.97, 0.92, 0.99, 0.98, 0.86, 0.84][i],
  })),
  aisleMetrics: AISLES.map((a, i) => ({
    aisle: a,
    foot_traffic: [4200, 3800, 2100, 1600, 3500, 890, 4800, 2900, 1200, 3200][i],
    conversion_rate: [0.12, 0.10, 0.08, 0.14, 0.09, 0.04, 0.15, 0.11, 0.03, 0.07][i],
    revenue_per_sqft: [680, 520, 380, 720, 450, 180, 810, 490, 120, 340][i],
  })),
  campaignROAS: MKT_CHANNELS.map((ch, i) => ({
    channel: ch,
    roas: [4.5, 3.8, 2.9, 2.1, 3.4, 3.2][i],
    spend: [280000, 120000, 450000, 380000, 520000, 95000][i],
    conversions: [12600, 4560, 13050, 7980, 17680, 3040][i],
    cac: [22, 26, 34, 48, 29, 31][i],
  })),
  loyaltyTiers: TIERS.map(t => ({
    tier: t,
    customer_count: t === 'PLATINUM' ? 15000 : t === 'GOLD' ? 45000 : t === 'SILVER' ? 115000 : t === 'BRONZE' ? 125000 : 200000,
    avg_clv: t === 'PLATINUM' ? 16800 : t === 'GOLD' ? 9200 : t === 'SILVER' ? 4800 : t === 'BRONZE' ? 2400 : 1100,
    retention_rate: t === 'PLATINUM' ? 0.95 : t === 'GOLD' ? 0.88 : t === 'SILVER' ? 0.75 : t === 'BRONZE' ? 0.62 : 0.45,
    avg_basket: t === 'PLATINUM' ? 380 : t === 'GOLD' ? 245 : t === 'SILVER' ? 155 : t === 'BRONZE' ? 95 : 65,
  })),
  audienceMetrics: AUDIENCES.map((a, i) => ({
    audience: a,
    roas: [4.5, 3.2, 2.8, 3.6, 1.9][i],
    attributed_revenue: [2800000, 1200000, 980000, 1500000, 850000][i],
    campaign_lift: [0.22, 0.18, 0.31, 0.25, 0.08][i],
  })),
}

// Keyword matching to route questions to the right data
type MatchRule = { keywords: string[]; handler: () => { sql: string; result: string; rows?: Record<string, unknown>[] } }

function matchQuestion(question: string, sv: string): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const q = question.toLowerCase()

  const rules: MatchRule[] = [
    // CLV
    { keywords: ['clv', 'lifetime value', 'valor de vida', 'valor del cliente'],
      handler: () => {
        if (q.includes('region') || q.includes('región')) return regionResult('avg_clv')
        if (q.includes('segmento') || q.includes('segment')) return segmentResult('avg_clv')
        if (q.includes('tier') || q.includes('fidelidad') || q.includes('loyalty')) return tierResult('avg_clv')
        return regionResult('avg_clv')
      }
    },
    // Churn
    { keywords: ['churn', 'fuga', 'abandono', 'pérdida', 'retención', 'retention'],
      handler: () => {
        if (q.includes('region') || q.includes('región') || q.includes('sur')) return regionResult('avg_churn_rate')
        if (q.includes('segmento') || q.includes('segment')) return segmentResult('avg_churn')
        return regionResult('avg_churn_rate')
      }
    },
    // NPS
    { keywords: ['nps', 'promotor', 'satisfacción', 'satisfaccion'],
      handler: () => regionResult('avg_nps')
    },
    // Revenue / Ventas
    { keywords: ['revenue', 'ingreso', 'venta', 'ventas', 'facturación', 'facturacion'],
      handler: () => {
        if (q.includes('categoría') || q.includes('categoria') || q.includes('category')) return categoryResult('revenue_net')
        if (q.includes('canal') || q.includes('channel')) return channelResult('revenue_pct')
        return categoryResult('revenue_net')
      }
    },
    // Margin
    { keywords: ['margen', 'margin', 'rentabilidad', 'utilidad'],
      handler: () => categoryResult('gross_margin_pct')
    },
    // Leakage / Fuga de ingresos
    { keywords: ['leakage', 'fuga de ingreso', 'pérdida de ingreso', 'pricing error'],
      handler: () => categoryResult('revenue_leakage')
    },
    // Units / Unidades
    { keywords: ['unidades', 'units', 'cantidad', 'volumen'],
      handler: () => categoryResult('units_sold')
    },
    // Basket / Canasta
    { keywords: ['basket', 'canasta', 'ticket', 'promedio de compra'],
      handler: () => {
        if (q.includes('canal') || q.includes('channel')) return channelResult('avg_basket')
        if (q.includes('segmento') || q.includes('segment')) return segmentResult('avg_basket')
        return segmentResult('avg_basket')
      }
    },
    // Supplier / Proveedor
    { keywords: ['proveedor', 'supplier', 'lead time', 'retraso', 'stockout', 'quiebre'],
      handler: () => supplierResult()
    },
    // Planogram / Pasillo / Aisle
    { keywords: ['pasillo', 'aisle', 'planograma', 'planogram', 'tráfico', 'traffic', 'conversión de pasillo'],
      handler: () => aisleResult()
    },
    // ROAS / Campaigns
    { keywords: ['roas', 'retorno', 'campaña', 'campaign', 'marketing', 'atribución', 'attribution'],
      handler: () => {
        if (q.includes('audiencia') || q.includes('audience') || q.includes('loyalty') || q.includes('fidelidad')) return audienceResult()
        return campaignResult()
      }
    },
    // CAC
    { keywords: ['cac', 'adquisición', 'acquisition cost', 'costo de adquisición'],
      handler: () => campaignResult()
    },
    // Channel / Canal
    { keywords: ['canal', 'channel', 'omnicanal', 'tienda', 'web', 'app'],
      handler: () => channelResult('avg_basket')
    },
    // Loyalty / Fidelidad / Tier
    { keywords: ['tier', 'fidelidad', 'loyalty', 'platinum', 'gold', 'silver'],
      handler: () => tierResult('avg_clv')
    },
    // Customers count
    { keywords: ['cuántos clientes', 'cuantos clientes', 'total clientes', 'número de clientes', 'customer count', 'how many customers'],
      handler: () => {
        if (q.includes('region') || q.includes('región')) return regionResult('customer_count')
        if (q.includes('segmento') || q.includes('segment')) return segmentResult('customer_count')
        return regionResult('customer_count')
      }
    },
    // Cross-sell
    { keywords: ['cross-sell', 'cross sell', 'venta cruzada'],
      handler: () => segmentResult('avg_basket')
    },
    // Conversion
    { keywords: ['conversión', 'conversion', 'tasa de conversión'],
      handler: () => {
        if (q.includes('pasillo') || q.includes('aisle')) return aisleResult()
        return channelResult('conversion_rate')
      }
    },
  ]

  // Find first matching rule
  for (const rule of rules) {
    if (rule.keywords.some(kw => q.includes(kw))) {
      return rule.handler()
    }
  }

  // Default: return based on semantic view context
  const svDefaults: Record<string, () => { sql: string; result: string; rows?: Record<string, unknown>[] }> = {
    'SV_CUSTOMER_INTELLIGENCE': () => regionResult('avg_clv'),
    'SV_OMNICHANNEL_OPS': () => aisleResult(),
    'SV_COMMERCE_REVENUE': () => categoryResult('revenue_net'),
    'SV_SUPPLY_CHAIN': () => supplierResult(),
    'SV_MARKETING_GROWTH': () => campaignResult(),
  }

  return (svDefaults[sv] || svDefaults['SV_CUSTOMER_INTELLIGENCE'])()
}

function regionResult(metric: string): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.regionMetrics
  const metricLabel = metric === 'avg_clv' ? 'CLV promedio' : metric === 'avg_churn_rate' ? 'tasa de churn' : metric === 'customer_count' ? 'cantidad de clientes' : metric === 'avg_nps' ? 'NPS promedio' : metric
  const lines = rows.map(r => {
    const val = r[metric as keyof typeof r]
    const formatted = metric.includes('rate') || metric.includes('change') ? `${((val as number) * 100).toFixed(1)}%` :
      metric.includes('count') ? (val as number).toLocaleString('es-CL') :
      metric.includes('clv') ? `$${(val as number).toLocaleString('es-CL')}` : String(val)
    return `• **${r.region}** → ${metricLabel}: ${formatted}`
  })
  return {
    sql: `SELECT region, ${metric === 'avg_clv' ? 'AVG(clv)' : metric === 'avg_churn_rate' ? 'AVG(churn_rate)' : metric === 'customer_count' ? 'COUNT(customer_id)' : `AVG(${metric.replace('avg_', '')})`} AS ${metric}\nFROM SNOWRETAIL.GOLD.CUSTOMER_360\nGROUP BY region\nORDER BY ${metric} DESC`,
    result: `Resultados por región (${metricLabel}):\n\n${lines.join('\n')}`,
    rows: rows as unknown as Record<string, unknown>[],
  }
}

function segmentResult(metric: string): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.segmentMetrics
  const metricLabel = metric === 'avg_clv' ? 'CLV promedio' : metric === 'customer_count' ? 'clientes' : metric === 'avg_churn' ? 'churn promedio' : metric === 'avg_basket' ? 'canasta promedio' : metric
  const lines = rows.map(r => {
    const val = r[metric as keyof typeof r]
    const formatted = metric.includes('churn') ? `${((val as number) * 100).toFixed(1)}%` :
      metric.includes('count') ? (val as number).toLocaleString('es-CL') :
      `$${(val as number).toLocaleString('es-CL')}`
    return `• **${r.segment}** → ${metricLabel}: ${formatted}`
  })
  return {
    sql: `SELECT segment, ${metric === 'avg_clv' ? 'AVG(clv)' : metric === 'customer_count' ? 'COUNT(*)' : `AVG(${metric.replace('avg_', '')})`} AS ${metric}\nFROM SNOWRETAIL.GOLD.CUSTOMER_360\nGROUP BY segment\nORDER BY ${metric} DESC`,
    result: `Resultados por segmento (${metricLabel}):\n\n${lines.join('\n')}`,
    rows: rows as unknown as Record<string, unknown>[],
  }
}

function tierResult(_metric: string): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.loyaltyTiers
  const lines = rows.map(r => `• **${r.tier}** → CLV: $${r.avg_clv.toLocaleString('es-CL')} · clientes: ${r.customer_count.toLocaleString('es-CL')} · retención: ${(r.retention_rate * 100).toFixed(0)}% · canasta: $${r.avg_basket}`)
  return {
    sql: `SELECT loyalty_tier, AVG(clv) AS avg_clv, COUNT(*) AS customers,\n  AVG(avg_basket_size) AS avg_basket\nFROM SNOWRETAIL.GOLD.CUSTOMER_360\nGROUP BY loyalty_tier\nORDER BY avg_clv DESC`,
    result: `Resultados por tier de fidelidad:\n\n${lines.join('\n')}\n\nLos clientes Platinum generan 15x más valor que los sin programa.`,
    rows: rows as unknown as Record<string, unknown>[],
  }
}

function categoryResult(metric: string): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.categoryRevenue
  const metricLabel = metric === 'revenue_net' ? 'ingreso neto' : metric === 'units_sold' ? 'unidades' : metric === 'gross_margin_pct' ? 'margen bruto' : metric === 'revenue_leakage' ? 'fuga de ingreso' : metric
  const lines = rows.map(r => {
    const val = r[metric as keyof typeof r]
    const formatted = metric.includes('margin') ? `${((val as number) * 100).toFixed(0)}%` :
      `$${(val as number).toLocaleString('es-CL')}`
    return `• **${r.category}** → ${metricLabel}: ${formatted}`
  })
  return {
    sql: `SELECT category, ${metric === 'revenue_net' ? 'SUM(revenue_net)' : metric === 'units_sold' ? 'SUM(units_sold)' : metric === 'gross_margin_pct' ? 'AVG(gross_margin/revenue_net)' : `SUM(${metric})`} AS ${metric}\nFROM SNOWRETAIL.GOLD.SALES_DAILY\nGROUP BY category\nORDER BY ${metric} DESC`,
    result: `Resultados por categoría (${metricLabel}):\n\n${lines.join('\n')}`,
    rows: rows as unknown as Record<string, unknown>[],
  }
}

function channelResult(_metric: string): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.channelMetrics
  const lines = rows.map(r => `• **${r.channel}** → participación: ${(r.revenue_pct * 100).toFixed(0)}% · transacciones: ${r.transactions.toLocaleString('es-CL')} · canasta promedio: $${r.avg_basket} · conversión: ${(r.conversion_rate * 100).toFixed(1)}%`)
  return {
    sql: `SELECT channel, SUM(revenue_net)/SUM(SUM(revenue_net)) OVER() AS pct,\n  SUM(transactions), AVG(basket_size_avg)\nFROM SNOWRETAIL.GOLD.SALES_DAILY\nGROUP BY channel`,
    result: `Resultados por canal:\n\n${lines.join('\n')}\n\nTienda física sigue liderando (52%) pero Web crece al doble de velocidad interanual.`,
    rows: rows as unknown as Record<string, unknown>[],
  }
}

function supplierResult(): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.supplierPerf.filter(s => s.lead_time_trend > 1)
  const lines = rows.map(r => `• **${r.supplier}** → lead time: ${r.avg_lead_time} días (trend +${r.lead_time_trend} días) · quiebres: ${r.stockouts} · impacto: $${r.revenue_impact.toLocaleString('es-CL')} · fill rate: ${(r.fill_rate * 100).toFixed(0)}%`)
  const totalImpact = rows.reduce((s, r) => s + r.revenue_impact, 0)
  return {
    sql: `SELECT supplier_name, avg_lead_time_days, lead_time_trend_30d,\n  stockout_events_caused, revenue_impact, fill_rate\nFROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE\nWHERE lead_time_trend_30d > 1\nORDER BY revenue_impact DESC`,
    result: `Proveedores con tendencia de retraso (>1 día en últimos 30d):\n\n${lines.join('\n')}\n\nImpacto total en riesgo: $${totalImpact.toLocaleString('es-CL')}. Se recomienda activar cláusula de penalización para GlobalTech y explorar proveedores alternativos para TechDirect.`,
    rows: rows as unknown as Record<string, unknown>[],
  }
}

function aisleResult(): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.aisleMetrics
  const sorted = [...rows].sort((a, b) => a.conversion_rate - b.conversion_rate)
  const lines = sorted.slice(0, 5).map(r => `• **${r.aisle}** → tráfico: ${r.foot_traffic.toLocaleString('es-CL')} visitantes/semana · conversión: ${(r.conversion_rate * 100).toFixed(1)}% · revenue/m²: $${r.revenue_per_sqft}`)
  return {
    sql: `SELECT aisle, AVG(foot_traffic) AS traffic,\n  AVG(conversion_rate) AS conversion, AVG(revenue_per_sqft)\nFROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT\nGROUP BY aisle\nORDER BY conversion ASC`,
    result: `Pasillos con menor conversión (oportunidad de reconfiguración):\n\n${lines.join('\n')}\n\nAisle 9 y Aisle 6 son candidatos prioritarios para reconfiguraci\u00f3n de planograma — alto tráfico potencial pero conversión bajo 5%.`,
    rows: sorted as unknown as Record<string, unknown>[],
  }
}

function campaignResult(): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.campaignROAS
  const lines = rows.map(r => `• **${r.channel}** → ROAS: ${r.roas}x · spend: $${r.spend.toLocaleString('es-CL')} · conversiones: ${r.conversions.toLocaleString('es-CL')} · CAC: $${r.cac}`)
  return {
    sql: `SELECT channel, AVG(roas), SUM(total_spend),\n  SUM(conversions), AVG(cac)\nFROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE\nGROUP BY channel\nORDER BY roas DESC`,
    result: `Performance por canal de marketing:\n\n${lines.join('\n')}\n\nEMAIL lidera en ROAS (4.5x) con el menor CAC ($22). DISPLAY tiene el CAC más alto ($48) — considerar reasignar presupuesto.`,
    rows: rows as unknown as Record<string, unknown>[],
  }
}

function audienceResult(): { sql: string; result: string; rows?: Record<string, unknown>[] } {
  const rows = DATA.audienceMetrics
  const lines = rows.map(r => `• **${r.audience}** → ROAS: ${r.roas}x · revenue atribuido: $${r.attributed_revenue.toLocaleString('es-CL')} · lift: +${(r.campaign_lift * 100).toFixed(0)}%`)
  return {
    sql: `SELECT audience_segment, AVG(roas),\n  SUM(attributed_revenue), AVG(campaign_lift)\nFROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE\nGROUP BY audience_segment\nORDER BY roas DESC`,
    result: `Performance por audiencia:\n\n${lines.join('\n')}\n\nLOYALTY_MEMBERS genera el mejor ROAS (4.5x). NEW tiene el mayor lift incremental (+31%) indicando alta eficiencia en adquisición.`,
    rows: rows as unknown as Record<string, unknown>[],
  }
}

export function generateSmartResponse(question: string, semanticView: string): AnalystResponse {
  const { sql, result, rows } = matchQuestion(question, semanticView)
  return {
    query: question,
    semanticView,
    generatedSQL: sql,
    result,
    resultRows: rows,
    isLive: false,
  }
}
