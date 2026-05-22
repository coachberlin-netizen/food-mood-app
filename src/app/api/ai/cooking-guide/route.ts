import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'

export const dynamic = 'force-dynamic'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const isPremium = await getPremiumStatus(supabase, user.id)
  if (!isPremium) return NextResponse.json({ error: 'premium_required' }, { status: 403 })

  const body = await req.json()
  const { question, recipeName, ingredients, currentStep, currentStepIndex, totalSteps } = body

  if (!question || !recipeName || !currentStep) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  const systemPrompt = `Eres la guía de cocina de Food·Mood. La usuaria está cocinando ahora mismo y tiene las manos ocupadas.

Receta: ${recipeName}
Ingredientes: ${ingredients?.join(', ') ?? 'no especificados'}
Paso actual (${currentStepIndex + 1} de ${totalSteps}): ${currentStep}

Tu misión: responder en 1-3 frases concisas, prácticas y cálidas. Sin listas, sin markdown. Hablas en voz alta. Responde solo a lo que pregunta, con la información de esta receta. Si la pregunta no está relacionada con la receta, redirige amablemente.`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: systemPrompt,
    messages: [{ role: 'user', content: question }],
  })

  const answer = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ answer })
}
