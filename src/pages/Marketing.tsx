import { DomainPage } from '../components/shared/DomainPage'

export function Marketing() {
  return (
    <DomainPage
      domain="mkt"
      title="Marketing y Crecimiento"
      subtitle="Orquestación de campañas, atribución, costo de adquisición, programas de fidelidad, análisis de cohortes."
      semanticView="SV_MARKETING_GROWTH"
      metrics={['roas', 'cac', 'campaign_lift', 'loyalty_retention', 'attributed_revenue']}
      sampleQuery="¿Cuál es el ROAS real de nuestras campañas de email a miembros de fidelidad?"
    />
  )
}
