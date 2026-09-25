import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// A hello for anyone who opens dev tools.
console.log(
  '%c¡Hola, curious engineer!%c\nThis site hides a fiesta. Click the page, then type ↑ ↑ ↓ ↓ ← → ← → B A.\nSource: https://github.com/skelzer/skelzer.github.io',
  'font: 800 16px Archivo, sans-serif; color: #E63327',
  'font: 12px "IBM Plex Mono", monospace; line-height: 1.6',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
