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
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
        setShowInstallButton(false)
      })
    }
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
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

          {/* Install Button (optional styling via Tailwind) */}
          {showInstallButton && (
            <button
              onClick={handleInstallClick}
              className="fixed bottom-5 right-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
            >
              Install App
            </button>
          )}
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
