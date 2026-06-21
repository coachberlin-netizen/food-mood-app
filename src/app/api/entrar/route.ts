import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const code = typeof body.code === 'string' ? body.code.trim().toLowerCase() : ''
  const expected = (process.env.BETA_ACCESS_CODE ?? '').trim().toLowerCase()

  if (!expected) {
    // Gate not configured — open access
    const res = NextResponse.json({ ok: true })
    res.cookies.set('fm_preview', 'ok', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return res
  }

  if (!code || code !== expected) {
    return NextResponse.json({ error: 'Código incorrecto.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('fm_preview', 'ok', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
