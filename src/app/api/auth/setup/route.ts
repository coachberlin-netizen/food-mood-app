import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { session_id, password } = await req.json()

    if (!session_id || !password) {
      return NextResponse.json({ error: 'Faltan parámetros de seguridad' }, { status: 400 })
    }

    // 1. Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id)
    
    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json({ error: 'No se dectectó el pago de la sesión' }, { status: 400 })
    }

    const email = session.customer_details?.email || session.customer_email
    if (!email) {
      return NextResponse.json({ error: 'No se encontró un email asociado al pago' }, { status: 400 })
    }

    // 2. Initialize Supabase Admin to bypass RLS and set password
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY

    if (!supabaseUrl || !serviceKey) {
      console.error('[auth/setup] Missing env vars — SUPABASE_SERVICE_ROLE_KEY not set in Vercel')
      return NextResponse.json(
        { error: 'Error de configuración del servidor. Contacta a soporte: falta SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // 3. Find the user by email — use getUserByEmail to avoid pagination issues
    const { data: matchData, error: lookupError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    if (lookupError) {
      console.error('[auth/setup] listUsers error:', lookupError)
      return NextResponse.json({ error: `Error buscando usuario: ${lookupError.message}` }, { status: 500 })
    }

    const match = matchData?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!match) {
      // The webhook hasn't fired yet or failed. Create the user right now since we know they paid.
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      })

      if (createError || !newUser?.user) {
        return NextResponse.json({ error: `Error creando usuario: ${createError?.message}` }, { status: 500 })
      }
      
      // Update profile to premium immediately
      await supabaseAdmin
        .from('profiles')
        .upsert({ 
          id: newUser.user.id, 
          is_premium: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      return NextResponse.json({ success: true, email })
    }

    // If user already exists (shadow account from webhook, or previous free account), update their password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(match.id, {
      password: password,
      email_confirm: true
    })

    if (updateError) {
      return NextResponse.json({ error: `Error asignando credenciales: ${updateError.message}` }, { status: 500 })
    }

    // Make sure profile marks them as premium just in case webhook was slow
    await supabaseAdmin
      .from('profiles')
      .upsert({ 
        id: match.id, 
        is_premium: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })

    return NextResponse.json({ success: true, email })
  } catch (err: any) {
    const msg = err?.message ?? String(err)
    console.error('[auth/setup] Unhandled error:', msg)
    return NextResponse.json({ error: `Error configurando el alta: ${msg}` }, { status: 500 })
  }
}
