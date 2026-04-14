import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const mood = searchParams.get('mood')

    const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    let query = supabase
      .from('recetas')
      .select('*')
      .eq('premium_level', 0)
      .limit(50) // Limit to a large enough pool for randomness

    if (mood) {
      // Use ilike since mood might come in differently cased or formatted
      query = query.ilike('mood_es', `%${mood}%`)
    }

    const { data: recetas, error } = await query

    if (error) {
      console.error('Database error in receta-gratis:', error)
      return NextResponse.json({ error: 'Error fetching recipes' }, { status: 500 })
    }

    if (!recetas || recetas.length === 0) {
      return NextResponse.json({ error: 'No free recipes found for this mood' }, { status: 404 })
    }

    // Pick a random free recipe from the fetched ones
    const randomIndex = Math.floor(Math.random() * recetas.length)
    const selectedReceta = recetas[randomIndex]

    return NextResponse.json({ receta: selectedReceta })
  } catch (err) {
    console.error('API /api/receta-gratis error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
