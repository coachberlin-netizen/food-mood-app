import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/receta-gratis?mood=activacion
 * Returns 1 random free recipe (premium_level = 0) matching the mood.
 */
export async function GET(req: NextRequest) {
  try {
    const RECETAS_SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const RECETAS_SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!RECETAS_SUPABASE_URL || !RECETAS_SUPABASE_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const mood = searchParams.get('mood')

    if (!mood) {
      return NextResponse.json({ error: 'Missing mood parameter' }, { status: 400 })
    }

    const supabase = createClient(RECETAS_SUPABASE_URL, RECETAS_SUPABASE_KEY)

    // Map short mood id to search keyword
    const MOOD_KEYWORD: Record<string, string> = {
      activacion: 'Activaci',
      calma: 'Calma',
      focus: 'Focus',
      social: 'Social',
      reset: 'Reset',
      confort: 'Confort',
    }

    const keyword = MOOD_KEYWORD[mood] || mood

    // Get total count of matching free recipes (premium_level = 0, adulto segment)
    const { count } = await supabase
      .from('recetas')
      .select('*', { count: 'exact', head: true })
      .ilike('mood_es', `%${keyword}%`)
      .eq('premium_level', 0)
      .eq('segmento', 'adulto')

    if (!count || count === 0) {
      return NextResponse.json({ error: 'No recipes found for this mood' }, { status: 404 })
    }

    // Pick random offset
    const offset = Math.floor(Math.random() * count)

    const { data: receta, error } = await supabase
      .from('recetas')
      .select('*')
      .ilike('mood_es', `%${keyword}%`)
      .eq('premium_level', 0)
      .eq('segmento', 'adulto')
      .range(offset, offset)
      .single()

    if (error || !receta) {
      return NextResponse.json({ error: 'No recipe found' }, { status: 404 })
    }

    return NextResponse.json({ receta })
  } catch (err) {
    console.error('API /api/receta-gratis error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
