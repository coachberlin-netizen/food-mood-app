import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!code?.trim()) return NextResponse.json({ error: 'Código vacío.' }, { status: 400 })

  const supabaseAdmin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Validate against beta_codes table (case-insensitive, strips non-alphanumeric)
  const normalized = code.replace(/[^a-z0-9]/gi, '').toUpperCase()
  const { data: validCode } = await supabaseAdmin
    .from('beta_codes')
    .select('code')
    .eq('active', true)
    .ilike('code', normalized)
    .maybeSingle()

  if (!validCode) {
    return NextResponse.json({ error: 'Código incorrecto.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Debes iniciar sesión primero.' }, { status: 401 })
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: user.id,
      is_premium: true,
      premium_level: 1,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

  if (error) {
    return NextResponse.json({ error: `Error activando acceso: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
