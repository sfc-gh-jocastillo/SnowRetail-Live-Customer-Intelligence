import { Map, Play, Clock } from 'lucide-react'

const tours = [
  { id: 'cxo-5min', name: 'Tour CXO 5 Minutos', audience: 'CXO / CFO / Directorio', duration: '5 min', scenarios: 5, roi: { hoursSaved: '42h/semana', valueProtected: '$2.1M', customers: '89K' } },
  { id: 'cdo-10min', name: 'Tour CDO / CRO 10 Minutos', audience: 'CDO / CRO / Head of Digital', duration: '10 min', scenarios: 8, roi: { hoursSaved: '120h/semana', valueProtected: '$5.4M', customers: '210K' } },
  { id: 'full-20min', name: 'Tour Completo', audience: 'Stakeholders técnicos + negocio', duration: '20 min', scenarios: 14, roi: { hoursSaved: '307h/semana', valueProtected: '$9.8M', customers: '1.2M' } },
]

export function Tours() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Map size={24} className="text-gold-400" />
          Tours Guiados
        </h1>
        <p className="text-sm text-slate-400">Demos ejecutivas con un click con totales de ROI agregados. Cada tour hila la historia del Semantic Layer.</p>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        {tours.map(t => (
          <div key={t.id} className="bg-navy-900 border border-navy-700 rounded-xl p-6 space-y-4 hover:border-gold-500/50 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <Clock size={14} className="text-slate-500" />
              <span className="text-xs text-gold-400">{t.duration}</span>
            </div>
            <div>
              <div className="font-semibold text-sm">{t.name}</div>
              <div className="text-xs text-slate-500">{t.audience}</div>
            </div>
            <div className="text-xs text-slate-400">{t.scenarios} escenarios encadenados</div>
            <div className="grid grid-cols-3 gap-2 text-center border-t border-navy-700 pt-3">
              <div>
                <div className="text-sm font-bold text-accent-blue">{t.roi.hoursSaved}</div>
                <div className="text-[10px] text-slate-500">ahorro</div>
              </div>
              <div>
                <div className="text-sm font-bold text-accent-green">{t.roi.valueProtected}</div>
                <div className="text-[10px] text-slate-500">protegido</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gold-400">{t.roi.customers}</div>
                <div className="text-[10px] text-slate-500">clientes</div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gold-500 text-navy-950 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={14} /> Iniciar Tour
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
