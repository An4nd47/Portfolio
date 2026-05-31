// ─── Self-hosted fonts via @fontsource ───────────────────────────────────────
// Eliminates the Google Fonts CDN render-blocking request (~200ms FCP saving).
// Vite bundles these as hashed assets with font-display:swap baked in.
import '@fontsource/orbitron/400.css'
import '@fontsource/orbitron/700.css'
import '@fontsource/orbitron/900.css'
import '@fontsource/share-tech-mono/400.css'
import '@fontsource/exo-2/300.css'
import '@fontsource/exo-2/400.css'
import '@fontsource/exo-2/600.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
