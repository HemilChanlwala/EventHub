import { useRef } from 'react'
import { downloadTicketPdf } from '../utils/downloadTicket'

const formatDate = (dateStr) => {
  try { return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) }
  catch { return dateStr || 'TBD' }
}

const formatTime = (dateStr) => {
  try { return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) }
  catch { return dateStr || 'TBD' }
}

const TicketCard = ({ registration }) => {
  const captureRef = useRef(null)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ ticketId: registration.ticketId, event: registration.eventTitle }))}`
  const bannerUrl = registration.eventBanner || registration.banner || registration.image || ''
  const organizerName = registration.organizerName || registration.organizer || registration.organizer_name || 'EventHub'
  const eventDate = registration.eventDate || registration.date || registration.event_date || ''
  const eventTime = registration.eventTime || registration.time || registration.startTime || eventDate
  const venue = registration.eventLocation || registration.location || registration.venue || 'TBD Venue'
  const userName = registration.name || registration.fullName || registration.userName || 'Attendee'
  const registrationDate = registration.registrationDate || registration.registeredAt || registration.createdAt || new Date().toISOString()

  return (
    <div className="relative">
      <div className="glass p-5 rounded-3xl shadow-lg border border-surface">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">{registration.eventTitle}</h3>
            <p className="text-sm text-theme-weak">Ticket ID: {registration.ticketId}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-sm font-medium">{registration.ticketType || 'General Admission'}</span>
            <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm">{registration.price || 'Free'}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm text-theme-weak">
              <div>
                <div className="font-semibold text-white">Date</div>
                <div>{formatDate(eventDate)}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Time</div>
                <div>{formatTime(eventTime)}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Venue</div>
                <div>{venue}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Organizer</div>
                <div>{organizerName}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-theme-weak">
              <div>
                <div className="font-semibold text-white">Name</div>
                <div>{userName}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Email</div>
                <div>{registration.email}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Registration</div>
                <div>{formatDate(registrationDate)}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Status</div>
                <span className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-sm font-medium text-white">Valid</span>
              </div>
            </div>

            <div className="mt-3">
              <img src={qrUrl} alt="Ticket QR" className="max-w-[200px] rounded-xl border border-surface bg-surface-soft" />
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-between gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 text-white shadow-inner shadow-black/20">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">EventHub Ticket</div>
              <h4 className="mt-4 text-2xl font-semibold">{registration.eventTitle}</h4>
              <p className="mt-3 text-sm text-slate-300">A professional PDF ticket will be generated with event details and QR code.</p>
            </div>

            <button
              type="button"
              onClick={() => downloadTicketPdf({
                ...registration,
                eventBanner: bannerUrl,
                eventDate,
                eventTime,
                eventLocation: venue,
                organizerName,
                userName,
                registrationDate,
                qrUrl,
              }, captureRef.current)}
              className="mt-auto rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Download Ticket
            </button>
          </div>
        </div>
      </div>

      <div
        ref={captureRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '1122px',
          padding: '32px',
          backgroundColor: '#0f172a',
          pointerEvents: 'none',
          opacity: 1,
          visibility: 'visible',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <div style={{ width: '1050px', borderRadius: '30px', overflow: 'hidden', backgroundColor: '#020617', boxShadow: '0 40px 120px rgba(15,23,42,.25)' }}>
          <div style={{ padding: '40px', background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>EventHub</div>
                <div style={{ fontSize: '14px', marginTop: '6px', color: 'rgba(255,255,255,.8)' }}>Official Event Ticket</div>
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', background: 'rgba(255,255,255,0.12)', padding: '10px 14px', borderRadius: '999px' }}>Valid</div>
            </div>

            {bannerUrl ? (
              <img src={bannerUrl} alt="Event Banner" style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '24px', marginTop: '28px' }} crossOrigin="anonymous" />
            ) : (
              <div style={{ marginTop: '28px', height: '260px', borderRadius: '24px', background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.6)', fontSize: '16px' }}>
                Event banner unavailable
              </div>
            )}
          </div>

          <div style={{ padding: '40px', backgroundColor: '#020617' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}>Event Name</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginTop: '10px' }}>{registration.eventTitle}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}>Event Date</div>
                <div style={{ fontSize: '20px', color: '#fff', marginTop: '10px' }}>{formatDate(eventDate)}</div>
                <div style={{ fontSize: '14px', color: '#c7d2fe', marginTop: '4px' }}>{formatTime(eventTime)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '20px', marginTop: '30px' }}>
              <div style={{ padding: '22px', borderRadius: '22px', background: '#111827' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Venue</div>
                <div style={{ marginTop: '10px', color: '#fff' }}>{venue}</div>
              </div>
              <div style={{ padding: '22px', borderRadius: '22px', background: '#111827' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Organizer</div>
                <div style={{ marginTop: '10px', color: '#fff' }}>{organizerName}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '20px', marginTop: '30px' }}>
              <div style={{ padding: '22px', borderRadius: '22px', background: '#111827' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Attendee</div>
                <div style={{ marginTop: '10px', color: '#fff' }}>{userName}</div>
                <div style={{ marginTop: '6px', color: '#c7d2fe', fontSize: '14px' }}>{registration.email}</div>
              </div>
              <div style={{ padding: '22px', borderRadius: '22px', background: '#111827' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Ticket</div>
                <div style={{ marginTop: '10px', color: '#fff', fontSize: '18px', fontWeight: 700 }}>{registration.ticketType || 'General Admission'}</div>
                <div style={{ marginTop: '6px', color: '#c7d2fe', fontSize: '14px' }}>ID: {registration.ticketId}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px', marginTop: '30px' }}>
              <div style={{ padding: '22px', borderRadius: '22px', background: '#111827' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Registration</div>
                <div style={{ marginTop: '10px', color: '#fff' }}>{formatDate(registrationDate)}</div>
              </div>
              <div style={{ padding: '22px', borderRadius: '22px', background: '#111827', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={qrUrl} alt="QR code" style={{ width: '160px', height: '160px' }} crossOrigin="anonymous" />
              </div>
            </div>
          </div>

          <div style={{ padding: '28px 40px 40px', backgroundColor: '#0b1121' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Note</div>
            <p style={{ marginTop: '12px', color: '#cbd5e1', lineHeight: 1.7 }}>
              This ticket is generated by EventHub. Please present this QR code at the event entrance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketCard
