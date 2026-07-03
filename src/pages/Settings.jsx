import Sidebar from '../components/Sidebar'

const Settings = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <Sidebar />
      </aside>
      <main className="lg:col-span-3">
        <h2 className="text-2xl font-semibold mb-3">Settings</h2>
        <div className="glass p-6 rounded space-y-4">
          <div>
            <div className="text-sm text-theme-weak">Account</div>
            <div className="mt-2 text-theme">Manage your account preferences and profile settings.</div>
          </div>
          <div>
            <div className="text-sm text-theme-weak">Privacy</div>
            <div className="mt-2 text-theme">No settings are available in this demo mode.</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
