import { DomainPage } from '../components/shared/DomainPage'

export function CommandCenter() {
  return (
    <DomainPage
      domain="cic"
      title="Customer Intelligence"
      subtitle="Identity-resolved 360. Churn explainability, next-best-offer, vulnerability-aware care."
      semanticView="SV_CUSTOMER_INTELLIGENCE"
      metrics={['CLV', 'churn_probability', 'nps_score', 'cross_sell_propensity', 'days_since_last_purchase']}
      sampleQuery="Why is churn spiking in Region Sur this quarter?"
    />
  )
}
