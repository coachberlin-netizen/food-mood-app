import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ code: z.string().min(1) })

const COOKIE  = 'protocolos_access'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 días

export async function POST(request: Request) {
  const body   = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Petición inválida.' }, { status: 400 })
  }

  const expected = process.env.PROTOCOLOS_ACCESS_CODE
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
