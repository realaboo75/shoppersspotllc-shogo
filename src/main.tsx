import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ShogoErrorBoundary } from './ShogoErrorBoundary'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShogoErrorBoundary><App /></ShogoErrorBoundary>
  </StrictMode>,
)