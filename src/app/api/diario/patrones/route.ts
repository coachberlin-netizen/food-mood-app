import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key missing' }, { status: 500 })

  // Fetch last 21 diary entries
  const since = new Date()
  since.setDate(since.getDate() - 21)

  const { data: entradas, error } = await supabase
    .from('diario_entradas')
    .select('fecha, mood_id, estado_libre, comida_libre, sueno_horas, ciclo_info, nota_libre')
    .eq('user_id', user.id)
    .gte('fecha', since.toISOString().split('T')[0])
    .order('fecha', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!entradas || entradas.length < 5) {
    return NextResponse.json({ insuficiente: true, minimo: 5, actual: entradas?.length ?? 0 })
  }

  const formatted = entradas.map(e => {
    const parts: string[] = [`[${e.fecha}]`]
    if (e.mood_id)      parts.push(`Color: ${e.mood_id}`)
    if (e.estado_libre) parts.push(`Estado: "${e.estado_libre}"`)
    if (e.comida_libre) parts.push(`Comida: "${e.comida_libre}"`)
    if (e.sueno_horas)  parts.push(`Sueño: ${e.sueno_horas}h`)
    if (e.ciclo_info)   parts.push(`Ciclo: ${e.ciclo_info}`)
    if (e.nota_libre)   parts.push(`Nota: "${e.nota_libre}"`)
    return parts.join(' · ')
  }).join('\n')

  const prompt = `Eres analista de patrones de bienestar para la app Food·Mood (psiconutrición, eje intestino-cerebro).

A continuación tienes el diario de los últimos días de una usuaria. Cada línea es una entrada.

DIARIO:
${formatted}

Tu tarea: detectar 2 o 3 patrones concretos que la usuaria sola no vería.
Un patrón válido es una correlación que aparece al menos 3 veces: poco sueño → ciertos estados, cenas tardías → peor mañana siguiente, proteína → mejor foco, variedad alimentaria → más calma, etc.

Reglas:
- Solo patrones que tengan suficiente evidencia en los datos. Si no hay datos claros, di menos patrones.
- La observación debe ser específica y citar la evidencia real de los datos.
- La pregunta debe ser suave, no prescriptiva. Jamás uses "deberías" ni "tienes que".
- Usa el nombre de los moods en español: Activación, Calma, Foco, Social, Restauración, Confort.
- Responde SOLO con JSON válido, sin markdown, sin explicaciones fuera del JSON.

Formato exacto:
{"patrones":[{"observacion":"...","pregunta":"...","confianza":"alta"}]}`

  const anthropic = new Anthropic({ apiKey })
  const response = await anthropic.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages:   [{ role: 'user', content: prompt }],
  })

  const raw = response.content.filter(b => b.type === 'text').map(b => b.text).join('')
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'No se pudieron analizar los patrones', raw }, { status: 500 })
  }
}
