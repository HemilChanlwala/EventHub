import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterFlow from './pages/RegisterFlow'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import OrganizerDashboard from './pages/OrganizerDashboard'
import CheckIn from './pages/CheckIn'
import AdminDashboard from './pages/AdminDashboard'
import Ticket from './pages/Ticket'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
        <Route path="/events/:id" element={<MainLayout><EventDetails /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/events/:id/register" element={<MainLayout><RegisterFlow /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/organizer" element={<MainLayout><OrganizerDashboard /></MainLayout>} />
        <Route path="/organizer/checkin" element={<MainLayout><CheckIn /></MainLayout>} />
        <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/ticket/:ticketId" element={<MainLayout><Ticket /></MainLayout>} />
        <Route path="*" element={<MainLayout><Home /></MainLayout>} />
      </Routes>
    </Router>
  )
}

export default App