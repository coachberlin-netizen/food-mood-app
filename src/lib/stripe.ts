import Stripe from 'stripe'

// .trim() prevents whitespace / \r\n corruption from env dashboards
const apiKey = process.env.STRIPE_SECRET_KEY?.trim()

if (!apiKey) {
  console.warn('⚠️ WARNING: STRIPE_SECRET_KEY is not defined in environment variables.')
}

export const stripe = new Stripe(apiKey || '', {
  apiVersion: '2024-06-20',
  typescript: true,
})
