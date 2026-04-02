import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const RECETAS_SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const RECETAS_SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!RECETAS_SUPABASE_URL || !RECETAS_SUPABASE_KEY) {
      console.error('[recetas-api] Missing Supabase env vars:', { url: !!RECETAS_SUPABASE_URL, key: !!RECETAS_SUPABASE_KEY })
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { searchParams } = req.nextUrl

    // ── Parse query params ────────────────────────────────────
    const sexo = searchParams.get('sexo')          // "mujer" | "hombre"
    const edad = searchParams.get('edad')           // "18-30" | "31-44" | "45-60" | "60+"
    const mood = searchParams.get('mood')           // mood name string
    const tiempo = searchParams.get('tiempo')       // max prep minutes
    const temporada = searchParams.get('temporada') // season string
    const q = searchParams.get('q')                 // free text search
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)))

    // ── Build Supabase query ──────────────────────────────────
    const supabase = createClient(RECETAS_SUPABASE_URL, RECETAS_SUPABASE_KEY)

    let query = supabase
      .from('recetas')
      .select('*', { count: 'exact' })

    // Apply filters only when present
    if (sexo) {
      query = query.eq('sexo', sexo)
    }

    if (edad) {
      query = query.eq('grupo_edad', edad)
    }

    if (mood) {
      query = query.ilike('mood_es', `%${mood}%`)
    }

    if (tiempo) {
      const maxMin = parseInt(tiempo, 10)
      if (!isNaN(maxMin)) {
        query = query.lte('tiempo_preparacion_min', maxMin)
      }
    }

    if (temporada) {
      query = query.ilike('temporada', `%${temporada}%`)
    }

    if (q) {
      query = query.or(
        `nombre_es.ilike.%${q}%,tipo_plato.ilike.%${q}%`
      )
    }

    // Filter by segmento (adulto / kids)
    const segmento = searchParams.get('segmento')
    if (segmento) {
      query = query.eq('segmento', segmento)
    }

    // Filter by premium_level (0=free, 1=kids, 2=michelin)
    const premiumLevel = searchParams.get('premium_level')
    if (premiumLevel !== null) {
      query = query.eq('premium_level', parseInt(premiumLevel, 10))
    }

    // ── Pagination ────────────────────────────────────────────
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query
      .order('id', { ascending: true })
      .range(from, to)

    // ── Execute ───────────────────────────────────────────────
    console.log('[recetas-api] filters:', { sexo, edad, mood, tiempo, temporada, q, segmento, premiumLevel, page, limit })
    const { data, error, count } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log(`[recetas-api] results: ${count} total, ${data?.length || 0} returned`)

    const total = count ?? 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      recetas: data,
      total,
      page,
      totalPages,
    })

  } catch (err: any) {
    console.error('API /api/recetas error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: err?.message || String(err) },
      { status: 500 }
    )
  }
}
