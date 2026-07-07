import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const safeFilename = (text = '') => String(text)
  .replace(/[\\/:*?"<>|]/g, '')
  .replace(/\s+/g, '-')
  .replace(/_+/g, '-')
  .trim()

export async function downloadTicketPdf(registration = {}, captureElement = null) {
  try {
    if (!captureElement) {
      console.warn('downloadTicketPdf: capture element is required')
      return
    }

    const canvas = await html2canvas(captureElement, {
      scale: Math.min(1.25, window.devicePixelRatio || 1),
      useCORS: true,
      backgroundColor: '#0f172a',
      logging: false,
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.78)
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4', compress: true })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 24
    const maxWidth = pageWidth - margin * 2
    const maxHeight = pageHeight - margin * 2

    const imgProps = pdf.getImageProperties(imgData)
    const ratio = Math.min(maxWidth / imgProps.width, maxHeight / imgProps.height)
    const imgWidth = imgProps.width * ratio
    const imgHeight = imgProps.height * ratio
    const x = (pageWidth - imgWidth) / 2
    const y = (pageHeight - imgHeight) / 2

    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST')

    const filename = `${safeFilename(registration.eventTitle || 'EventHub')}-${safeFilename(registration.ticketId || 'ticket')}.pdf`
    pdf.save(filename)
  } catch (err) {
    console.error('downloadTicketPdf error', err)
  }
}

export default {
  downloadTicketPdf,
}
