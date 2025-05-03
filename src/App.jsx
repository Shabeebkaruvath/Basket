 
import Home from './pages/Home'
import Settings from './pages/Settings'
import Login from './pages/login.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
//     return () => {
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
   
  
  return (
    <ThemeProvider>
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home   />} />
          <Route path="/login" element={<Login   />} />
          <Route path="/settings" element={<Settings   />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  )
}

export default App