import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// PWA auto update registration (vite-plugin-pwa)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker?.ready.then(() => {
      // SW controlled
    })
  })
}

createRoot(document.getElementById('root')).render(<App />)
