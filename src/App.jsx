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

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

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
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
