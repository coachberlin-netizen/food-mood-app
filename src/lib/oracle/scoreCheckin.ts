import type { OracleInput, OracleScore, MoodId } from './types'
import { NUTRITION, RECIPE_TAGS, MOOD_DESCS, NEED_CONCLUSIONS } from './constants'
import { PATTERN_INSIGHTS } from './insights'
import { buildRitual } from './rituals'

const SYMPTOM_LINES: Record<string, string> = {
  'ansiedad':               'Tu cuerpo también señala tensión en el sistema nervioso — el eje intestino-cerebro podría estar enviando alertas.',
  'insomnio':               'La arquitectura del descanso parece comprometida — la melatonina y el GABA son los focos de hoy.',
  'cansancio':              'Hay señales de fatiga mitocondrial — los cofactores energéticos (CoQ10, magnesio, B12) son prioritarios.',
  'niebla-mental':          'La niebla mental apunta a posible neuroinflamación difusa — omega-3 y antioxidantes como prioridad.',
  'hambre-constante':       'El hambre constante podría señalar una señal de saciedad interrumpida — butirato y proteína de digestión lenta.',
  'inflamacion-silenciosa': 'Hay señales de inflamación de bajo nivel — los polifenoles y la reducción de picos glucémicos son el foco.',
  'digestion-pesada':       'El intestino pide bálsamo — fermentos suaves, enzimas digestivas y reducción de fibra dura por ahora.',
  'irritabilidad':          'La irritabilidad suele señalar cortisol elevado y déficit de magnesio — los adaptógenos y los fermentos pueden ayudar.',
}

function buildReading(input: OracleInput, need: MoodId): string {
  const lines: string[] = []

  const moodA = input.emotions[0]
  const moodB = input.emotions[1]
  if (moodA && moodB) {
    lines.push(`Tu mezcla de hoy combina ${MOOD_DESCS[moodA as MoodId] ?? moodA} con ${MOOD_DESCS[moodB as MoodId] ?? moodB}.`)
  } else if (moodA) {
    lines.push(`Tu estado de hoy apunta a ${MOOD_DESCS[moodA as MoodId] ?? moodA}.`)
  }

  if (input.energyLevel <= 3) {
    lines.push('Tu energía parece pedir pausa — nutrición profunda, no impulso.')
  } else if (input.energyLevel >= 8) {
    lines.push('Tu vitalidad está en un momento alto — propicio para actuar y construir.')
  }

  if (input.sleepQuality <= 2) {
    lines.push('El descanso de anoche ha sido escaso — apoyar la recuperación hoy podría marcar la diferencia.')
  } else if (input.sleepQuality >= 4 && input.energyLevel >= 6) {
    lines.push('Un descanso reparador; tu sistema nervioso llega bien preparado.')
  }

  if (input.primarySymptom) {
    const txt = SYMPTOM_LINES[input.primarySymptom]
    if (txt) lines.push(txt)
  }

  lines.push(NEED_CONCLUSIONS[need])

  return lines.join(' ')
}

export function scoreCheckin(input: OracleInput): OracleScore {
  const s: Record<MoodId, number> = {
    activacion: 0, calma: 0, focus: 0, social: 0, reset: 0, confort: 0,
  }

  if (input.emotions[0]) s[input.emotions[0] as MoodId] = (s[input.emotions[0] as MoodId] ?? 0) + 5
  if (input.emotions[1]) s[input.emotions[1] as MoodId] = (s[input.emotions[1] as MoodId] ?? 0) + 2

  if      (input.energyLevel <= 2) { s.reset += 3; s.confort += 1; s.activacion -= 2 }
  else if (input.energyLevel <= 4) { s.reset  += 1 }
  else if (input.energyLevel >= 8) { s.activacion += 2 }

  if      (input.sleepQuality <= 1) { s.reset += 4; s.calma += 2; s.activacion -= 3; s.focus -= 2 }
  else if (input.sleepQuality <= 2) { s.reset += 2; s.calma += 1; s.activacion -= 1 }
  else if (input.sleepQuality >= 4) { s.activacion += 1; s.focus += 1 }

  const sym = input.primarySymptom
  if (sym === 'ansiedad')               { s.calma += 4; s.reset += 1 }
  if (sym === 'insomnio')               { s.calma += 3; s.reset += 3; s.activacion -= 2 }
  if (sym === 'cansancio')              { s.reset += 2 }
  if (sym === 'niebla-mental')          { s.focus += 3; s.reset += 1 }
  if (sym === 'hambre-constante')       { s.reset += 2; s.confort += 1 }
  if (sym === 'inflamacion-silenciosa') { s.reset += 4 }
  if (sym === 'digestion-pesada')       { s.reset += 2; s.calma += 2 }
  if (sym === 'irritabilidad')          { s.calma += 3; s.reset += 1 }

  const cr = input.cravingState
  if (cr === 'dulce')       { s.reset += 1; s.confort += 1 }
  if (cr === 'calor')       { s.confort += 2 }
  if (cr === 'proteina')    { s.activacion += 1 }
  if (cr === 'fresco')      { s.reset += 1 }
  if (cr === 'fermento')    { s.reset += 1; s.calma += 1 }
  if (cr === 'estimulante') { s.activacion += 1; s.reset += 1 }

  const moodIds: MoodId[] = ['activacion', 'calma', 'focus', 'social', 'reset', 'confort']
  const dominantNeed = moodIds.reduce<MoodId>(
    (best, id) => (s[id] ?? 0) > (s[best] ?? 0) ? id : best,
    'reset',
  )

  let urgencyLevel: 1 | 2 | 3 = 1
  const highSymptoms = ['ansiedad', 'insomnio', 'inflamacion-silenciosa', 'irritabilidad']
  if (input.energyLevel <= 2 || input.sleepQuality <= 1) {
    urgencyLevel = 3
  } else if (
    input.energyLevel <= 4 ||
    input.sleepQuality <= 2 ||
    highSymptoms.includes(input.primarySymptom ?? '')
  ) {
    urgencyLevel = 2
  }

  const matched = PATTERN_INSIGHTS.find(p => p.match(input))
  const insight = matched?.text ?? null

  return {
    dominantNeed,
    urgencyLevel,
    reading:           buildReading(input, dominantNeed),
    insight,
    nutritionPriority: NUTRITION[dominantNeed],
    ritual:            buildRitual(dominantNeed, input),
    recipeQuery: {
      moodId: dominantNeed,
      tags:   RECIPE_TAGS[dominantNeed],
    },
  }
}
