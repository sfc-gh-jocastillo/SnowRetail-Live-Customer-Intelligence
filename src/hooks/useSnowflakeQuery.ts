import { useState, useEffect, useCallback } from 'react'
import { useSnowflakeConnection } from './useSnowflakeConnection'

interface QueryResult {
  rows: Record<string, unknown>[]
  loading: boolean
  isLive: boolean
  error: string | null
  refresh: () => void
}

export function useSnowflakeQuery(sql: string, fallbackRows: Record<string, unknown>[]): QueryResult {
  const { config, connected } = useSnowflakeConnection()
  const [rows, setRows] = useState<Record<string, unknown>[]>(fallbackRows)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!connected || !config) {
      setRows(fallbackRows)
      setIsLive(false)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${config.accountUrl}/api/v2/statements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statement: sql,
          timeout: 30,
          database: 'SNOWRETAIL',
          schema: 'GOLD',
          warehouse: 'COMPUTE_WH',
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const columns: string[] = data.resultSetMetaData?.rowType?.map((c: { name: string }) => c.name) || []
        const rawRows: string[][] = data.data || []
        const parsed = rawRows.map((row: string[]) => {
          const obj: Record<string, unknown> = {}
          columns.forEach((col, i) => {
            const val = row[i]
            obj[col] = val === null ? null : isNaN(Number(val)) ? val : Number(val)
          })
          return obj
        })
        setRows(parsed)
        setIsLive(true)
      } else {
        setRows(fallbackRows)
        setIsLive(false)
      }
    } catch {
      setRows(fallbackRows)
      setIsLive(false)
    } finally {
      setLoading(false)
    }
  }, [sql, connected, config, fallbackRows])

  useEffect(() => { execute() }, [execute])

  return { rows, loading, isLive, error, refresh: execute }
}

// Execute a single-value KPI query
export function useSnowflakeKPI(sql: string, fallbackValue: number | string): {
  value: number | string
  loading: boolean
  isLive: boolean
} {
  const { config, connected } = useSnowflakeConnection()
  const [value, setValue] = useState<number | string>(fallbackValue)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      if (!connected || !config) {
        setValue(fallbackValue)
        setIsLive(false)
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`${config.accountUrl}/api/v2/statements`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            statement: sql,
            timeout: 30,
            database: 'SNOWRETAIL',
            schema: 'GOLD',
            warehouse: 'COMPUTE_WH',
          }),
        })
        if (res.ok && !cancelled) {
          const data = await res.json()
          const raw = data.data?.[0]?.[0]
          if (raw !== undefined && raw !== null) {
            setValue(isNaN(Number(raw)) ? raw : Number(raw))
            setIsLive(true)
          } else {
            setValue(fallbackValue)
            setIsLive(false)
          }
        } else if (!cancelled) {
          setValue(fallbackValue)
          setIsLive(false)
        }
      } catch {
        if (!cancelled) { setValue(fallbackValue); setIsLive(false) }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [sql, connected, config, fallbackValue])

  return { value, loading, isLive }
}
