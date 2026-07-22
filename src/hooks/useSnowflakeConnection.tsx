import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface SnowflakeConfig {
  accountUrl: string
  token: string
}

interface SnowflakeContextValue {
  config: SnowflakeConfig | null
  connected: boolean
  connecting: boolean
  error: string | null
  connect: (config: SnowflakeConfig) => Promise<void>
  disconnect: () => void
}

const SnowflakeContext = createContext<SnowflakeContextValue>({
  config: null,
  connected: false,
  connecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
})

export function SnowflakeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SnowflakeConfig | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async (newConfig: SnowflakeConfig) => {
    setConnecting(true)
    setError(null)
    try {
      // Test the connection by querying a simple semantic view
      const res = await fetch(`${newConfig.accountUrl}/api/v2/cortex/analyst/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${newConfig.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: [{ type: 'text', text: 'How many customers do we have?' }] }],
          semantic_view: 'SNOWRETAIL.SEMANTIC.SV_CUSTOMER_INTELLIGENCE',
        }),
      })
      if (res.ok) {
        setConfig(newConfig)
        setConnected(true)
      } else {
        const text = await res.text()
        setError(`Connection failed: HTTP ${res.status} — ${text.slice(0, 200)}`)
      }
    } catch (e: unknown) {
      setError(`Connection failed: ${e instanceof Error ? e.message : 'Network error'}`)
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setConfig(null)
    setConnected(false)
    setError(null)
  }, [])

  return (
    <SnowflakeContext.Provider value={{ config, connected, connecting, error, connect, disconnect }}>
      {children}
    </SnowflakeContext.Provider>
  )
}

export function useSnowflakeConnection() {
  return useContext(SnowflakeContext)
}
