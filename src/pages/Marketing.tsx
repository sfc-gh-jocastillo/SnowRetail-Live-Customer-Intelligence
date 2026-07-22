import { DomainPage } from '../components/shared/DomainPage'

export function Marketing() {
  return (
    <DomainPage
      domain="mkt"
      title="Marketing & Growth"
      subtitle="Campaign orchestration, attribution, acquisition cost, loyalty programs, cohort analysis."
      semanticView="SV_MARKETING_GROWTH"
      metrics={['roas', 'cac', 'campaign_lift', 'loyalty_retention', 'attributed_revenue']}
      sampleQuery="What's the true ROAS of our loyalty email campaigns this quarter?"
    />
  )
}
