// Wraps public pages with the shared navigation bar, toast notifications, and footer.
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Toaster from '../components/Toaster'

const MainLayout = ({ children }) => {
  return (
    <div className="aurora-bg min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />
      <Toaster />
      <main className="relative flex-1 pt-24 md:pt-28">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
