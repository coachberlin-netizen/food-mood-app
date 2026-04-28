import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'
import type { OracleInput } from '@/lib/oracle'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' })

const SYSTEM = `Eres el Oráculo de Food·Mood, una app de bienestar nutricional basada en la ciencia intestino-cerebro.
Hablas en español con calidez, inteligencia y estética editorial de lujo.
Valores de marca: nutrir, equilibrio, vitalidad, placer.
NUNCA uses: dieta, restricción, detox, culpa, calorías, adelgazar, bajar de peso.
No eres médico. Toda orientación es nutricional y de estilo de vida.
Lenguaje prudente: "parece", "apunta a", "observamos", "podría".
Escribe en 3-4 frases fluidas, sin listas ni bullets. Prosa continua.`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isPremium = await getPremiumStatus(supabase, user.id)
  if (!isPremium) return NextResponse.json({ error: 'Premium required' }, { status: 403 })

  const { input }: { input: OracleInput } = await req.json()

  // Last 6 previous check-ins (skip index 0 = current session)
  const { data: history } = await supabase
    .from('oracle_checkins')
    .select('created_at, primary_emotion, secondary_emotion, energy_level, sleep_quality, primary_symptom, recipe_mood_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(1, 6)

  const historyText = history && history.length > 0
    ? history.map(c => {
        const d = new Date(c.created_at).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
        const emo = c.secondary_emotion ? `${c.primary_emotion}+${c.secondary_emotion}` : c.primary_emotion
        const sym = c.primary_symptom ? `, ${c.primary_symptom}` : ''
        const need = c.recipe_mood_id ? ` → ${c.recipe_mood_id}` : ''
        return `• ${d}: ${emo}, energía ${c.energy_level}/10, sueño ${c.sleep_quality}/5${sym}${need}`
      }).join('\n')
    : 'Sin historial previo registrado.'

  const todayText = [
    `Emoción: ${input.emotions[0]}${input.emotions[1] ? ' + ' + input.emotions[1] : ''}`,
    `Energía: ${input.energyLevel}/10`,
    `Sueño: ${input.sleepQuality}/5`,
    input.primarySymptom ? `Síntoma: ${input.primarySymptom}` : null,
    input.cravingState   ? `Antojo: ${input.cravingState}`    : null,
    input.cyclePhase     ? `Ciclo: ${input.cyclePhase}`       : null,
    input.notes          ? `Nota: "${input.notes}"`           : null,
  ].filter(Boolean).join('\n')

  const userPrompt = `Historial reciente:\n${historyText}\n\nCheck-in de hoy:\n${todayText}\n\nEscribe una lectura personalizada de 3-4 frases que: reconozca el estado de hoy con empatía, mencione si hay un patrón relevante del historial (solo si lo hay), y sugiera una dirección nutricional concreta y placentera. Interpreta, no repitas los datos en bruto.`

  try {
    const message = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 320,
      system:     SYSTEM,
      messages:   [{ role: 'user', content: userPrompt }],
    })

    const reading = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    return NextResponse.json({ reading })
  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
