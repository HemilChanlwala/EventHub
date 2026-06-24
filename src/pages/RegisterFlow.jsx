import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEvents } from '../services'
import formatDate from '../utils/formatDate'

const parsePrice = (p) => {
  if (!p) return 0
  if (typeof p === 'number') return p
  if (String(p).toLowerCase().includes('free')) return 0
  const digits = String(p).replace(/[^0-9.]/g, '')
  return Number(digits) || 0
}

function makeTicketId(eventId) {
  return `EVT-${eventId}-${String(Date.now()).slice(-6)}`
}

const RegisterFlow = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const events = getEvents()
  const event = events.find(e => String(e.id) === String(id)) || events[0]

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [ticketType, setTicketType] = useState('Standard')
  const [ticketId, setTicketId] = useState(null)
  const [processing, setProcessing] = useState(false)

  const base = parsePrice(event.price)
  const ticketPrices = {
    Standard: base,
    VIP: Math.round(base * 1.3),
    Premium: Math.round(base * 1.6)
  }
  const price = ticketPrices[ticketType]

  const finalizeRegistration = () => {
    const tid = makeTicketId(event.id)
    const reg = {
      ticketId: tid,
      eventId: event.id,
      eventTitle: event.title,
      name: form.name,
      email: form.email,
      phone: form.phone,
      ticketType,
      price,
      createdAt: new Date().toISOString()
    }
    try {
      const existing = JSON.parse(localStorage.getItem('eventhub_registrations') || '[]')
      existing.push(reg)
      localStorage.setItem('eventhub_registrations', JSON.stringify(existing))
    } catch (err) {
      console.warn('save registration', err)
    }
    setTicketId(tid)
    setStep(5)
  }

  const onSubmitStep = (e) => {
    e?.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }
    // From review -> if free, finalize immediately; else go to payment step
    if (step === 3) {
      if (price === 0) {
        finalizeRegistration()
        return
      }
      setStep(4)
      return
    }
    // step === 4 (payment confirmed) -> finalize
    if (step === 4) {
      finalizeRegistration()
    }
  }

  const qrData = step === 5 && ticketId ? encodeURIComponent(JSON.stringify({ ticketId, event: event.title })) : ''

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-4">
        <Link to={`/events/${event.id}`} className="text-sm text-indigo-300">← Back to event</Link>
        <h2 className="text-2xl font-semibold mt-2">Register — {event.title}</h2>
        <div className="text-sm text-gray-500">{formatDate(event.date)} • {event.location}</div>
      </div>

      {step === 1 && (
        <form onSubmit={onSubmitStep} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Full name</label>
            <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full p-3 bg-transparent border border-theme rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Email</label>
            <input required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full p-3 bg-transparent border border-theme rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Phone</label>
            <input required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full p-3 bg-transparent border border-theme rounded" />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onSubmitStep} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Ticket Type</label>
            <select value={ticketType} onChange={e=>setTicketType(e.target.value)} className="w-full p-3 bg-transparent border border-theme rounded">
              <option value="Standard">Standard — {event.price}</option>
              <option value="VIP">VIP — {priceToLabel(ticketPrices.VIP)}</option>
              <option value="Premium">Premium — {priceToLabel(ticketPrices.Premium)}</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={()=>setStep(1)} className="px-4 py-2 border rounded">Back</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review</h3>
          <div className="p-4 border rounded bg-white/5">
            <div className="flex justify-between"><div>Name</div><div>{form.name}</div></div>
            <div className="flex justify-between"><div>Email</div><div>{form.email}</div></div>
            <div className="flex justify-between"><div>Phone</div><div>{form.phone}</div></div>
            <div className="flex justify-between mt-2"><div>Ticket</div><div>{ticketType}</div></div>
            <div className="flex justify-between font-bold mt-1"><div>Total</div><div>{priceToLabel(price)}</div></div>
          </div>
          <div className="flex justify-between">
            <button onClick={()=>setStep(2)} className="px-4 py-2 border rounded">Back</button>
            <button onClick={onSubmitStep} className="px-4 py-2 bg-indigo-600 text-white rounded">Confirm & Pay</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment</h3>
          <div className="p-4 border rounded bg-white/5">
            <div className="flex justify-between"><div>Ticket</div><div>{ticketType}</div></div>
            <div className="flex justify-between mt-2"><div>Amount</div><div>{priceToLabel(price)}</div></div>
            <div className="mt-3">
              <label className="block text-sm text-gray-300">Cardholder name</label>
              <input className="w-full p-3 bg-transparent border border-theme rounded" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                <input placeholder="Card number" className="col-span-2 p-3 bg-transparent border border-theme rounded" />
                <input placeholder="CVC" className="p-3 bg-transparent border border-theme rounded" />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={()=>setStep(3)} className="px-4 py-2 border rounded">Back</button>
            <button onClick={(e)=>{ e?.preventDefault(); setProcessing(true); setTimeout(()=>{ finalizeRegistration(); setProcessing(false) }, 900) }} disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded">{processing ? 'Processing...' : `Pay ${priceToLabel(price)}`}</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Registration Successful</h3>
          <p className="text-sm text-gray-300">Your ticket has been generated. Save or download the QR code below for entry.</p>
          <div className="p-4 border rounded flex items-center gap-4">
            <div>
              <img alt="QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`} />
            </div>
            <div>
              <div className="font-semibold">Ticket: {ticketId}</div>
              <div className="text-sm text-gray-400">{event.title} — {formatDate(event.date)}</div>
              <a className="inline-block mt-2 px-3 py-1 border rounded" href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${qrData}`} target="_blank" rel="noreferrer">Open QR</a>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>navigate('/dashboard')} className="px-4 py-2 bg-indigo-600 text-white rounded">Go to Dashboard</button>
            <Link to={`/events/${event.id}`} className="px-4 py-2 border rounded">Back to Event</Link>
          </div>
        </div>
      )}
    </div>
  )
}

function priceToLabel(n) {
  if (!n) return 'Free'
  return `$${n}`
}

export default RegisterFlow
