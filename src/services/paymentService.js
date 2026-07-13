const PAYMENT_CREATE_ORDER_URL = '/api/payment/create-order'
const PAYMENT_VERIFY_URL = '/api/payment/verify'

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Request failed'
    throw new Error(message)
  }

  return payload
}

export const createRazorpayOrder = async ({ eventId, amount, currency = 'INR' }) => {
  return requestJson(PAYMENT_CREATE_ORDER_URL, {
    method: 'POST',
    body: JSON.stringify({ eventId, amount, currency }),
  })
}

export const verifyRazorpayPayment = async ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  eventId,
  userId,
  amount,
}) => {
  return requestJson(PAYMENT_VERIFY_URL, {
    method: 'POST',
    body: JSON.stringify({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      eventId,
      userId,
      amount,
    }),
  })
}
