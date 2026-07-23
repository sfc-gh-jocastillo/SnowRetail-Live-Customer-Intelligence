import { DomainPage } from '../components/shared/DomainPage'

export function Commerce() {
  return (
    <DomainPage
      domain="com"
      title="Comercio e Ingresos"
      subtitle="Motor de pricing, promociones, revenue assurance, detección de fraude, Tarjeta Ripley."
      semanticView="SV_COMMERCE_REVENUE"
      metrics={['same_store_sales_growth', 'gross_margin', 'revenue_leakage', 'fraud_rate', 'card_delinquency']}
      sampleQuery="Muéstrame la fuga de ingresos este trimestre vs el anterior por categoría"
    />
  )
}
