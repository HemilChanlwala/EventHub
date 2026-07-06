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
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgProps = pdf.getImageProperties(imgData)
    const imgWidth = pageWidth
    const imgHeight = Math.min((imgProps.height * pageWidth) / imgProps.width, pageHeight)

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

    const filename = `${safeFilename(registration.eventTitle || 'EventHub')}-${safeFilename(registration.ticketId || 'ticket')}.pdf`
    pdf.save(filename)
  } catch (err) {
    console.error('downloadTicketPdf error', err)
  }
}

export default {
  downloadTicketPdf,
}
