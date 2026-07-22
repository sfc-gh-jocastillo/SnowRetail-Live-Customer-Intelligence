import { DomainPage } from '../components/shared/DomainPage'

export function Commerce() {
  return (
    <DomainPage
      domain="com"
      title="Commerce & Revenue"
      subtitle="Pricing engine, promotions, revenue assurance, fraud detection, card financing."
      semanticView="SV_COMMERCE_REVENUE"
      metrics={['same_store_sales_growth', 'gross_margin', 'revenue_leakage', 'fraud_rate', 'card_delinquency']}
      sampleQuery="Show me revenue leakage this quarter vs last by category"
    />
  )
}
