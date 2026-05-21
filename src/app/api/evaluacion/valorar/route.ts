import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient as createSessionClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { EVALUACION_TESTS } from '@/data/evaluacion-tests'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const MODEL = 'claude-haiku-4-5'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function formatAnswersForPrompt(
  tests: Record<string, Record<string, string | string[] | number>>,
): string {
  const lines: string[] = []

  for (const [testId, respuestas] of Object.entries(tests)) {
    const testDef = EVALUACION_TESTS.find(t => t.id === testId)
    if (!testDef) continue

    lines.push(`\n## ${testDef.titulo}`)

    for (const pregunta of testDef.preguntas) {
      const respuesta = respuestas[pregunta.id]
      if (respuesta === undefined || respuesta === '' || (Array.isArray(respuesta) && respuesta.length === 0)) continue

      let respuestaTexto: string

      if (pregunta.tipo === 'multi' && Array.isArray(respuesta)) {
        const labels = (respuesta as string[]).map(v => {
          const opt = pregunta.opciones?.find(o => o.valor === v)
          return opt?.label ?? v
        })
        respuestaTexto = labels.join(', ')
      } else if (pregunta.tipo === 'single' && typeof respuesta === 'string') {
        const opt = pregunta.opciones?.find(o => o.valor === respuesta)
        respuestaTexto = opt?.label ?? respuesta
        if (opt?.desc) respuestaTexto += ` (${opt.desc})`
      } else if (pregunta.tipo === 'scale') {
        const max = pregunta.escala?.max ?? 10
        respuestaTexto = `${respuesta}/${max}`
      } else {
        respuestaTexto = String(respuesta)
      }

      lines.push(`- ${pregunta.texto}: ${respuestaTexto}`)
    }
  }

  return lines.join('\n')
}

const SYSTEM_PROMPT = `Eres una asesora especializada en psiconutrición, salud hormonal femenina y bienestar para mujeres de 35-60 años, con foco especial en perimenopausia y menopausia.

Analiza las respuestas de los tests completados y genera una valoración personalizada y orientativa. Sé cálida, empática y específica — no genérica.

PRINCIPIOS OBLIGATORIOS:
- Lenguaje: nutrir, equilibrio, vitalidad, placer, bienestar
- NUNCA uses: dieta, restricción, detox, culpa, adelgazar, calorías, prohibido
- No uses lenguaje clínico ni diagnóstico
- Observa patrones sin juzgar
- Celebra lo que ya hacen bien
- Las recomendaciones son accionables y realistas

FORMATO DE RESPUESTA (JSON estricto, sin texto fuera del objeto):
{
  "titulo": "string — título personalizado y específico para este perfil (no genérico)",
  "resumen": "string — 2-3 frases que capturan el perfil observado, empáticas y específicas",
  "hallazgos": ["string"] — exactamente 3-4 observaciones clave basadas en los tests (neutras, no juicios),
  "fortalezas": ["string"] — exactamente 2-3 aspectos positivos reales del perfil,
  "areas_atencion": ["string"] — exactamente 2-3 áreas donde la nutrición puede apoyar el bienestar (formuladas positivamente),
  "recomendaciones": ["string"] — exactamente 4-5 recomendaciones específicas y accionables (cada una con un verbo de acción),
  "siguiente_paso": "string — UN solo paso concreto y pequeño para empezar esta semana"
}`

export async function POST(req: NextRequest) {
  const session = await createSessionClient()
  const { data: { user }, error: authErr } = await session.auth.getUser()

  if (authErr || !user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { tests: Record<string, Record<string, string | string[] | number>> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (!body.tests || Object.keys(body.tests).length === 0) {
    return NextResponse.json({ error: 'no_tests_provided' }, { status: 400 })
  }

  // Rate limit: max 5 evaluaciones per month for all users
  const service = serviceClient()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await service
    .from('evaluacion_resultados')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString())

  if ((count ?? 0) >= 5) {
    return NextResponse.json(
      { error: 'quota_exceeded', message: 'Has alcanzado el límite de 5 valoraciones este mes.' },
      { status: 429 },
    )
  }

  const answersText = formatAnswersForPrompt(body.tests)
  const testsCompletados = Object.keys(body.tests)

  const userMessage = `Aquí están mis respuestas a los tests completados:
${answersText}

Por favor, genera mi valoración personalizada en formato JSON.`

  let resultado: unknown

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const completion = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      })

      const text = completion.content[0].type === 'text' ? completion.content[0].text : ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('no_json')
      resultado = JSON.parse(jsonMatch[0])
      break
    } catch {
      if (attempt === 1) {
        return NextResponse.json({ error: 'ai_unavailable' }, { status: 502 })
      }
    }
  }

  // Save result (best effort — don't fail the request if this errors)
  try {
    await service.from('evaluacion_resultados').insert({
      user_id: user.id,
      tests_completados: testsCompletados,
      resultado,
    })
  } catch { /* non-blocking */ }

  return NextResponse.json({ resultado, testsCompletados }, { status: 200 })
}
