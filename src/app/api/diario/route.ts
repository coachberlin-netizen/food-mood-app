import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const MOOD_COLORS: Record<string, string> = {
  activacion: '#E8A87C',
  calma:      '#7EC8C8',
  focus:      '#F4E285',
  social:     '#F4A7B9',
  reset:      '#B8A9C9',
  confort:    '#D4A574',
}

// GET /api/diario?days=30   → last N diary entries for the user
// GET /api/diario?date=YYYY-MM-DD → single entry for that date
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const date = searchParams.get('date')

  if (date) {
    const { data, error } = await supabase
      .from('diario_entradas')
      .select('*')
      .eq('user_id', user.id)
      .eq('fecha', date)
      .maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ entrada: data })
  }

  const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') || '30', 10)))
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from('diario_entradas')
    .select('*')
    .eq('user_id', user.id)
    .gte('fecha', since.toISOString().split('T')[0])
    .order('fecha', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entradas: data ?? [] })
}

// POST /api/diario → upsert one diary entry (by fecha)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { fecha, mood_id, estado_libre, comida_libre, sueno_horas, ciclo_info, nota_libre } = body

  if (!fecha) return NextResponse.json({ error: 'fecha requerida' }, { status: 400 })

  // Upsert into diario_entradas
  const { data: entrada, error } = await supabase
    .from('diario_entradas')
    .upsert(
      { user_id: user.id, fecha, mood_id, estado_libre, comida_libre, sueno_horas, ciclo_info, nota_libre },
      { onConflict: 'user_id,fecha' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mirror mood into emotional_palettes so the week/month visualizations still work
  if (mood_id && MOOD_COLORS[mood_id]) {
    await supabase.from('emotional_palettes').upsert(
      {
        user_id:         user.id,
        session_date:    fecha,
        mood_dominante:  mood_id,
        mood_secundario: mood_id,
        color_resultado: MOOD_COLORS[mood_id],
        energia:         5,
        serenidad:       5,
        claridad:        5,
        conexion:        5,
      },
      { onConflict: 'user_id,session_date' }
    )
  }

  return NextResponse.json({ entrada })
}
