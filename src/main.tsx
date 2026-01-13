import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/theme.css'
import './shared/styles/globals.css'
import './index.css'
import './shared/styles/indicators.css'
import App from './App.tsx'
import { AppProviders } from './context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
