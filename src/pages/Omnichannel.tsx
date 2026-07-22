import { DomainPage } from '../components/shared/DomainPage'

export function Omnichannel() {
  return (
    <DomainPage
      domain="omn"
      title="Omnichannel Operations"
      subtitle="Store + eCommerce + App — unified inventory, planogram intelligence, seamless experience."
      semanticView="SV_OMNICHANNEL_OPS"
      metrics={['conversion_rate', 'basket_size', 'foot_traffic', 'planogram_compliance', 'fulfillment_time']}
      sampleQuery="Which aisles have the lowest conversion at Santiago Centro this week?"
    />
  )
}
