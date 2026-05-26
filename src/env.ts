import { z } from 'zod'

// ─────────────────────────────────────────
// Server-side env vars (never exposed to browser)
// ─────────────────────────────────────────
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RECETAS_SUPABASE_KEY:      z.string().min(1).optional(),
  RECETAS_SUPABASE_URL:      z.string().url().optional(),

  // AI
  ANTHROPIC_API_KEY: z.string().min(1),
  GOOGLE_AI_API_KEY: z.string().min(1),
  VOYAGE_API_KEY:    z.string().min(1).optional(),

  // Stripe
  STRIPE_SECRET_KEY:          z.string().min(1),
  STRIPE_WEBHOOK_SECRET:      z.string().min(1),
  STRIPE_PRICE_ID:            z.string().optional(),
  STRIPE_PRICE_ID_MONTHLY:    z.string().optional(),
  STRIPE_PRICE_ID_QUARTERLY:  z.string().optional(),
  STRIPE_PRICE_ANNUAL:        z.string().optional(),
  STRIPE_PRICE_MONTHLY:       z.string().optional(),

  // Email
  RESEND_API_KEY:    z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // Push Notifications
  VAPID_PRIVATE_KEY: z.string().min(1),

  // Security
  ENCRYPTION_SECRET: z.string().min(32, 'ENCRYPTION_SECRET debe tener ≥ 32 caracteres'),
  ANALYTICS_SALT:    z.string().min(1).optional(),

  // Admin
  ADMIN_EMAIL:    z.string().email().optional(),
  ADMIN_EMAILS:   z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  FM_ADMIN_EMAILS: z.string().optional(),

  // Cron / jobs
  CRON_SECRET: z.string().optional(),

  // Telegram
  TELEGRAM_BOT_TOKEN:      z.string().optional(),
  TELEGRAM_CHAT_ID:        z.string().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),

  // Wearables
  FITBIT_CLIENT_ID:     z.string().optional(),
  FITBIT_CLIENT_SECRET: z.string().optional(),
  OURA_CLIENT_ID:       z.string().optional(),
  OURA_CLIENT_SECRET:   z.string().optional(),
  WHOOP_CLIENT_ID:      z.string().optional(),
  WHOOP_CLIENT_SECRET:  z.string().optional(),

  // Audio
  ELEVENLABS_API_KEY:  z.string().optional(),
  ELEVENLABS_VOICE_ID: z.string().optional(),

  // Biomarkers
  BIOMARKER_TOKEN_KEY: z.string().optional(),

  // x402 micropayments
  X402_EVM_ADDRESS:      z.string().optional(),
  X402_FACILITATOR_URL:  z.string().url().optional(),
  X402_NETWORK:          z.string().optional(),

  // Misc
  BETA_ACCESS_CODE:    z.string().optional(),
  INVERSORES_PASSWORD: z.string().optional(),
  DATABASE_URL:        z.string().url().optional(),
})

// ─────────────────────────────────────────
// Client-side env vars (NEXT_PUBLIC_ — safe to expose)
// ─────────────────────────────────────────
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:      z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL:           z.string().url(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY:  z.string().min(1),

  NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY:   z.string().optional(),
  NEXT_PUBLIC_STRIPE_PRICE_ID_QUARTERLY: z.string().optional(),

  NEXT_PUBLIC_RECETAS_SUPABASE_URL:      z.string().url().optional(),
  NEXT_PUBLIC_RECETAS_SUPABASE_ANON_KEY: z.string().optional(),

  NEXT_PUBLIC_GA4_ID:     z.string().optional(),
  NEXT_PUBLIC_CLARITY_ID: z.string().optional(),
  NEXT_PUBLIC_SITE_URL:   z.string().url().optional(),
})

// ─────────────────────────────────────────
// Validation
// ─────────────────────────────────────────
function formatErrors(errors: z.ZodFormattedError<unknown>): string {
  return JSON.stringify(errors, null, 2)
}

function validateServerEnv() {
  const result = serverSchema.safeParse(process.env)
  if (!result.success) {
    throw new Error(
      `\n❌ Variables de entorno del servidor inválidas o faltantes:\n${formatErrors(result.error.format())}\n`,
    )
  }
  return result.data
}

function validateClientEnv() {
  const raw = {
    NEXT_PUBLIC_SUPABASE_URL:              process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL:                   process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY:          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY:   process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_ID_QUARTERLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_QUARTERLY,
    NEXT_PUBLIC_RECETAS_SUPABASE_URL:      process.env.NEXT_PUBLIC_RECETAS_SUPABASE_URL,
    NEXT_PUBLIC_RECETAS_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_RECETAS_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_GA4_ID:                    process.env.NEXT_PUBLIC_GA4_ID,
    NEXT_PUBLIC_CLARITY_ID:                process.env.NEXT_PUBLIC_CLARITY_ID,
    NEXT_PUBLIC_SITE_URL:                  process.env.NEXT_PUBLIC_SITE_URL,
  }
  const result = clientSchema.safeParse(raw)
  if (!result.success) {
    throw new Error(
      `\n❌ Variables de entorno del cliente inválidas o faltantes:\n${formatErrors(result.error.format())}\n`,
    )
  }
  return result.data
}

// Server env: only evaluated on the server (Next.js guards this at build time)
export const serverEnv = typeof window === 'undefined'
  ? validateServerEnv()
  : ({} as z.infer<typeof serverSchema>)

// Client env: safe on both server and client
export const clientEnv = validateClientEnv()

// Convenience: merged export for server-side code
export const env = {
  ...serverEnv,
  ...clientEnv,
} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>

export type ServerEnv = z.infer<typeof serverSchema>
export type ClientEnv = z.infer<typeof clientSchema>
export type Env = ServerEnv & ClientEnv
