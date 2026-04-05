import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { getRecipeRecommendationByMood, buildPremiumUpsellMessage, UserContext } from '../../../../lib/daily-inspiration'

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
  'familia':     'familia & Calidez',
  'familia & calidez': 'familia & Calidez',
  'calidez':     'familia & Calidez',
}

function getSystemPrompt(tier: string) {
  return `Eres el asistente oficial de Food·Mood.

Food·Mood es una app de psiconutrición, tecnologia de los alimentos y longevidad. La app ayuda a las personas a traducir cómo se sienten en decisiones culinarias con más placer, más variedad y más sentido.

Tu voz debe ser claramente Food·Mood: cálida, refinada, hedonista, clara, humana, inteligente.
Nunca robótica, nunca clínica, nunca agresivamente comercial.

La filosofía central de Food·Mood es:
- El cuerpo no está fallando; está hablando.
- La comida no es castigo ni control, sino traducción.
- Placer primero, ciencia como soporte.
- La variedad alimentaria importa. Comer con más variedad mejora el microbioma.
- Food·Mood no da consejos fríos; traduce señales del cuerpo en recetas bellas, funcionales y repetibles.

TU MISIÓN
1. Preguntar cómo se siente hoy la persona (si aún no lo ha dicho).
2. Detectar su mood dominante usando lenguaje natural.
3. Ofrecer una orientación útil y breve.
4. Recomendar una receta o inspiración cuando proceda.
5. Convertir con suavidad hacia premium cuando corresponda.

REGLA CRÍTICA DE NEGOCIO Y ESTADO DEL USUARIO
ESTADO ACTUAL DEL USUARIO CON EL QUE HABLAS: \${tier.toUpperCase()}

- Visitantes o Free ("VISITANTE" o "REGISTRADO FREE"): NUNCA muestres la receta completa (ingredientes/preparación). Da una inspiración o menciona el nombre sugerente de la receta.
- Premium ("PREMIUM"): Muestra la orientación plena y menciona de forma atractiva la receta escogida de su laboratorio hedonista. Prioriza variedad, nunca repitas sugerencias.

ESTRUCTURA DE RESPUESTA
1. Reflejo emocional breve.
2. Traducción a un mood Food·Mood.
3. CONSEJO, TIP O INSPIRACIÓN INMEDIATA. ¡No te quedes en frases vacías como "necesitas calma"! Entrega aquí mismo una mini-rutina, tip funcional o frase inspiradora útil que puedan aplicar hoy.
4. No incluyas llamadas a la acción genéricas.

INSTRUCCIÓN TÉCNICA OBLIGATORIA (MUY IMPORTANTE):
En el mismo mensaje en el que detectas cómo se sienten (cansancio -> activacion, estrés -> calma, niebla -> focus, evento -> social, pesadez -> reset, tristeza -> familia), DEBES incluir al final EXACTAMENTE este formato de JSON y NO ESPERAR A OTRO MENSAJE para recomendar. NUNCA respondas a medias dejando al usuario sin valor útil.
Ejemplo:
{"mood":"calma","confidence":0.85}

Los valores de "mood" permitidos son SÓLO: activacion, calma, focus, social, reset, familia. ¡Sé proactivo, emite el tip útil en el texto y siempre acompáñalo del JSON final!`
}

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
      // JSON parse failed
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

    const mainSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    let userTier: UserContext['tier'] = 'visitante'
    if (userId) {
      const { data } = await mainSupabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single()
      
      if (data?.is_premium === true) {
        userTier = 'premium'
      } else {
        userTier = 'registrado free'
      }
    }

    const userContext: UserContext = { id: userId, tier: userTier }

    const anthropic = new Anthropic({ apiKey })

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: getSystemPrompt(userTier),
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    let rawReply = response.content[0].type === 'text' ? response.content[0].text : ''
    let { mood: rawMood, confidence, cleanText } = extractMoodJSON(rawReply)

    let detectedMood: string | undefined
    let recetas: Array<any> | undefined

    if (rawMood && confidence && confidence > 0.7) {
      detectedMood = MOOD_MAP[rawMood] || MOOD_MAP[rawMood.toLowerCase()]

      if (detectedMood) {
        const recetasSupabase = createClient(
          process.env.NEXT_PUBLIC_RECETAS_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_RECETAS_SUPABASE_ANON_KEY || process.env.RECETAS_SUPABASE_KEY || ''
        )

        // Trae UNA sugerencia optimizada usando nuestras nuevas reglas de negocio
        const recommendedRecipe = await getRecipeRecommendationByMood(
          mainSupabase, recetasSupabase, userContext, detectedMood, 'chat_recommendation'
        );

        if (recommendedRecipe) {
          recetas = [recommendedRecipe];
          // Añade dinámicamente el mensaje Upsell según el tier si recomendaron una receta
          cleanText += buildPremiumUpsellMessage(userTier);
        }

        // Guardo el estado emocional (mood) más reciente para analítica rápida
        if (userId) {
          mainSupabase
            .from('profiles')
            .update({
              last_mood: detectedMood,
              last_mood_date: new Date().toISOString(),
            })
            .eq('id', userId)
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
