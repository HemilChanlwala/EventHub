import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './routes/ProtectedRoute'
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
import ForgotPassword from './pages/ForgotPassword'
import CreateEvent from './pages/CreateEvent'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import './App.css'
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
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
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/create-event" element={<ProtectedRoute allowedRoles={['organizer']}><MainLayout><CreateEvent /></MainLayout></ProtectedRoute>} />
        <Route path="/my-events" element={<ProtectedRoute><MainLayout><MyEvents /></MainLayout></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><MainLayout><Tickets /></MainLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><MainLayout><Notifications /></MainLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
        <Route path="/events/:id/register" element={<MainLayout><RegisterFlow /></MainLayout>} />
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/organizer" element={<ProtectedRoute allowedRoles={['organizer']}><MainLayout><OrganizerDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/organizer/checkin" element={<ProtectedRoute allowedRoles={['organizer']}><MainLayout><CheckIn /></MainLayout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><MainLayout><AdminDashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
        <Route path="/ticket/:ticketId" element={<MainLayout><Ticket /></MainLayout>} />
        <Route path="*" element={<MainLayout><Home /></MainLayout>} />
        <Route
          path="/edit-event/:id"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <MainLayout>
                <CreateEvent />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>   
    </Router>
  )
}

export default App