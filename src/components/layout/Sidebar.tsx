import { NavLink } from 'react-router-dom'
import {
  Users, ShoppingBag, CreditCard, Truck, Megaphone,
  Layers, List, Shield, Map, Network, X, UserCircle
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Resumen Ejecutivo', icon: Network },
  { to: '/command-center', label: 'CIC · Inteligencia de Clientes', icon: Users },
  { to: '/omnichannel', label: 'OMN · Operaciones Omnicanal', icon: ShoppingBag },
  { to: '/commerce', label: 'COM · Comercio e Ingresos', icon: CreditCard },
  { to: '/supply-chain', label: 'SCO · Cadena de Suministro', icon: Truck },
  { to: '/marketing', label: 'MKT · Marketing y Crecimiento', icon: Megaphone },
  { divider: true },
  { to: '/customer-360', label: 'Customer 360', icon: UserCircle },
  { to: '/semantic-layer', label: 'Semantic Layer', icon: Layers },
  { to: '/scenarios', label: 'Todos los Escenarios', icon: List },
  { to: '/compliance', label: 'Cumplimiento', icon: Shield },
  { to: '/tours', label: 'Tours', icon: Map },
  { to: '/architecture', label: 'Arquitectura', icon: Network },
] as const

type NavItem = { to: string; label: string; icon: typeof Users; divider?: never } | { divider: true; to?: never; label?: never; icon?: never }

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <aside className={`${open ? 'w-64' : 'w-0'} flex-shrink-0 overflow-hidden transition-all duration-300 bg-navy-900 border-r border-navy-700`}>
      <div className="flex h-full w-64 flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-navy-700">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 36 36" className="h-8 w-8" fill="none">
              <circle cx="18" cy="18" r="18" fill="#29B5E8" opacity="0.15"/>
              <path d="M18 6L18 30M6 18L30 18M9.5 9.5L26.5 26.5M26.5 9.5L9.5 26.5" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="18" cy="6" r="2.5" fill="#29B5E8"/>
              <circle cx="18" cy="30" r="2.5" fill="#29B5E8"/>
              <circle cx="6" cy="18" r="2.5" fill="#29B5E8"/>
              <circle cx="30" cy="18" r="2.5" fill="#29B5E8"/>
              <circle cx="9.5" cy="9.5" r="2" fill="#29B5E8"/>
              <circle cx="26.5" cy="26.5" r="2" fill="#29B5E8"/>
              <circle cx="26.5" cy="9.5" r="2" fill="#29B5E8"/>
              <circle cx="9.5" cy="26.5" r="2" fill="#29B5E8"/>
              <circle cx="18" cy="18" r="3" fill="#29B5E8"/>
            </svg>
            <div>
              <span className="font-semibold text-sm text-white">SnowRetail</span>
              <span className="block text-[10px] text-sf-blue">powered by Snowflake</span>
            </div>
          </div>
          <button onClick={onToggle} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {(navItems as readonly NavItem[]).map((item, i) => {
            if ('divider' in item && item.divider) {
              return <div key={i} className="my-2 border-t border-navy-700" />
            }
            const Icon = item.icon!
            return (
              <NavLink
                key={item.to}
                to={item.to!}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-sf-blue/10 text-sf-blue font-medium border border-sf-blue/20'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="px-4 py-3 border-t border-navy-700 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-sf-blue animate-pulse" />
            <span className="text-sf-blue">Snowflake AI Data Cloud</span>
          </div>
          <div className="mt-1">Chile/LATAM · demo sintética</div>
        </div>
      </div>
    </aside>
  )
}
