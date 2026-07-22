import { NavLink } from 'react-router-dom'
import {
  Users, ShoppingBag, CreditCard, Truck, Megaphone,
  Layers, List, Shield, Map, Network, X
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Executive Briefing', icon: Network },
  { to: '/command-center', label: 'CIC · Customer Intelligence', icon: Users },
  { to: '/omnichannel', label: 'OMN · Omnichannel Ops', icon: ShoppingBag },
  { to: '/commerce', label: 'COM · Commerce & Revenue', icon: CreditCard },
  { to: '/supply-chain', label: 'SCO · Supply Chain', icon: Truck },
  { to: '/marketing', label: 'MKT · Marketing & Growth', icon: Megaphone },
  { divider: true },
  { to: '/semantic-layer', label: 'Semantic Layer', icon: Layers },
  { to: '/scenarios', label: 'All Scenarios', icon: List },
  { to: '/compliance', label: 'Compliance', icon: Shield },
  { to: '/tours', label: 'Tours', icon: Map },
  { to: '/architecture', label: 'Architecture', icon: Network },
] as const

type NavItem = { to: string; label: string; icon: typeof Users; divider?: never } | { divider: true; to?: never; label?: never; icon?: never }

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <aside className={`${open ? 'w-64' : 'w-0'} flex-shrink-0 overflow-hidden transition-all duration-300 bg-navy-900 border-r border-navy-700`}>
      <div className="flex h-full w-64 flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
              <span className="text-navy-950 font-bold text-sm">SR</span>
            </div>
            <span className="font-semibold text-sm">SnowRetail</span>
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
                      ? 'bg-navy-700 text-gold-400 font-medium'
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
          <div>Snowflake AI Data Cloud</div>
          <div>Chile/LATAM · synthetic demo</div>
        </div>
      </div>
    </aside>
  )
}
