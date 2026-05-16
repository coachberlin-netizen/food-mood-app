import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const authed = cookieStore.get('inv_auth')?.value === 'true'
  if (authed) return NextResponse.json({ ok: true })
  return NextResponse.json({ ok: false }, { status: 401 })
}
