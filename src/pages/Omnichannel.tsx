import { DomainPage } from '../components/shared/DomainPage'

export function Omnichannel() {
  return (
    <DomainPage
      domain="omn"
      title="Operaciones Omnicanal"
      subtitle="Tienda + eCommerce + App — inventario unificado, inteligencia de planograma, experiencia sin fricción."
      semanticView="SV_OMNICHANNEL_OPS"
      metrics={['conversion_rate', 'basket_size', 'foot_traffic', 'planogram_compliance', 'fulfillment_time']}
      sampleQuery="¿Qué pasillos tienen menor conversión en Santiago Centro esta semana?"
    />
  )
}
