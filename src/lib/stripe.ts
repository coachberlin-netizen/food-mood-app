import logger from "@/lib/logger"
import Stripe from 'stripe'

// .trim() prevents whitespace / \r\n corruption from env dashboards
const apiKey = process.env.STRIPE_SECRET_KEY?.trim()

if (!apiKey) {
  logger.warn('⚠️ WARNING: STRIPE_SECRET_KEY is not defined in environment variables.')
}

export const stripe = new Stripe(apiKey || '', {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
})
