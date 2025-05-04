import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebase'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Login from './pages/login.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      setAuthChecked(true)
    })

    return unsubscribe
  }, [])

  if (!authChecked) return null

  return isAuthenticated ? children : <Navigate to="/login" />
}

// Custom Install Button Component
const InstallButton = ({ deferredPrompt, setDeferredPrompt, showInstallButton }) => {
  if (!showInstallButton) return null
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null)
  }
  
  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-5 right-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition flex items-center gap-2"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 13L12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 17H16V21H8V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Install App
    </button>
  )
}

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      
      // Show the install button
      setShowInstallButton(true)
      
      console.log('👋 beforeinstallprompt fired')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed and running in standalone mode')
      setShowInstallButton(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])
  
  // Handle app installed event
  useEffect(() => {
    const handleAppInstalled = (e) => {
      // Hide the install button
      setShowInstallButton(false)
      setDeferredPrompt(null)
      console.log('🎉 App was installed', e)
    }
    
    window.addEventListener('appinstalled', handleAppInstalled)
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(true)
    const handleOfflineStatus = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOfflineStatus)
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOfflineStatus)
    }
  }, [])

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          {/* Offline indicator */}
          {!isOnline && (
            <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 z-50">
              You are currently offline. Some features may be limited.
            </div>
          )}
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Install Button */}
          <InstallButton 
            deferredPrompt={deferredPrompt}
            setDeferredPrompt={setDeferredPrompt}
            showInstallButton={showInstallButton}
          />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App