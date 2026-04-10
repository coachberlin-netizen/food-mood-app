import Stripe from 'stripe'

const apiKey = process.env.STRIPE_SECRET_KEY

if (!apiKey) {
  console.warn('⚠️ WARNING: STRIPE_SECRET_KEY is not defined in environment variables.')
}

export const stripe = new Stripe(apiKey || '', {
  apiVersion: '2024-06-20', // Use a stable, specific version
  typescript: true,
})
