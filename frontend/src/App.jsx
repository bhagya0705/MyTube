import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Registerpage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import WatchPage from './pages/WatchPage.jsx';
import './App.css'

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
      </Routes>
    </Router>
  )
}

export default App
