import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SnowflakeProvider } from './hooks/useSnowflakeConnection'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/SnowRetail-Live-Customer-Intelligence">
      <SnowflakeProvider>
        <App />
      </SnowflakeProvider>
    </BrowserRouter>
  </StrictMode>,
)
