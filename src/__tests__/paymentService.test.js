import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/paymentService'

describe('payment service', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts to the create-order endpoint', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ order_id: 'order_123', amount: 50000, currency: 'INR', key_id: 'rzp_test' }),
    })

    const result = await createRazorpayOrder({ eventId: 7, amount: 500 })

    expect(global.fetch).toHaveBeenCalledWith('/api/payment/create-order', expect.objectContaining({ method: 'POST' }))
    expect(result).toMatchObject({ order_id: 'order_123' })
  })

  it('posts to the verify endpoint', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })

    const result = await verifyRazorpayPayment({
      razorpay_payment_id: 'pay_1',
      razorpay_order_id: 'order_1',
      razorpay_signature: 'signature',
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/payment/verify', expect.objectContaining({ method: 'POST' }))
    expect(result).toMatchObject({ success: true })
  })
})
