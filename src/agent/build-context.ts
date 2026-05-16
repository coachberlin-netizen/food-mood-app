import { UserHealthProfile, buildDrugFoodWarnings } from './safety-middleware'

export interface AgentContext {
  profile:             UserHealthProfile & {
    edad?:    number
    sexo?:    string
    pais?:    string
    restricciones_dieteticas?: string[]
    objetivos_longevidad?:     string[]
    habitos_ayuno?:            string
  }
  moodCategoria:        string
  moodTextoLibre?:      string
  biomarcadores?:       string
  fragmentosFoodMood?:  string
  fragmentosLongevidad?: string
}

// Construye el string de system prompt con los slots rellenos.
// Si un slot está vacío, omite la etiqueta entera.
export function buildSystemPromptWithContext(
  basePrompt: string,
  ctx:         AgentContext,
): string {
  const parts: string[] = [basePrompt]

  // Perfil de usuario
  const perfilLines: string[] = []
  if (ctx.profile.edad)                                  perfilLines.push(`- Edad: ${ctx.profile.edad}`)
  if (ctx.profile.sexo)                                  perfilLines.push(`- Sexo: ${ctx.profile.sexo}`)
  if (ctx.profile.pais)                                  perfilLines.push(`- País: ${ctx.profile.pais}`)
  if (ctx.profile.alergias?.length)                      perfilLines.push(`- Alergias: ${ctx.profile.alergias.join(', ')}`)
  if (ctx.profile.intolerancias?.length)                 perfilLines.push(`- Intolerancias: ${ctx.profile.intolerancias.join(', ')}`)
  if (ctx.profile.medicacion?.length)                    perfilLines.push(`- Medicación: ${ctx.profile.medicacion.join(', ')}`)
  if (ctx.profile.condiciones?.length)                   perfilLines.push(`- Condiciones: ${ctx.profile.condiciones.join(', ')}`)
  if (ctx.profile.embarazo_lactancia)                    perfilLines.push(`- Estado especial: embarazo o lactancia`)
  if (ctx.profile.restricciones_dieteticas?.length)      perfilLines.push(`- Restricciones dietéticas: ${ctx.profile.restricciones_dieteticas.join(', ')}`)
  if (ctx.profile.objetivos_longevidad?.length)          perfilLines.push(`- Objetivos de longevidad: ${ctx.profile.objetivos_longevidad.join(', ')}`)
  if (ctx.profile.habitos_ayuno)                         perfilLines.push(`- Hábitos de ayuno: ${ctx.profile.habitos_ayuno}`)

  if (perfilLines.length > 0) {
    parts.push(`\n<perfil_usuario>\n${perfilLines.join('\n')}\n</perfil_usuario>`)
  }

  // Mood actual
  const moodLines = [`Categoría seleccionada: ${ctx.moodCategoria}`]
  if (ctx.moodTextoLibre) moodLines.push(`Texto libre: ${ctx.moodTextoLibre}`)
  parts.push(`\n<mood_actual>\n${moodLines.join('\n')}\n</mood_actual>`)

  // Biomarcadores (opcional)
  if (ctx.biomarcadores) {
    parts.push(`\n<biomarcadores>\n${ctx.biomarcadores}\n</biomarcadores>`)
  }

  // Fragmentos KB Food·Mood
  if (ctx.fragmentosFoodMood) {
    parts.push(`\n<fragmentos_kb_food_mood>\n${ctx.fragmentosFoodMood}\n</fragmentos_kb_food_mood>`)
  }

  // Fragmentos KB Longevidad
  if (ctx.fragmentosLongevidad) {
    parts.push(`\n<fragmentos_kb_longevidad>\n${ctx.fragmentosLongevidad}\n</fragmentos_kb_longevidad>`)
  }

  // Interacciones fármaco-alimento pre-filtradas
  const drugWarnings = buildDrugFoodWarnings(ctx.profile.medicacion)
  if (drugWarnings) {
    parts.push(`\n<interacciones_farmaco_alimento>\n${drugWarnings}\n</interacciones_farmaco_alimento>`)
  }

  return parts.join('')
}
