import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'MindVox - Therapeutic Audio',
        short_name: 'MindVox',
        description: 'Therapeutic audio companion for post-treatment consolidation (EN/RO/RU)',
        theme_color: '#0d0f14',
        background_color: '#0d0f14',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'saint-audio',
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  base: '/saint-protocol/',
  build: {
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: { '@': '/src' },
  },
})
