import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ code: z.string().min(1) })

const COOKIE  = 'newsletter_access'
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
    return NextResponse.json({ error: 'Petición inválida.' }, { status: 400 })
  }

  const expected = process.env.NEWSLETTER_ACCESS_CODE
  if (!expected) {
    return NextResponse.json({ error: 'Acceso no configurado.' }, { status: 500 })
  }

  if (parsed.data.code !== expected) {
    return NextResponse.json({ error: 'Código incorrecto.' }, { status: 401 })
  }

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
