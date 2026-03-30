import { generateRecipeForMood } from '@/lib/claude'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { moodId, moodName, userEmail } = await req.json()
    
    if (!moodId || !moodName) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const supabase = await createClient()
    const now = new Date()
    // e.g. "3-2026"
    const monthYear = `${now.getMonth() + 1}-${now.getFullYear()}`
    
    let excludedTitles = ''

    // Si el usuario está logueado, traemos su historial de este mes para EVITAR REPETIDOS
    if (userEmail) {
      const { data: pastRecipes } = await supabase
        .from('recipe_history')
        .select('recipe_title')
        .eq('user_email', userEmail)
        .eq('month_year', monthYear)
        
      if (pastRecipes && pastRecipes.length > 0) {
        excludedTitles = pastRecipes.map(r => r.recipe_title).join(', ')
      }
    }

    // Claude genera la receta asegurando no repetir los títulos
    const recipe = await generateRecipeForMood(moodId, moodName, excludedTitles)
    
    // Le asignamos un ID aleatorio en formato string
    recipe.id = `ai-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Si está logueado, GUARDAMOS en el Historial
    if (userEmail) {
      const { error: insertError } = await supabase
        .from('recipe_history')
        .insert({
          user_email: userEmail,
          mood_id: moodId,
          recipe_id: recipe.id, // String uuid or text
          recipe_title: recipe.title,
          recipe_content: recipe,
          month_year: monthYear
        })

      if (insertError) {
        console.error('Error insertando en historial Supabase:', insertError)
        // No rompemos porque la receta sí se generó
      }
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error generando receta:', error)
    return NextResponse.json({ error: 'Error interno generando la receta' }, { status: 500 })
  }
}
