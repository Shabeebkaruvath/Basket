import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err)
      }
    )
  })
}

// Web App Install Prompt Handling
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt triggered'+e)
  // You can store this event for later use if needed
})

// Create root and render app
const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// PWA Lifecycle Events
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed')
})

// Check if launched as PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('Launched as PWA')
}