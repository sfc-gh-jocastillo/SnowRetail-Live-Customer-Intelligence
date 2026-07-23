import { DomainPage } from '../components/shared/DomainPage'

export function SupplyChain() {
  return (
    <DomainPage
      domain="sco"
      title="Cadena de Suministro"
      subtitle="Forecasting de demanda, reposición, operaciones de bodega, logística última milla, devoluciones."
      semanticView="SV_SUPPLY_CHAIN"
      metrics={['inventory_turns', 'stockout_rate', 'fill_rate', 'lead_time', 'delivery_cost_per_order']}
      sampleQuery="¿Qué proveedores están retrasándose y afectando quiebres de stock?"
    />
  )
}
