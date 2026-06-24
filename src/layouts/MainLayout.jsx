import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Toaster from '../components/Toaster'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />
      <Toaster />
      <main className="flex-1 pt-20 md:pt-24">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
