import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// PWA registration
import { registerSW } from 'virtual:pwa-register'

// Custom notification component for PWA updates
const createUpdateNotification = () => {
  const notificationContainer = document.createElement('div')
  notificationContainer.style.position = 'fixed'
  notificationContainer.style.bottom = '80px'
  notificationContainer.style.left = '50%'
  notificationContainer.style.transform = 'translateX(-50%)'
  notificationContainer.style.backgroundColor = '#3b82f6'
  notificationContainer.style.color = 'white'
  notificationContainer.style.padding = '12px 24px'
  notificationContainer.style.borderRadius = '8px'
  notificationContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
  notificationContainer.style.zIndex = '9999'
  notificationContainer.style.display = 'flex'
  notificationContainer.style.alignItems = 'center'
  notificationContainer.style.justifyContent = 'space-between'
  notificationContainer.style.gap = '12px'
  
  const message = document.createElement('span')
  message.textContent = 'New content available!'
  
  const updateButton = document.createElement('button')
  updateButton.textContent = 'Update'
  updateButton.style.backgroundColor = 'white'
  updateButton.style.color = '#3b82f6'
  updateButton.style.border = 'none'
  updateButton.style.padding = '8px 16px'
  updateButton.style.borderRadius = '4px'
  updateButton.style.cursor = 'pointer'
  
  notificationContainer.appendChild(message)
  notificationContainer.appendChild(updateButton)
  document.body.appendChild(notificationContainer)
  
  return { container: notificationContainer, button: updateButton }
}

// Register service worker with custom update handler
const updateSW = registerSW({
  onOfflineReady() {
    console.log('✅ App is ready for offline use')
    // You could show a toast notification here
  },
  onNeedRefresh() {
    console.log('🔄 New content available, click to update')
    const { container, button } = createUpdateNotification()
    
    button.addEventListener('click', () => {
      updateSW(true)
      container.remove()
    })
  },
  onRegisteredSW(swUrl, registration) {
    console.log(`Service Worker registered: ${swUrl}`)
    
    // Check for updates every hour
    setInterval(() => {
      registration?.update()
    }, 60 * 60 * 1000)
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)