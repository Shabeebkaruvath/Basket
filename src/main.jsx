import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🔽 Add this import
import { registerSW } from 'virtual:pwa-register'

// 🔽 Register the Service Worker
registerSW({
  onOfflineReady() {
    console.log('✅ App is ready for offline use')
  },
  onNeedRefresh() {
    console.log('🔄 New content available, please refresh')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
