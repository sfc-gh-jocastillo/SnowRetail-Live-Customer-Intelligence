import { Shield } from 'lucide-react'

const regulations = [
  { code: 'SERNAC', name: 'Ley 19.496', scope: 'Protección al consumidor, derecho a retracto, transparencia de precios', scenarios: 8, color: 'text-accent-blue' },
  { code: 'Ley 21.096', name: 'Datos Personales', scope: 'Protección de datos personales (equivalente GDPR Chile)', scenarios: 6, color: 'text-accent-purple' },
  { code: 'PCI-DSS', name: 'Seguridad de Pagos', scope: 'Estándar de seguridad de datos para tarjetas de pago', scenarios: 5, color: 'text-accent-red' },
  { code: 'CMF', name: 'Normas Tarjeta', scope: 'Regulación de crédito al consumidor financiero', scenarios: 4, color: 'text-gold-400' },
  { code: 'Ley 20.169', name: 'Competencia Desleal', scope: 'Competencia desleal, transparencia de precios', scenarios: 3, color: 'text-accent-green' },
  { code: 'Ley 21.234', name: 'Derecho a Retracto', scope: 'Derecho a retracto en eCommerce', scenarios: 4, color: 'text-accent-blue' },
  { code: 'NIS2', name: 'Ciberseguridad', scope: 'Seguridad de infraestructura crítica (futuro)', scenarios: 2, color: 'text-slate-400' },
  { code: 'ISO 27001', name: 'Gestión de Seguridad', scope: 'Sistema de gestión de seguridad de la información', scenarios: 12, color: 'text-accent-green' },
]

export function Compliance() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Shield size={24} className="text-gold-400" />
          Cockpit de Cumplimiento
        </h1>
        <p className="text-sm text-slate-400">Superficie regulatoria Chile/LATAM — cada tile se vincula a escenarios que ejercitan el control.</p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {regulations.map(r => (
          <div key={r.code} className="bg-navy-900 border border-navy-700 rounded-xl p-5 space-y-3 hover:border-gold-500/30 transition-colors cursor-pointer">
            <div className={`text-lg font-bold ${r.color}`}>{r.code}</div>
            <div className="text-sm text-slate-200">{r.name}</div>
            <p className="text-xs text-slate-500 leading-relaxed">{r.scope}</p>
            <div className="text-xs text-slate-400">
              <span className="text-gold-400 font-mono">{r.scenarios}</span> escenarios vinculados
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
