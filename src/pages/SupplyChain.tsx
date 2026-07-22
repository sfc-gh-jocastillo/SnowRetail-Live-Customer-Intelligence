import { DomainPage } from '../components/shared/DomainPage'

export function SupplyChain() {
  return (
    <DomainPage
      domain="sco"
      title="Supply Chain & Ops"
      subtitle="Demand forecasting, replenishment, warehouse ops, last-mile logistics, returns."
      semanticView="SV_SUPPLY_CHAIN"
      metrics={['inventory_turns', 'stockout_rate', 'fill_rate', 'lead_time', 'delivery_cost_per_order']}
      sampleQuery="Which suppliers are trending late and affecting stockouts?"
    />
  )
}
