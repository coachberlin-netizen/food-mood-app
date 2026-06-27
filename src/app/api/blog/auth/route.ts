import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import logger from '@/lib/logger'

const schema = z.object({
  email: z.string().email().max(254),
})

const COOKIE  = 'blog_access'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 días

// Rate limit: 5 intentos por IP por hora
const rateLimit = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  const ip    = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now   = Date.now()
  const entry = rateLimit.get(ip)
  if (entry && now < entry.resetAt) {
    if (entry.count >= 5) {
      return NextResponse.json({ error: 'Demasiados intentos. Inténtalo más tarde.' }, { status: 429 })
    }
    entry.count++
  } else {
    rateLimit.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
  }

  const body   = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
  }

  const { email } = parsed.data

  // Guarda el lead (best-effort, no bloquea el acceso)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    await supabase.from('leads').upsert(
      { email: email.toLowerCase().trim(), source: 'blog-acceso', created_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: true },
    )
  } catch (err) {
    logger.error({ err }, 'blog/auth: lead upsert error')
  }

  // Concede acceso al blog
  const cookieStore = await cookies()
  cookieStore.set(COOKIE, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path:     '/',
    maxAge:   MAX_AGE,
    secure:   process.env.NODE_ENV === 'production',
  })

  return NextResponse.json({ ok: true })
}
