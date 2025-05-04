import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Removed the tailwindcss usage that required autoprefixer
    VitePWA({
      registerType: 'autoUpdate', // Changed from 'prompt' for better user experience
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Basket',
        short_name: 'Basket',
        description: 'A shared shopping list for your home',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
          {
            src: 'icons/icon-192x192.png', // Fixed path without leading slash
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png', // Fixed path without leading slash
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png', // Fixed path without leading slash
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Added workbox configuration for better caching
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
  ],
})