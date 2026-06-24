import { useState, useRef, useEffect } from 'react'

const CheckIn = () => {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef(null)
  const qrRegionId = 'qr-reader'

  const persistRegs = (regs) => {
    try {
      localStorage.setItem('eventhub_registrations', JSON.stringify(regs))
    } catch (err) { void err }
  }

  const checkInById = (ticketId) => {
    try {
      const regs = JSON.parse(localStorage.getItem('eventhub_registrations') || '[]')
      const found = regs.find(r => String(r.ticketId) === String(ticketId))
      if (!found) {
        setResult({ ok: false, msg: 'Ticket not found' })
        return false
      }
      if (found.checkedIn) {
        setResult({ ok: false, msg: `Already checked in at ${found.checkInAt}` })
        return false
      }
      found.checkedIn = true
      found.checkInAt = new Date().toISOString()
      const others = regs.filter(r => r.ticketId !== ticketId)
      others.push(found)
      persistRegs(others)
      setResult({ ok: true, msg: `Checked in ${found.name} — ${found.ticketId}` })
      return true
    } catch (err) {
      void err
      setResult({ ok: false, msg: 'Error processing' })
      return false
    }
  }

  const check = (e) => {
    e.preventDefault()
    if (!code) return
    checkInById(code)
  }

  const handleDecoded = (decodedText) => {
    if (!decodedText) return
    // QR content may be percent-encoded JSON, plain JSON, or just the ticket id
    let ticketId = decodedText
    try {
      // try decodeURIComponent then parse JSON
      const maybe = decodeURIComponent(decodedText)
      try {
        const parsed = JSON.parse(maybe)
        ticketId = parsed.ticketId || parsed.ticket || ticketId
      } catch (err) {
        void err
        // not JSON, maybe the decoded string is the ticket id
        ticketId = maybe
      }
    } catch (err) {
      void err
      try {
        const parsed = JSON.parse(decodedText)
        ticketId = parsed.ticketId || parsed.ticket || ticketId
      } catch (err2) {
        void err2
        // leave as-is
      }
    }

    const ok = checkInById(ticketId)
    if (ok) stopScanner()
  }

  const startScanner = async () => {
    setResult(null)
    setScanning(true)
    try {
      const module = await import('html5-qrcode')
      const Html5Qrcode = module.Html5Qrcode || module.default || module
      const html5QrCode = new Html5Qrcode(qrRegionId)
      scannerRef.current = html5QrCode
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decoded) => handleDecoded(decoded)
      )
    } catch (err) {
      console.warn('QR start error', err)
      setResult({ ok: false, msg: 'Camera not available or permission denied' })
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (!scannerRef.current) { setScanning(false); return }
    try {
      await scannerRef.current.stop()
      await scannerRef.current.clear()
    } catch (err) { void err }
    scannerRef.current = null
    setScanning(false)
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(()=>{})
        scannerRef.current.clear().catch(()=>{})
      }
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Organizer Check-In</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={check} className="space-y-4">
            <label className="text-sm text-gray-300">Manual Ticket ID</label>
            <input placeholder="Ticket ID (e.g. EVT-1-123456)" value={code} onChange={e=>setCode(e.target.value)} className="w-full p-3 border rounded bg-transparent" />
            <div className="flex justify-end"><button className="px-4 py-2 bg-indigo-600 text-white rounded">Check In</button></div>
          </form>

          {result && (
            <div className={`mt-4 p-3 rounded ${result.ok ? 'bg-green-600/20' : 'bg-red-600/20'}`}>{result.msg}</div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Scan QR</div>
            <div>
              {!scanning ? (
                <button onClick={startScanner} className="px-3 py-1 bg-indigo-600 text-white rounded">Open Camera</button>
              ) : (
                <button onClick={stopScanner} className="px-3 py-1 border rounded">Stop</button>
              )}
            </div>
          </div>
          <div id={qrRegionId} className="w-full h-64 bg-gray-900 rounded flex items-center justify-center text-gray-400">
            {!scanning && <div className="text-sm">Camera inactive</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckIn
