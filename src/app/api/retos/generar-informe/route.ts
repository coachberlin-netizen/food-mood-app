import logger from "@/lib/logger"
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { challengeId, slug } = await req.json()

    // Verificar acceso al reto
    const { data: purchase } = await supabase
      .from('reto_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .eq('status', 'active')
      .maybeSingle()

    if (!purchase) {
      return NextResponse.json({ error: 'Sin acceso al reto' }, { status: 403 })
    }

    // Informe ya generado
    const { data: existing } = await supabase
      .from('reto_informes')
      .select('informe')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .maybeSingle()

    if (existing) return NextResponse.json({ informe: existing.informe })

    const { data: logs } = await supabase
      .from('challenge_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .order('day_number', { ascending: true })

    if (!logs || logs.length === 0) {
      return NextResponse.json({ error: 'Sin registros para analizar' }, { status: 400 })
    }

    const energiaInicio = logs.find(l => l.day_number === 1)?.energia_score ?? null
    const energiaMitad  = logs.find(l => l.day_number === 4)?.energia_score ?? null
    const energiaFinal  = logs.find(l => l.day_number === 7)?.energia_score ?? null

    const registrosTexto = logs.map(l =>
      `Día ${l.day_number}:\n- Mañana: ${l.pregunta_manana || '—'}\n- Tarde: ${l.pregunta_tarde || '—'}\n- Noche: ${l.pregunta_noche || '—'}\n- Energía: ${l.energia_score ?? '—'}/5 · Ánimo: ${l.animo_score ?? '—'}/5`
    ).join('\n\n')

    const prompt = `Eres la psicóloga y nutricionista de Food·Mood. Acabas de revisar los registros de un usuario que completó el reto "Recupera tu energía en una semana".

DATOS:
- Energía día 1: ${energiaInicio ?? 'no registrado'}/5
- Energía día 4: ${energiaMitad ?? 'no registrado'}/5
- Energía día 7: ${energiaFinal ?? 'no registrado'}/5

REGISTROS:
${registrosTexto}

Genera un informe personalizado en español. Responde SOLO con JSON válido, sin markdown:
{
  "titulo": "Informe de tu semana de reset energético",
  "resumen_ejecutivo": "2-3 frases sobre el progreso real. Tono cálido, directo.",
  "evolucion_energia": {
    "inicio": ${energiaInicio},
    "mitad": ${energiaMitad},
    "final": ${energiaFinal},
    "descripcion": "1-2 frases sobre la curva de energía observada"
  },
  "logros_principales": ["logro 1", "logro 2", "logro 3"],
  "patron_observado": "1 párrafo sobre el patrón más relevante. Bioquímica sencilla.",
  "siguiente_paso": {
    "recomendacion": "Food-Mood Reset",
    "razon": "1-2 frases explicando por qué ese siguiente paso"
  },
  "mensaje_cierre": "1 frase final empoderador y real."
}

REGLAS: Sin "¡" ni emojis en el texto. Máximo 700 tokens.`

    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages:   [{ role: 'user', content: prompt }],
    })

    const rawText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')

    // Strip markdown code fences the model sometimes wraps around JSON
    const cleanJson = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const informe = JSON.parse(cleanJson)

    await supabase
      .from('reto_informes')
      .upsert({
        user_id:      user.id,
        challenge_id: challengeId,
        informe,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,challenge_id' })

    return NextResponse.json({ informe })
  } catch (err) {
    logger.error('[generar-informe] Error:', err)
    return NextResponse.json({ error: 'Error generando el informe' }, { status: 500 })
  }
}
