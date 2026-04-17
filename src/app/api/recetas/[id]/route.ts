import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Fetch the recipe
    const { data: receta, error } = await supabase
      .from('recetas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !receta) {
      return NextResponse.json(
        { error: 'Receta no encontrada' },
        { status: 404 }
      )
    }

    // 🛡️ Security Check: Validate premium access on the backend
    if (receta.premium_level && receta.premium_level > 0) {
      const { data: { user } } = await supabase.auth.getUser()
      const isPremium = user ? await getPremiumStatus(supabase, user.id) : false
      
      if (!isPremium) {
        return NextResponse.json(
          { error: 'Acceso Denegado: Esta receta requiere una suscripción Premium activa.' },
          { status: 403 }
        )
      }
    }

    // Fetch 3 related recipes (same mood + grupo_edad, excluding current)
    const { data: relacionadas } = await supabase
      .from('recetas')
      .select('id, nombre_es, mood_es, tiempo_preparacion_min, tipo_plato, dificultad, temporada')
      .eq('mood_es', receta.mood_es)
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
