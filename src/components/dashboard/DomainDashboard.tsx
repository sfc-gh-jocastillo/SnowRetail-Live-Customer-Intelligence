import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { ChartCard } from './ChartCard'
import { useSnowflakeQuery, useSnowflakeKPI } from '../../hooks/useSnowflakeQuery'
import type { DashboardConfig } from '../../lib/dashboardQueries'

interface DomainDashboardProps {
  config: DashboardConfig
}

export function DomainDashboard({ config }: DomainDashboardProps) {
  const { rows, loading, isLive, refresh } = useSnowflakeQuery(config.mainSQL, config.fallbackRows)

  // Derive chart data from main query rows (or use per-chart queries when needed)
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          {isLive ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/30">
              <Wifi size={10} /> En vivo desde Snowflake
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-navy-800 text-slate-500 border border-navy-700">
              <WifiOff size={10} /> Datos sintéticos
            </span>
          )}
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] text-slate-400 hover:text-sf-blue hover:bg-navy-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {config.kpis.map(kpi => (
          <KPICardWrapper key={kpi.label} kpi={kpi} parentIsLive={isLive} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-3">
        {config.charts.map(chart => (
          <ChartCardWrapper key={chart.id} chart={chart} mainRows={rows} loading={loading} />
        ))}
      </div>
    </section>
  )
}

// Wrapper that uses the KPI hook for each metric
function KPICardWrapper({ kpi, parentIsLive }: { kpi: DashboardConfig['kpis'][0]; parentIsLive: boolean }) {
  const { value, loading, isLive } = useSnowflakeKPI(kpi.sql, kpi.fallbackValue)
  return (
    <MetricCard
      label={kpi.label}
      value={value}
      format={kpi.format}
      loading={loading}
      isLive={isLive || parentIsLive}
    />
  )
}

// Chart wrapper — uses fallback data matching the chart config
function ChartCardWrapper({ chart, mainRows, loading }: {
  chart: DashboardConfig['charts'][0]
  mainRows: Record<string, unknown>[]
  loading: boolean
}) {
  // Use mainRows if they have the right keys, otherwise use domain fallback
  const hasKeys = mainRows.length > 0 && chart.labelKey in (mainRows[0] || {})
  const data = hasKeys ? mainRows : getFallbackChartData(chart)

  return (
    <ChartCard
      title={chart.title}
      type={chart.type}
      data={data}
      labelKey={chart.labelKey}
      valueKey={chart.valueKey}
      secondaryKey={chart.secondaryKey}
      color={chart.color}
      loading={loading}
    />
  )
}

// Per-chart fallback when mainRows don't contain the right columns
function getFallbackChartData(chart: DashboardConfig['charts'][0]): Record<string, unknown>[] {
  // These are derived from the synthetic engine data
  const chartFallbacks: Record<string, Record<string, unknown>[]> = {
    clv_segment: [
      { SEGMENT: 'VIP', AVG_CLV: 14200 },
      { SEGMENT: 'PREMIUM', AVG_CLV: 8400 },
      { SEGMENT: 'REGULAR', AVG_CLV: 3200 },
      { SEGMENT: 'NEW', AVG_CLV: 1800 },
      { SEGMENT: 'LAPSED', AVG_CLV: 950 },
    ],
    churn_region: [
      { REGION: 'Sur', AVG_CHURN: 0.115 },
      { REGION: 'Norte', AVG_CHURN: 0.092 },
      { REGION: 'Biobio', AVG_CHURN: 0.088 },
      { REGION: 'Metropolitana', AVG_CHURN: 0.085 },
      { REGION: 'Valparaiso', AVG_CHURN: 0.082 },
      { REGION: 'Austral', AVG_CHURN: 0.079 },
    ],
    tier_dist: [
      { LOYALTY_TIER: 'NONE', CUSTOMERS: 200000 },
      { LOYALTY_TIER: 'BRONZE', CUSTOMERS: 125000 },
      { LOYALTY_TIER: 'SILVER', CUSTOMERS: 115000 },
      { LOYALTY_TIER: 'GOLD', CUSTOMERS: 45000 },
      { LOYALTY_TIER: 'PLATINUM', CUSTOMERS: 15000 },
    ],
    conv_aisle: [
      { AISLE: 'Aisle 7', CONVERSION: 0.15 },
      { AISLE: 'Aisle 4', CONVERSION: 0.14 },
      { AISLE: 'Aisle 1', CONVERSION: 0.12 },
      { AISLE: 'Aisle 8', CONVERSION: 0.11 },
      { AISLE: 'Aisle 2', CONVERSION: 0.10 },
    ],
    traffic_aisle: [
      { AISLE: 'Aisle 7', TRAFFIC: 4800 },
      { AISLE: 'Aisle 1', TRAFFIC: 4200 },
      { AISLE: 'Aisle 2', TRAFFIC: 3800 },
      { AISLE: 'Aisle 5', TRAFFIC: 3500 },
      { AISLE: 'Aisle 10', TRAFFIC: 3200 },
    ],
    channel_rev: [
      { CHANNEL: 'STORE', REVENUE: 79560000 },
      { CHANNEL: 'WEB', REVENUE: 48960000 },
      { CHANNEL: 'APP', REVENUE: 24480000 },
    ],
    rev_category: [
      { CATEGORY: 'Electronics', REVENUE: 42000000 },
      { CATEGORY: 'Fashion', REVENUE: 38000000 },
      { CATEGORY: 'Home', REVENUE: 28000000 },
      { CATEGORY: 'Sports', REVENUE: 18000000 },
      { CATEGORY: 'Beauty', REVENUE: 15000000 },
      { CATEGORY: 'Kids', REVENUE: 12000000 },
    ],
    margin_category: [
      { CATEGORY: 'Beauty', MARGIN: 0.52 },
      { CATEGORY: 'Kids', MARGIN: 0.48 },
      { CATEGORY: 'Fashion', MARGIN: 0.45 },
      { CATEGORY: 'Sports', MARGIN: 0.42 },
      { CATEGORY: 'Home', MARGIN: 0.38 },
      { CATEGORY: 'Electronics', MARGIN: 0.18 },
    ],
    channel_split: [
      { CHANNEL: 'STORE', REVENUE: 79560000 },
      { CHANNEL: 'WEB', REVENUE: 48960000 },
      { CHANNEL: 'APP', REVENUE: 24480000 },
    ],
    lead_supplier: [
      { SUPPLIER_NAME: 'TechDirect Korea', LEAD_TIME: 42 },
      { SUPPLIER_NAME: 'ElectroAsia Trading', LEAD_TIME: 35 },
      { SUPPLIER_NAME: 'Pacific Home Imports', LEAD_TIME: 32 },
      { SUPPLIER_NAME: 'GlobalTech Supply Co', LEAD_TIME: 28 },
      { SUPPLIER_NAME: 'Andina Fashion Group', LEAD_TIME: 14 },
    ],
    fill_rate: [
      { SUPPLIER_NAME: 'TechDirect Korea', FILL_RATE: 0.84 },
      { SUPPLIER_NAME: 'ElectroAsia Trading', FILL_RATE: 0.86 },
      { SUPPLIER_NAME: 'GlobalTech Supply Co', FILL_RATE: 0.88 },
      { SUPPLIER_NAME: 'Pacific Home Imports', FILL_RATE: 0.92 },
      { SUPPLIER_NAME: 'Andina Fashion Group', FILL_RATE: 0.97 },
    ],
    impact_supplier: [
      { SUPPLIER_NAME: 'GlobalTech Supply Co', REVENUE_IMPACT: 420000 },
      { SUPPLIER_NAME: 'ElectroAsia Trading', REVENUE_IMPACT: 340000 },
      { SUPPLIER_NAME: 'TechDirect Korea', REVENUE_IMPACT: 180000 },
      { SUPPLIER_NAME: 'Pacific Home Imports', REVENUE_IMPACT: 85000 },
    ],
    roas_channel: [
      { CHANNEL: 'EMAIL', AVG_ROAS: 4.5 },
      { CHANNEL: 'PUSH', AVG_ROAS: 3.8 },
      { CHANNEL: 'SEARCH', AVG_ROAS: 3.4 },
      { CHANNEL: 'SMS', AVG_ROAS: 3.2 },
      { CHANNEL: 'SOCIAL', AVG_ROAS: 2.9 },
      { CHANNEL: 'DISPLAY', AVG_ROAS: 2.1 },
    ],
    spend_channel: [
      { CHANNEL: 'SEARCH', SPEND: 520000, REVENUE: 1768000 },
      { CHANNEL: 'SOCIAL', SPEND: 450000, REVENUE: 1305000 },
      { CHANNEL: 'DISPLAY', SPEND: 380000, REVENUE: 798000 },
      { CHANNEL: 'EMAIL', SPEND: 280000, REVENUE: 1260000 },
      { CHANNEL: 'PUSH', SPEND: 120000, REVENUE: 456000 },
      { CHANNEL: 'SMS', SPEND: 95000, REVENUE: 304000 },
    ],
    audience_perf: [
      { AUDIENCE_SEGMENT: 'LOYALTY_MEMBERS', REVENUE: 2800000 },
      { AUDIENCE_SEGMENT: 'LOOKALIKE', REVENUE: 1500000 },
      { AUDIENCE_SEGMENT: 'LAPSED', REVENUE: 1200000 },
      { AUDIENCE_SEGMENT: 'NEW', REVENUE: 980000 },
      { AUDIENCE_SEGMENT: 'BROAD', REVENUE: 850000 },
    ],
  }
  return chartFallbacks[chart.id] || []
}
