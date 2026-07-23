import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const CHART_COLORS = ['#29B5E8', '#F5A623', '#4ADE80', '#F87171', '#A78BFA', '#22D3EE']

interface ChartCardProps {
  title: string
  type: 'bar' | 'pie' | 'horizontal_bar'
  data: Record<string, unknown>[]
  labelKey: string
  valueKey: string
  secondaryKey?: string
  color?: string
  loading?: boolean
}

export function ChartCard({ title, type, data, labelKey, valueKey, secondaryKey, color, loading }: ChartCardProps) {
  if (loading) {
    return (
      <div className="bg-navy-900 border border-navy-700 rounded-xl p-4 flex items-center justify-center min-h-[220px]">
        <div className="h-5 w-5 border-2 border-sf-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const option = type === 'pie' ? buildPieOption(data, labelKey, valueKey) :
    type === 'horizontal_bar' ? buildBarOption(data, labelKey, valueKey, color, true, secondaryKey) :
    buildBarOption(data, labelKey, valueKey, color, false, secondaryKey)

  return (
    <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
      <div className="text-xs font-medium text-slate-400 mb-2">{title}</div>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height: '200px' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  )
}

function buildBarOption(data: Record<string, unknown>[], labelKey: string, valueKey: string, color?: string, horizontal?: boolean, secondaryKey?: string) {
  const labels = data.map(d => String(d[labelKey] || ''))
  const values = data.map(d => Number(d[valueKey] || 0))

  const series: Record<string, unknown>[] = [
    {
      type: 'bar',
      data: values,
      itemStyle: { color: color || CHART_COLORS[0], borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0] },
      barMaxWidth: 32,
    },
  ]

  if (secondaryKey) {
    const secondaryValues = data.map(d => Number(d[secondaryKey] || 0))
    series.push({
      type: 'bar',
      data: secondaryValues,
      itemStyle: { color: CHART_COLORS[1], borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0] },
      barMaxWidth: 32,
    })
  }

  return {
    grid: { left: horizontal ? '30%' : '8%', right: '4%', top: '8%', bottom: '20%' },
    tooltip: { trigger: 'axis' as const, backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0', fontSize: 11 } },
    [horizontal ? 'yAxis' : 'xAxis']: { type: 'category' as const, data: labels, axisLabel: { color: '#94a3b8', fontSize: 10, rotate: horizontal ? 0 : (labels.some(l => l.length > 8) ? 25 : 0) }, axisLine: { lineStyle: { color: '#334155' } }, splitLine: { show: false } },
    [horizontal ? 'xAxis' : 'yAxis']: { type: 'value' as const, axisLabel: { color: '#64748b', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series,
  }
}

function buildPieOption(data: Record<string, unknown>[], labelKey: string, valueKey: string) {
  const pieData = data.map((d, i) => ({
    name: String(d[labelKey] || ''),
    value: Number(d[valueKey] || 0),
    itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
  }))

  return {
    tooltip: { trigger: 'item' as const, backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0', fontSize: 11 } },
    legend: { bottom: 0, textStyle: { color: '#94a3b8', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      data: pieData,
      label: { show: false },
      emphasis: { label: { show: true, color: '#e2e8f0', fontSize: 11 } },
    }],
  }
}
