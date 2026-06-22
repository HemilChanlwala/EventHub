import { useParams, useNavigate } from 'react-router-dom'
import { generateCertificate } from '../utils/generateCertificate'

const Ticket = () => {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const regs = (() => {
    try { return JSON.parse(localStorage.getItem('eventhub_registrations') || '[]') } catch { return [] }
  })()

  const reg = regs.find(r => r.ticketId === ticketId) || null

  if (!reg) return (
    <div className="max-w-3xl mx-auto p-8">
      <h3 className="text-lg font-semibold">Ticket not found</h3>
      <div className="mt-4">
        <button onClick={() => navigate('/dashboard')} className="px-3 py-1 bg-indigo-600 text-white rounded">Back to dashboard</button>
      </div>
    </div>
  )

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ ticketId: reg.ticketId, event: reg.eventTitle }))}`

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="p-6 bg-white/5 rounded">
        <h2 className="text-2xl font-semibold">{reg.eventTitle}</h2>
        <div className="mt-2 text-sm text-gray-300">Name: {reg.name}</div>
        <div className="mt-1 text-sm text-gray-400">Ticket: {reg.ticketId}</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <img src={qrUrl} alt="ticket-qr" className="mx-auto" />
          <div>
            <div className="text-sm">Type: {reg.ticketType}</div>
            <div className="text-sm">Price: {reg.price}</div>
            <div className="mt-4 space-x-2">
              <button onClick={() => generateCertificate(reg)} className="px-4 py-2 bg-indigo-600 text-white rounded">Download Certificate</button>
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border rounded">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ticket
