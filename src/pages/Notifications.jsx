import Sidebar from '../components/Sidebar'

const Notifications = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <Sidebar />
      </aside>
      <main className="lg:col-span-3">
        <h2 className="text-2xl font-semibold mb-3">Notifications</h2>
        <div className="glass p-6 rounded">
          <p className="text-theme-weak">You have no new notifications.</p>
        </div>
      </main>
    </div>
  )
}

export default Notifications
