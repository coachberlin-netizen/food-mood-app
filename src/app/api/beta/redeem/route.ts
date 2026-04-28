import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!code?.trim()) return NextResponse.json({ error: 'Código vacío.' }, { status: 400 })

  const supabaseAdmin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const normalized = code.replace(/[^a-z0-9]/gi, '').toUpperCase()

  // 1. Hardcoded built-in codes (always work)
  const BUILTIN_CODES = ['FOODMOOD2026']
  const isBuiltin = BUILTIN_CODES.includes(normalized)

  // 2. Env var fallback
  const envCode = (process.env.BETA_ACCESS_CODE ?? '').replace(/[^a-z0-9]/gi, '').toUpperCase()
  const isEnvMatch = envCode.length > 0 && normalized === envCode

  // 3. Supabase table (optional — only if table exists)
  let isDbMatch = false
  try {
    const { data } = await supabaseAdmin
      .from('beta_codes')
      .select('code')
      .eq('active', true)
      .ilike('code', normalized)
      .maybeSingle()
    isDbMatch = !!data
  } catch { /* table may not exist yet */ }

  if (!isBuiltin && !isEnvMatch && !isDbMatch) {
    return NextResponse.json({ error: 'Código incorrecto.' }, { status: 400 })
  }

  // Auth: prefer cookie-based session (reliable with SSR); accept Bearer as fallback
  let user = null
  const supabase = await createClient()
  const { data: cookieUser } = await supabase.auth.getUser()
  if (cookieUser.user) {
    user = cookieUser.user
  } else {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '').trim()
    if (token) {
      const { data } = await supabaseAdmin.auth.getUser(token)
      user = data.user
    }
  }
  if (!user) {
    return NextResponse.json({ error: 'Debes iniciar sesión primero.' }, { status: 401 })
  }

  // Use RPC (SECURITY DEFINER) to avoid service-role key dependency
  const { error } = await supabase.rpc('activate_beta_premium')

  if (error) {
    return NextResponse.json({ error: `Error activando acceso: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
