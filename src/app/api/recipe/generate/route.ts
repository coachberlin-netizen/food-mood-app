import { generateRecipeForMood } from '@/lib/claude'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { moodId, moodName } = await req.json()
    
    if (!moodId || !moodName) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const recipe = await generateRecipeForMood(moodId, moodName)
    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error generando receta:', error)
    return NextResponse.json({ error: 'Error interno generando la receta' }, { status: 500 })
  }
}
