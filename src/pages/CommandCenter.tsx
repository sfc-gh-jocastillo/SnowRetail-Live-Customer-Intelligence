import { DomainPage } from '../components/shared/DomainPage'

export function CommandCenter() {
  return (
    <DomainPage
      domain="cic"
      title="Inteligencia de Clientes"
      subtitle="Customer 360 con resolución de identidad. Predicción de churn, next-best-offer, atención proactiva."
      semanticView="SV_CUSTOMER_INTELLIGENCE"
      metrics={['CLV', 'churn_probability', 'nps_score', 'cross_sell_propensity', 'days_since_last_purchase']}
      sampleQuery="¿Por qué está subiendo el churn en la Región Sur?"
    />
  )
}
