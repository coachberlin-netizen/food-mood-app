import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { RECIPE_COLUMNS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

// Maps incoming mood nombre (from moods.ts) → DB mood_es substring.
// Only entries that diverge from the actual DB value are listed.
const MOOD_TO_DB: Record<string, string> = {
  'Restauración': 'Reset',  // DB stores "Reset & Ligereza"
  'Foco':         'Focus',  // DB stores "Focus & Claridad Mental"
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = req.nextUrl

    const mood         = searchParams.get('mood')
    const tiempo       = searchParams.get('tiempo')
    const temporada    = searchParams.get('temporada')
    const qText        = searchParams.get('q')
    const segmento     = searchParams.get('segmento')
    const premiumLevel = searchParams.get('premium_level')
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1',  10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)))
    const from  = (page - 1) * limit
    const to    = from + limit - 1

    // Resolve the correct DB substring for the mood
    const dbMood = mood ? (MOOD_TO_DB[mood] ?? mood) : null

    // ── Primary query ─────────────────────────────────────────────────────────
    let query: any = supabase.from('recetas').select(RECIPE_COLUMNS, { count: 'exact' })

    if (dbMood)        query = query.ilike('mood_es', `%${dbMood}%`)
    if (tiempo)        query = query.lte('tiempo_preparacion_min', parseInt(tiempo, 10))
    if (temporada)     query = query.ilike('temporada', `%${temporada}%`)
    if (qText)         query = query.or(`nombre_es.ilike.%${qText}%,tipo_plato.ilike.%${qText}%`)
    if (segmento)      query = query.eq('segmento', segmento)
    if (premiumLevel !== null) query = query.eq('premium_level', parseInt(premiumLevel, 10))

    query = query.order('id', { ascending: true }).range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // ── Fallback: mood specified but zero results → return general recipes ─────
    // Ensures the user always sees something after the quiz.
    if (mood && (!data || data.length === 0)) {
      let fb: any = supabase.from('recetas').select(RECIPE_COLUMNS, { count: 'exact' })

      if (segmento)      fb = fb.eq('segmento', segmento)
      if (premiumLevel !== null) fb = fb.eq('premium_level', parseInt(premiumLevel, 10))

      fb = fb.order('id', { ascending: true }).range(0, limit - 1)

      const { data: fbData, count: fbCount, error: fbErr } = await fb

      if (!fbErr) {
        return NextResponse.json({
          recetas:    fbData ?? [],
          total:      fbCount ?? 0,
          page:       1,
          totalPages: Math.ceil((fbCount ?? 0) / limit),
          isFallback: true,
        })
      }
    }

    return NextResponse.json({
      recetas:    data ?? [],
      total:      count ?? 0,
      page,
      totalPages: Math.ceil((count ?? 0) / limit),
      isFallback: false,
    })

  } catch (err: any) {
    console.error('API /api/recetas error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: err?.message || String(err) },
      { status: 500 }
    )
  }
}
