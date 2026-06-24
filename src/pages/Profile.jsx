import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { saveUser } from '../services'
import { notify } from '../utils/notify'

const Profile = () => {
  const { user, login } = useContext(AuthContext)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const handleSave = () => {
    const updated = { ...user, name, email, phone }
    try {
      saveUser(updated)
      login(updated, true)
      notify('Profile saved', 'success')
    } catch (err) { console.warn('profile save', err); notify('Failed to save', 'error') }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm">Full name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Phone</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-3 border rounded" />
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  )
}

export default Profile
