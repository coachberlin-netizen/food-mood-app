import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const MOOD_MAP: Record<string, string> = {
  'activacion':  'Activación & Energía',
  'activación':  'Activación & Energía',
  'energy':      'Activación & Energía',
  'energía':     'Activación & Energía',
  'calma':       'Calma & Equilibrio',
  'calm':        'Calma & Equilibrio',
  'equilibrio':  'Calma & Equilibrio',
  'focus':       'Focus & Claridad Mental',
  'foco':        'Focus & Claridad Mental',
  'claridad':    'Focus & Claridad Mental',
  'social':      'Social & Placer Compartido',
  'joy':         'Social & Placer Compartido',
  'alegría':     'Social & Placer Compartido',
  'reset':       'Reset & Ligereza',
  'reset & ligereza': 'Reset & Ligereza',
  'relax':       'Calma & Equilibrio',
  'confort':     'Confort & Calidez',
  'confort & calidez': 'Confort & Calidez',
  'calidez':     'Confort & Calidez',
}

const SYSTEM_PROMPT = `Eres el asistente empático de Food·Mood. Tu objetivo es detectar cómo se siente el usuario emocionalmente en máximo 3 intercambios.
Los únicos moods válidos son: Activación, Calma, Focus, Social, Reset, Confort.
Responde siempre en español, con calidez y brevedad (máx 2 frases).
Cuando tengas suficiente contexto emocional, añade al final de tu respuesta este JSON en una línea separada: {"mood":"focus","confidence":0.85}
El valor de "mood" debe ser uno de: activacion, calma, focus, social, reset, confort (en minúsculas, sin tildes).
No fuerces la detección si no tienes datos suficientes. Si el usuario solo saluda, pregunta cómo se siente.`

function extractMoodJSON(text: string): { mood?: string; confidence?: number; cleanText: string } {
  // Try to find JSON at end of response
  const jsonRegex = /\{[^{}]*"mood"\s*:\s*"[^"]+"\s*,\s*"confidence"\s*:\s*[\d.]+[^{}]*\}/gi
  const matches = text.match(jsonRegex)
  
  if (matches && matches.length > 0) {
    try {
      const parsed = JSON.parse(matches[matches.length - 1])
      const cleanText = text.replace(matches[matches.length - 1], '').trim()
      return {
        mood: parsed.mood?.toLowerCase(),
        confidence: parsed.confidence,
        cleanText,
      }
    } catch {
      // JSON parse failed, continue without mood
    }
  }
  
  return { cleanText: text }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const anthropic = new Anthropic({ apiKey })

    // Call Claude Haiku
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const rawReply = response.content[0].type === 'text' ? response.content[0].text : ''
    const { mood: rawMood, confidence, cleanText } = extractMoodJSON(rawReply)

    let detectedMood: string | undefined
    let recetas: Array<{ id: string; nombre_es: string; mood_es: string; imagen_url: string | null }> | undefined

    // Resolve mood if confidence is high enough
    if (rawMood && confidence && confidence > 0.7) {
      detectedMood = MOOD_MAP[rawMood] || MOOD_MAP[rawMood.toLowerCase()]

      if (detectedMood) {
        // Fetch 2 free recipes for this mood from the recetas DB
        const { createClient } = await import('@supabase/supabase-js')
        const recetasSupabase = createClient(
          process.env.NEXT_PUBLIC_RECETAS_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_RECETAS_SUPABASE_ANON_KEY || process.env.RECETAS_SUPABASE_KEY || ''
        )

        const { data: recipes } = await recetasSupabase
          .from('recetas')
          .select('id, nombre_es, mood_es, imagen_url')
          .ilike('mood_es', `%${detectedMood.split(' ')[0]}%`)
          .eq('premium_level', 0)
          .eq('segmento', 'adulto')
          .limit(2)

        recetas = recipes || []

        // Update user's last mood if authenticated
        if (userId) {
          const mainSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
          )
          await mainSupabase
            .from('profiles')
            .update({
              last_mood: detectedMood,
              last_mood_date: new Date().toISOString(),
            })
            .eq('id', userId)
        }
      }
    }

    return NextResponse.json({
      reply: cleanText,
      mood: detectedMood || undefined,
      confidence: confidence || undefined,
      recetas: recetas || undefined,
    })
  } catch (err: unknown) {
    const error = err as { message?: string; status?: number; error?: { message?: string } }
    const msg = error?.message || error?.error?.message || 'Unknown error'
    const status = error?.status || 500
    console.error('[chat/mood] Error:', msg, 'Status:', status, 'Full:', JSON.stringify(err))
    return NextResponse.json(
      { error: msg },
      { status }
    )
  }
}
