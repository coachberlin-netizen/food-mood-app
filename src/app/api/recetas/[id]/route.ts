import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const RECETAS_SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const RECETAS_SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(RECETAS_SUPABASE_URL, RECETAS_SUPABASE_KEY)

    // Fetch the recipe
    const { data: receta, error } = await supabase
      .from('recetas')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !receta) {
      return NextResponse.json(
        { error: 'Receta no encontrada' },
        { status: 404 }
      )
    }

    // Fetch 3 related recipes (same mood + grupo_edad, excluding current)
    const { data: relacionadas } = await supabase
      .from('recetas')
      .select('id, nombre_es, mood_es, tiempo_preparacion_min, tipo_plato, dificultad, temporada')
      .eq('mood_es', receta.mood_es)
      .eq('grupo_edad', receta.grupo_edad)
      .neq('id', receta.id)
      .limit(3)

    return NextResponse.json({
      receta,
      relacionadas: relacionadas || [],
    })
  } catch (err) {
    console.error('API /api/recetas/[id] error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
