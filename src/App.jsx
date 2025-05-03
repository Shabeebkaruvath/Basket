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
  
  // Show nothing during auth check to prevent flash of content
  if (!authChecked) {
    return null
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
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
            
            {/* Redirect all other routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App