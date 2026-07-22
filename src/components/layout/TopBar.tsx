import { useState, useEffect } from 'react'
import { Menu, Wifi, WifiOff, Command, X } from 'lucide-react'
import { useSnowflakeConnection } from '../../hooks/useSnowflakeConnection'

export function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [signals, setSignals] = useState(42817)
  const [decisions, setDecisions] = useState(18)
  const [actions, setActions] = useState(4)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const { connected, connecting, error, connect, disconnect } = useSnowflakeConnection()

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(s => s + Math.floor(Math.random() * 200))
      if (Math.random() > 0.7) setDecisions(d => d + 1)
      if (Math.random() > 0.9) setActions(a => a + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header className="flex items-center justify-between h-12 px-4 border-b border-navy-700 bg-navy-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle} className="text-slate-400 hover:text-white">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              <span className="text-gold-400 font-mono">{signals.toLocaleString()}</span> signals
            </span>
            <span>
              <span className="text-accent-blue font-mono">{decisions}</span> agent decisions
            </span>
            <span>
              <span className="text-accent-green font-mono">{actions}</span> closed-loop actions
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-navy-800 text-xs text-slate-300 hover:bg-navy-700">
            <Command size={12} />
            <span>K</span>
          </button>
          <button
            onClick={() => setShowConnectModal(true)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
              connected
                ? 'bg-accent-green/10 text-accent-green border border-accent-green/30 hover:bg-accent-green/20'
                : 'bg-navy-800 text-slate-500 hover:bg-navy-700 hover:text-slate-300'
            }`}
          >
            {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{connected ? 'Live' : 'Offline'}</span>
          </button>
        </div>
      </header>

      {/* Connection Modal */}
      {showConnectModal && (
        <ConnectModal
          onClose={() => setShowConnectModal(false)}
          connected={connected}
          connecting={connecting}
          error={error}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      )}
    </>
  )
}

function ConnectModal({
  onClose, connected, connecting, error, onConnect, onDisconnect
}: {
  onClose: () => void
  connected: boolean
  connecting: boolean
  error: string | null
  onConnect: (config: { accountUrl: string; token: string }) => Promise<void>
  onDisconnect: () => void
}) {
  const [accountUrl, setAccountUrl] = useState('https://ri58390.sa-east-1.aws.snowflakecomputing.com')
  const [token, setToken] = useState('')

  const handleConnect = async () => {
    await onConnect({ accountUrl: accountUrl.replace(/\/$/, ''), token })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-navy-900 border border-navy-700 rounded-xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Snowflake Connection</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {connected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent-green text-sm">
              <Wifi size={16} />
              <span>Connected to Snowflake</span>
            </div>
            <p className="text-xs text-slate-400">
              Live queries will be sent to Cortex Analyst via your Semantic Views.
              The demo UI shows a green "Live" badge on query results from Snowflake.
            </p>
            <div className="flex gap-3">
              <button onClick={onDisconnect} className="px-4 py-2 rounded-lg bg-accent-red/10 text-accent-red text-sm border border-accent-red/30 hover:bg-accent-red/20">
                Disconnect
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-navy-800 text-slate-300 text-sm hover:bg-navy-700">
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Connect to your Snowflake account to enable live Cortex Analyst queries
              through the Semantic Views. You need a Programmatic Access Token (PAT) or session token.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Account URL</label>
                <input
                  type="text"
                  value={accountUrl}
                  onChange={e => setAccountUrl(e.target.value)}
                  placeholder="https://account.snowflakecomputing.com"
                  className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-navy-700 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Access Token (PAT or Session Token)</label>
                <input
                  type="password"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="pat-xxxxx..."
                  className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-navy-700 text-sm text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
            {error && (
              <div className="text-xs text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg p-3">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleConnect}
                disabled={connecting || !token}
                className="px-4 py-2 rounded-lg bg-gold-500 text-navy-950 text-sm font-medium hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? 'Connecting...' : 'Connect'}
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-navy-800 text-slate-300 text-sm hover:bg-navy-700">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
