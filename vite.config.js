import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png','icons/icon-512.png','firebase-messaging-sw.js'],
      manifest: {
        gcm_sender_id: '103953800507',
        name: 'Душа Руси — Магазин футболок',
        short_name: 'Душа Руси',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0d0f12',
        theme_color: '#0d0f12',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html'
      }
    })
  ],
  server: { port: 5173, host: true },
})
