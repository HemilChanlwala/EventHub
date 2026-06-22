import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AuthContext from '../context/AuthContext'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' }
  })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
      }
    } catch (err) { console.warn('theme apply error', err) }
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClass = `glass-navbar ${scrolled ? 'solid' : ''}`
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-white">EventHub</Link>
        <div className="hidden md:flex space-x-6 items-center text-white/80">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/events" className="hover:text-white">Events</Link>
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Toggle theme" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-2 py-1 rounded hover:bg-white/5 text-white">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="hidden md:flex items-center space-x-4 text-white/90">
            {user ? (
              <>
                <Link to="/profile" className="hover:text-white">Hi, {user.name}</Link>
                {user.role === 'organizer' && <Link to="/organizer" className="hover:text-white">Organizer</Link>}
                {user.role === 'admin' && <Link to="/admin" className="hover:text-white">Admin</Link>}
                <button onClick={() => { logout(); }} className="px-3 py-1 border rounded border-white/10">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-white">Login</Link>
                <Link to="/register" className="px-3 py-1 border rounded border-white/10">Register</Link>
              </>
            )}
          </div>
          <button className="md:hidden px-3 py-2 border rounded border-white/10 text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            Menu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden px-4 pb-4 space-y-2 overflow-hidden text-white/90">
            <Link to="/" className="block">Home</Link>
            <Link to="/events" className="block">Events</Link>
            <Link to="/about" className="block">About</Link>
            <Link to="/contact" className="block">Contact</Link>
            {user ? (
              <>
                <Link to="/profile" className="block">Profile</Link>
                {user.role === 'organizer' && <Link to="/organizer" className="block">Organizer</Link>}
                {user.role === 'admin' && <Link to="/admin" className="block">Admin</Link>}
                <button onClick={() => { logout(); setOpen(false) }} className="block text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">Login</Link>
                <Link to="/register" className="block">Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
