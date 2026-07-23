// SQL queries and synthetic fallback data for each domain dashboard
// When connected to Snowflake, the SQL is executed live.
// When offline, getDashboardData() returns the same structure.

export interface DashboardConfig {
  kpis: { label: string; sql: string; fallbackValue: number | string; format: 'number' | 'currency' | 'percent' | 'decimal' }[]
  charts: {
    id: string
    title: string
    type: 'bar' | 'pie' | 'horizontal_bar'
    sql: string
    labelKey: string
    valueKey: string
    secondaryKey?: string
    color?: string
  }[]
  mainSQL: string
  fallbackRows: Record<string, unknown>[]
}

const COLORS = {
  blue: '#29B5E8',
  gold: '#F5A623',
  green: '#4ADE80',
  red: '#F87171',
  purple: '#A78BFA',
  cyan: '#22D3EE',
}

export const DOMAIN_DASHBOARDS: Record<string, DashboardConfig> = {
  cic: {
    kpis: [
      { label: 'Clientes Totales', sql: "SELECT COUNT(*) AS val FROM SNOWRETAIL.GOLD.CUSTOMER_360", fallbackValue: 500000, format: 'number' },
      { label: 'CLV Promedio', sql: "SELECT ROUND(AVG(CLV),0) AS val FROM SNOWRETAIL.GOLD.CUSTOMER_360", fallbackValue: 5840, format: 'currency' },
      { label: 'Churn Promedio', sql: "SELECT ROUND(AVG(CHURN_PROBABILITY),3) AS val FROM SNOWRETAIL.GOLD.CUSTOMER_360", fallbackValue: 0.092, format: 'percent' },
      { label: 'NPS Promedio', sql: "SELECT ROUND(AVG(NPS_SCORE),0) AS val FROM SNOWRETAIL.GOLD.CUSTOMER_360", fallbackValue: 47, format: 'number' },
    ],
    charts: [
      { id: 'clv_segment', title: 'CLV Promedio por Segmento', type: 'bar', sql: "SELECT SEGMENT, ROUND(AVG(CLV),0) AS AVG_CLV FROM SNOWRETAIL.GOLD.CUSTOMER_360 GROUP BY SEGMENT ORDER BY AVG_CLV DESC", labelKey: 'SEGMENT', valueKey: 'AVG_CLV', color: COLORS.blue },
      { id: 'churn_region', title: 'Churn por Región', type: 'bar', sql: "SELECT REGION, ROUND(AVG(CHURN_PROBABILITY),3) AS AVG_CHURN FROM SNOWRETAIL.GOLD.CUSTOMER_360 GROUP BY REGION ORDER BY AVG_CHURN DESC", labelKey: 'REGION', valueKey: 'AVG_CHURN', color: COLORS.red },
      { id: 'tier_dist', title: 'Distribución por Tier', type: 'pie', sql: "SELECT LOYALTY_TIER, COUNT(*) AS CUSTOMERS FROM SNOWRETAIL.GOLD.CUSTOMER_360 GROUP BY LOYALTY_TIER ORDER BY CUSTOMERS DESC", labelKey: 'LOYALTY_TIER', valueKey: 'CUSTOMERS' },
    ],
    mainSQL: "SELECT SEGMENT, COUNT(*) AS CUSTOMERS, ROUND(AVG(CLV),0) AS AVG_CLV, ROUND(AVG(CHURN_PROBABILITY),3) AS AVG_CHURN, ROUND(AVG(NPS_SCORE),0) AS AVG_NPS FROM SNOWRETAIL.GOLD.CUSTOMER_360 GROUP BY SEGMENT ORDER BY AVG_CLV DESC",
    fallbackRows: [
      { SEGMENT: 'VIP', CUSTOMERS: 25000, AVG_CLV: 14200, AVG_CHURN: 0.05, AVG_NPS: 68 },
      { SEGMENT: 'PREMIUM', CUSTOMERS: 75000, AVG_CLV: 8400, AVG_CHURN: 0.08, AVG_NPS: 55 },
      { SEGMENT: 'REGULAR', CUSTOMERS: 250000, AVG_CLV: 3200, AVG_CHURN: 0.12, AVG_NPS: 45 },
      { SEGMENT: 'NEW', CUSTOMERS: 75000, AVG_CLV: 1800, AVG_CHURN: 0.15, AVG_NPS: 52 },
      { SEGMENT: 'LAPSED', CUSTOMERS: 75000, AVG_CLV: 950, AVG_CHURN: 0.35, AVG_NPS: 22 },
    ],
  },
  omn: {
    kpis: [
      { label: 'Tiendas', sql: "SELECT COUNT(DISTINCT STORE_ID) AS val FROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT", fallbackValue: 50, format: 'number' },
      { label: 'Conversión Promedio', sql: "SELECT ROUND(AVG(CONVERSION_RATE),4) AS val FROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT", fallbackValue: 0.093, format: 'percent' },
      { label: 'Revenue/m² Promedio', sql: "SELECT ROUND(AVG(REVENUE_PER_SQFT),0) AS val FROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT", fallbackValue: 469, format: 'currency' },
      { label: 'Tráfico Semanal', sql: "SELECT ROUND(AVG(FOOT_TRAFFIC),0) AS val FROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT", fallbackValue: 2920, format: 'number' },
    ],
    charts: [
      { id: 'conv_aisle', title: 'Conversión por Pasillo', type: 'bar', sql: "SELECT AISLE, ROUND(AVG(CONVERSION_RATE),4) AS CONVERSION FROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT GROUP BY AISLE ORDER BY CONVERSION DESC", labelKey: 'AISLE', valueKey: 'CONVERSION', color: COLORS.green },
      { id: 'traffic_aisle', title: 'Tráfico por Pasillo', type: 'bar', sql: "SELECT AISLE, ROUND(AVG(FOOT_TRAFFIC),0) AS TRAFFIC FROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT GROUP BY AISLE ORDER BY TRAFFIC DESC", labelKey: 'AISLE', valueKey: 'TRAFFIC', color: COLORS.blue },
      { id: 'channel_rev', title: 'Revenue por Canal', type: 'pie', sql: "SELECT CHANNEL, ROUND(SUM(REVENUE_NET),0) AS REVENUE FROM SNOWRETAIL.GOLD.SALES_DAILY GROUP BY CHANNEL ORDER BY REVENUE DESC", labelKey: 'CHANNEL', valueKey: 'REVENUE' },
    ],
    mainSQL: "SELECT AISLE, ROUND(AVG(FOOT_TRAFFIC),0) AS TRAFFIC, ROUND(AVG(CONVERSION_RATE),4) AS CONVERSION, ROUND(AVG(REVENUE_PER_SQFT),0) AS REV_SQFT FROM SNOWRETAIL.GOLD.PLANOGRAM_CURRENT GROUP BY AISLE ORDER BY CONVERSION DESC",
    fallbackRows: [
      { AISLE: 'Aisle 7', TRAFFIC: 4800, CONVERSION: 0.15, REV_SQFT: 810 },
      { AISLE: 'Aisle 4', TRAFFIC: 1600, CONVERSION: 0.14, REV_SQFT: 720 },
      { AISLE: 'Aisle 1', TRAFFIC: 4200, CONVERSION: 0.12, REV_SQFT: 680 },
      { AISLE: 'Aisle 8', TRAFFIC: 2900, CONVERSION: 0.11, REV_SQFT: 490 },
      { AISLE: 'Aisle 2', TRAFFIC: 3800, CONVERSION: 0.10, REV_SQFT: 520 },
      { AISLE: 'Aisle 5', TRAFFIC: 3500, CONVERSION: 0.09, REV_SQFT: 450 },
      { AISLE: 'Aisle 3', TRAFFIC: 2100, CONVERSION: 0.08, REV_SQFT: 380 },
      { AISLE: 'Aisle 10', TRAFFIC: 3200, CONVERSION: 0.07, REV_SQFT: 340 },
      { AISLE: 'Aisle 6', TRAFFIC: 890, CONVERSION: 0.04, REV_SQFT: 180 },
      { AISLE: 'Aisle 9', TRAFFIC: 1200, CONVERSION: 0.03, REV_SQFT: 120 },
    ],
  },
  com: {
    kpis: [
      { label: 'Revenue Total', sql: "SELECT ROUND(SUM(REVENUE_NET),0) AS val FROM SNOWRETAIL.GOLD.SALES_DAILY", fallbackValue: 153000000, format: 'currency' },
      { label: 'Margen Bruto', sql: "SELECT ROUND(AVG(GROSS_MARGIN/NULLIF(REVENUE_NET,0)),3) AS val FROM SNOWRETAIL.GOLD.SALES_DAILY WHERE REVENUE_NET > 0", fallbackValue: 0.38, format: 'percent' },
      { label: 'Fuga de Ingreso', sql: "SELECT ROUND(SUM(REVENUE_LEAKAGE),0) AS val FROM SNOWRETAIL.GOLD.SALES_DAILY", fallbackValue: 1212000, format: 'currency' },
      { label: 'Transacciones', sql: "SELECT SUM(TRANSACTIONS) AS val FROM SNOWRETAIL.GOLD.SALES_DAILY", fallbackValue: 5100000, format: 'number' },
    ],
    charts: [
      { id: 'rev_category', title: 'Revenue por Categoría', type: 'bar', sql: "SELECT CATEGORY, ROUND(SUM(REVENUE_NET),0) AS REVENUE FROM SNOWRETAIL.GOLD.SALES_DAILY GROUP BY CATEGORY ORDER BY REVENUE DESC", labelKey: 'CATEGORY', valueKey: 'REVENUE', color: COLORS.green },
      { id: 'margin_category', title: 'Margen Bruto por Categoría', type: 'bar', sql: "SELECT CATEGORY, ROUND(AVG(GROSS_MARGIN/NULLIF(REVENUE_NET,0)),3) AS MARGIN FROM SNOWRETAIL.GOLD.SALES_DAILY WHERE REVENUE_NET > 0 GROUP BY CATEGORY ORDER BY MARGIN DESC", labelKey: 'CATEGORY', valueKey: 'MARGIN', color: COLORS.gold },
      { id: 'channel_split', title: 'Revenue por Canal', type: 'pie', sql: "SELECT CHANNEL, ROUND(SUM(REVENUE_NET),0) AS REVENUE FROM SNOWRETAIL.GOLD.SALES_DAILY GROUP BY CHANNEL ORDER BY REVENUE DESC", labelKey: 'CHANNEL', valueKey: 'REVENUE' },
    ],
    mainSQL: "SELECT CATEGORY, ROUND(SUM(REVENUE_NET),0) AS REVENUE, ROUND(AVG(GROSS_MARGIN/NULLIF(REVENUE_NET,0)),3) AS MARGIN_PCT, ROUND(SUM(REVENUE_LEAKAGE),0) AS LEAKAGE FROM SNOWRETAIL.GOLD.SALES_DAILY WHERE REVENUE_NET > 0 GROUP BY CATEGORY ORDER BY REVENUE DESC",
    fallbackRows: [
      { CATEGORY: 'Electronics', REVENUE: 42000000, MARGIN_PCT: 0.18, LEAKAGE: 480000 },
      { CATEGORY: 'Fashion', REVENUE: 38000000, MARGIN_PCT: 0.45, LEAKAGE: 320000 },
      { CATEGORY: 'Home', REVENUE: 28000000, MARGIN_PCT: 0.38, LEAKAGE: 210000 },
      { CATEGORY: 'Sports', REVENUE: 18000000, MARGIN_PCT: 0.42, LEAKAGE: 95000 },
      { CATEGORY: 'Beauty', REVENUE: 15000000, MARGIN_PCT: 0.52, LEAKAGE: 65000 },
      { CATEGORY: 'Kids', REVENUE: 12000000, MARGIN_PCT: 0.48, LEAKAGE: 42000 },
    ],
  },
  sco: {
    kpis: [
      { label: 'Lead Time Promedio', sql: "SELECT ROUND(AVG(AVG_LEAD_TIME_DAYS),1) AS val FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE", fallbackValue: 24.4, format: 'decimal' },
      { label: 'Fill Rate Promedio', sql: "SELECT ROUND(AVG(FILL_RATE),3) AS val FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE", fallbackValue: 0.92, format: 'percent' },
      { label: 'Quiebres Totales', sql: "SELECT SUM(STOCKOUT_EVENTS_CAUSED) AS val FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE", fallbackValue: 33, format: 'number' },
      { label: 'Revenue en Riesgo', sql: "SELECT ROUND(SUM(REVENUE_IMPACT),0) AS val FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE", fallbackValue: 1042000, format: 'currency' },
    ],
    charts: [
      { id: 'lead_supplier', title: 'Lead Time por Proveedor', type: 'horizontal_bar', sql: "SELECT SUPPLIER_NAME, AVG_LEAD_TIME_DAYS AS LEAD_TIME FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE ORDER BY LEAD_TIME DESC", labelKey: 'SUPPLIER_NAME', valueKey: 'LEAD_TIME', color: COLORS.red },
      { id: 'fill_rate', title: 'Fill Rate por Proveedor', type: 'horizontal_bar', sql: "SELECT SUPPLIER_NAME, FILL_RATE FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE ORDER BY FILL_RATE ASC", labelKey: 'SUPPLIER_NAME', valueKey: 'FILL_RATE', color: COLORS.green },
      { id: 'impact_supplier', title: 'Impacto en Revenue por Proveedor', type: 'bar', sql: "SELECT SUPPLIER_NAME, REVENUE_IMPACT FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE WHERE REVENUE_IMPACT > 0 ORDER BY REVENUE_IMPACT DESC", labelKey: 'SUPPLIER_NAME', valueKey: 'REVENUE_IMPACT', color: COLORS.gold },
    ],
    mainSQL: "SELECT SUPPLIER_NAME, AVG_LEAD_TIME_DAYS, FILL_RATE, STOCKOUT_EVENTS_CAUSED, REVENUE_IMPACT, RISK_SCORE FROM SNOWRETAIL.GOLD.SUPPLIER_PERFORMANCE ORDER BY RISK_SCORE DESC",
    fallbackRows: [
      { SUPPLIER_NAME: 'TechDirect Korea', AVG_LEAD_TIME_DAYS: 42, FILL_RATE: 0.84, STOCKOUT_EVENTS_CAUSED: 6, REVENUE_IMPACT: 180000, RISK_SCORE: 78 },
      { SUPPLIER_NAME: 'ElectroAsia Trading', AVG_LEAD_TIME_DAYS: 35, FILL_RATE: 0.86, STOCKOUT_EVENTS_CAUSED: 9, REVENUE_IMPACT: 340000, RISK_SCORE: 72 },
      { SUPPLIER_NAME: 'Pacific Home Imports', AVG_LEAD_TIME_DAYS: 32, FILL_RATE: 0.92, STOCKOUT_EVENTS_CAUSED: 4, REVENUE_IMPACT: 85000, RISK_SCORE: 55 },
      { SUPPLIER_NAME: 'GlobalTech Supply Co', AVG_LEAD_TIME_DAYS: 28, FILL_RATE: 0.88, STOCKOUT_EVENTS_CAUSED: 12, REVENUE_IMPACT: 420000, RISK_SCORE: 68 },
      { SUPPLIER_NAME: 'Andina Fashion Group', AVG_LEAD_TIME_DAYS: 14, FILL_RATE: 0.97, STOCKOUT_EVENTS_CAUSED: 1, REVENUE_IMPACT: 12000, RISK_SCORE: 15 },
      { SUPPLIER_NAME: 'SportsGear Chile', AVG_LEAD_TIME_DAYS: 12, FILL_RATE: 0.99, STOCKOUT_EVENTS_CAUSED: 0, REVENUE_IMPACT: 0, RISK_SCORE: 8 },
      { SUPPLIER_NAME: 'BeautyLab LATAM', AVG_LEAD_TIME_DAYS: 8, FILL_RATE: 0.98, STOCKOUT_EVENTS_CAUSED: 1, REVENUE_IMPACT: 5000, RISK_SCORE: 10 },
    ],
  },
  mkt: {
    kpis: [
      { label: 'Inversión Total', sql: "SELECT ROUND(SUM(TOTAL_SPEND),0) AS val FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE", fallbackValue: 1845000, format: 'currency' },
      { label: 'ROAS Promedio', sql: "SELECT ROUND(AVG(ROAS),2) AS val FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE", fallbackValue: 3.32, format: 'decimal' },
      { label: 'CAC Promedio', sql: "SELECT ROUND(AVG(CAC),0) AS val FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE", fallbackValue: 32, format: 'currency' },
      { label: 'Conversiones', sql: "SELECT SUM(CONVERSIONS) AS val FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE", fallbackValue: 58910, format: 'number' },
    ],
    charts: [
      { id: 'roas_channel', title: 'ROAS por Canal', type: 'bar', sql: "SELECT CHANNEL, ROUND(AVG(ROAS),2) AS AVG_ROAS FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE GROUP BY CHANNEL ORDER BY AVG_ROAS DESC", labelKey: 'CHANNEL', valueKey: 'AVG_ROAS', color: COLORS.blue },
      { id: 'spend_channel', title: 'Inversión vs Revenue Atribuido', type: 'bar', sql: "SELECT CHANNEL, ROUND(SUM(TOTAL_SPEND),0) AS SPEND, ROUND(SUM(ATTRIBUTED_REVENUE),0) AS REVENUE FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE GROUP BY CHANNEL ORDER BY REVENUE DESC", labelKey: 'CHANNEL', valueKey: 'REVENUE', secondaryKey: 'SPEND', color: COLORS.green },
      { id: 'audience_perf', title: 'Performance por Audiencia', type: 'pie', sql: "SELECT AUDIENCE_SEGMENT, ROUND(SUM(ATTRIBUTED_REVENUE),0) AS REVENUE FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE GROUP BY AUDIENCE_SEGMENT ORDER BY REVENUE DESC", labelKey: 'AUDIENCE_SEGMENT', valueKey: 'REVENUE' },
    ],
    mainSQL: "SELECT CHANNEL, ROUND(AVG(ROAS),2) AS AVG_ROAS, ROUND(SUM(TOTAL_SPEND),0) AS SPEND, ROUND(SUM(ATTRIBUTED_REVENUE),0) AS REVENUE, ROUND(AVG(CAC),0) AS AVG_CAC FROM SNOWRETAIL.GOLD.CAMPAIGN_PERFORMANCE GROUP BY CHANNEL ORDER BY AVG_ROAS DESC",
    fallbackRows: [
      { CHANNEL: 'EMAIL', AVG_ROAS: 4.5, SPEND: 280000, REVENUE: 1260000, AVG_CAC: 22 },
      { CHANNEL: 'PUSH', AVG_ROAS: 3.8, SPEND: 120000, REVENUE: 456000, AVG_CAC: 26 },
      { CHANNEL: 'SEARCH', AVG_ROAS: 3.4, SPEND: 520000, REVENUE: 1768000, AVG_CAC: 29 },
      { CHANNEL: 'SMS', AVG_ROAS: 3.2, SPEND: 95000, REVENUE: 304000, AVG_CAC: 31 },
      { CHANNEL: 'SOCIAL', AVG_ROAS: 2.9, SPEND: 450000, REVENUE: 1305000, AVG_CAC: 34 },
      { CHANNEL: 'DISPLAY', AVG_ROAS: 2.1, SPEND: 380000, REVENUE: 798000, AVG_CAC: 48 },
    ],
  },
}
