/**
 * Oracle Scoring Engine — Fase 1
 *
 * Transforma los inputs del check-in en una lectura estructurada usando
 * un sistema de pesos cruzados. Determinista, testeable, sin claims clínicos.
 * Lenguaje prudente: "parece", "apunta a", "estamos observando".
 */

export type MoodId = 'activacion' | 'calma' | 'focus' | 'social' | 'reset' | 'confort'

export interface OracleInput {
  emotions:       string[]       // up to 2, index 0 = dominant
  energyLevel:    number         // 1–10
  sleepQuality:   number         // 1–5
  primarySymptom: string | null
  cravingState:   string | null
  cyclePhase:     string | null
  notes:          string
}

export interface OracleScore {
  dominantNeed:      MoodId
  urgencyLevel:      1 | 2 | 3   // 1 = suave · 2 = moderado · 3 = alto
  reading:           string       // 3–4 frases compuestas por reglas
  insight:           string | null  // patrón cruzado específico, si existe
  nutritionPriority: string[]     // top 4 prioridades nutricionales
  ritual:            string       // acción concreta para hoy
  recipeQuery: {
    moodId: MoodId
    tags:   string[]
  }
}

/** Contrato estable para la columna emotional_mix jsonb de oracle_checkins */
export interface EmotionalMix {
  emotions:      string[]               // seleccionadas por el usuario, dominante primero
  weights:       Record<string, number> // dominante = 1.0, secundaria = 0.4
  mixed_color:   string                 // hex resultado de mixColors() o color de la emoción principal
  dominant_need: MoodId                 // necesidad calculada por el scoring engine
}

// ── Nutrición por necesidad dominante ──────────────────────────────

const NUTRITION: Record<MoodId, string[]> = {
  activacion: [
    'Hierro biodisponible (legumbres + vitamina C)',
    'Vitamina B12 (huevo, fermentos)',
    'Adaptógenos suaves (maca, shiitake)',
    'Carbohidratos complejos de absorción lenta',
  ],
  calma: [
    'Magnesio glicinato (semillas de calabaza, cacao puro)',
    'L-teanina (matcha, té verde)',
    'Triptófano (plátano, kéfir, pavo)',
    'GABA natural (fermentos, tomate cocinado lento)',
  ],
  focus: [
    'Omega-3 DHA/EPA (sardinas, caballa, chía)',
    'Colina (huevo entero)',
    'Polifenoles neuroprotectores (arándanos, cacao 85%)',
    'L-teanina + cafeína moderada (matcha ceremonial)',
  ],
  social: [
    'Fermentos vivos (kéfir, miso, kimchi)',
    'Cacao puro (precursor de oxitocina)',
    'Grasas para síntesis hormonal (aguacate, AOVE)',
    'Probióticos de amplio espectro (yogur natural)',
  ],
  reset: [
    'Fibra prebiótica (alcachofa, puerro, ajo, cebolla)',
    'Cúrcuma + pimienta negra (vía NF-κB)',
    'Almidón resistente (arroz enfriado, patata cocida fría)',
    'Enzimas digestivas naturales (jengibre, papaya, piña)',
  ],
  confort: [
    'Triptófano serotonérgico (plátano, dátiles, pan de masa madre)',
    'Fermentos cálidos (miso suave, kéfir templado)',
    'Magnesio (almendras, espinacas, semillas)',
    'Grasas saciantes y cálidas (ghee, aceite de coco)',
  ],
}

// ── Tags de receta por necesidad ────────────────────────────────────

const RECIPE_TAGS: Record<MoodId, string[]> = {
  activacion: ['energía', 'desayuno', 'hierro', 'adaptógenos'],
  calma:      ['calma', 'magnesio', 'triptófano', 'fermentado'],
  focus:      ['focus', 'omega-3', 'dha', 'antioxidante'],
  social:     ['fermentado', 'aperitivo', 'probiótico'],
  reset:      ['antiinflamatorio', 'depurador', 'prebiótico', 'fibra'],
  confort:    ['confort', 'caldo', 'masa-madre', 'serotonina'],
}

// ── Rituales contextuales ────────────────────────────────────────────

function buildRitual(need: MoodId, input: OracleInput): string {
  if (input.sleepQuality <= 2) {
    return 'Hoy no es el día de empezar fuerte. Un caldo ligero o un té sin cafeína como primera ingesta — entrada suave para un sistema que necesita recuperarse antes de rendir.'
  }
  if (input.primarySymptom === 'digestion-pesada') {
    return 'Espera al menos 4 horas desde la última ingesta antes de comer. Un caldo de miso suave o jengibre con limón puede abrir la digestión sin sobrecargarla.'
  }
  if (input.primarySymptom === 'ansiedad' || input.primarySymptom === 'irritabilidad') {
    return 'Come sin pantallas y sin prisa hoy. La velocidad de la comida activa el sistema nervioso simpático tanto como lo que comes — comer despacio es parte del protocolo.'
  }
  switch (need) {
    case 'calma':
      return 'Empieza el día con agua tibia y limón, luego un desayuno rico en magnesio y triptófano. No cafeína hasta al menos 90 minutos después de despertar.'
    case 'reset':
      return 'Agua tibia con limón en ayunas, luego una primera ingesta con fermentos y fibra prebiótica suave. Hoy el intestino necesita apoyo antes que estimulación.'
    case 'activacion':
      return 'Un desayuno alto en proteína en los primeros 90 minutos del día sostiene la dopamina y el foco. Evita empezar con carbohidratos simples.'
    case 'focus':
      return 'Matcha con leche de avena antes del trabajo profundo — L-teanina y cafeína juntas generan ondas alfa sin el pico ansioso del café solo.'
    case 'confort':
      return 'Algo cálido, denso y reconfortante como primera ingesta. No es debilidad — es inteligencia somática. Tu sistema nervioso necesita seguridad antes que rendimiento.'
    case 'social':
      return 'Comparte al menos una ingesta hoy. La comida compartida activa circuitos de oxitocina que ningún suplemento puede replicar.'
  }
}

// ── Insights de patrón cruzado ───────────────────────────────────────

const PATTERN_INSIGHTS: Array<{ match: (i: OracleInput) => boolean; text: string }> = [
  {
    match: i => i.sleepQuality <= 2 && i.energyLevel <= 4,
    text:  'El cansancio de hoy parece más de recuperación que de déficit nutricional — el sistema nervioso necesita recargar antes que activarse.',
  },
  {
    match: i => (i.cravingState === 'dulce') && (i.primarySymptom === 'ansiedad' || i.primarySymptom === 'irritabilidad'),
    text:  'El antojo de dulce junto con el estado emocional apunta a cortisol elevado — no es hambre real, es una señal del eje HPA buscando glucosa rápida.',
  },
  {
    match: i => i.cravingState === 'estimulante' && i.energyLevel <= 4,
    text:  'Buscar estimulación con energía baja suele ser una señal de adenosín acumulado — el cuerpo pide café pero necesita recuperación real.',
  },
  {
    match: i => i.primarySymptom === 'niebla-mental' && i.sleepQuality <= 2,
    text:  'La niebla mental combinada con mal descanso apunta a limpieza glinfática incompleta — el cerebro necesita sueño profundo para depurarse, no solo nutrientes.',
  },
  {
    match: i => i.primarySymptom === 'digestion-pesada' && i.cravingState === 'calor',
    text:  'La digestión pesada junto con el antojo de calor señala un intestino que pide bálsamo — fermentos suaves y caldos antes que fibra dura o cruda.',
  },
  {
    match: i => i.emotions.includes('reset') && i.energyLevel <= 3,
    text:  'Tu cuerpo y tu mente apuntan en la misma dirección hoy — restauración. No es el momento de rendir, sino de nutrir.',
  },
  {
    match: i => i.primarySymptom === 'hambre-constante' && i.energyLevel <= 5,
    text:  'El hambre constante con energía baja puede apuntar a un déficit de ácidos grasos de cadena corta (butirato) — el intestino no está enviando señales de saciedad al hipotálamo.',
  },
  {
    match: i => i.cyclePhase === 'lutea' && (i.primarySymptom === 'irritabilidad' || i.cravingState === 'dulce'),
    text:  'En fase lútea el estrógeno cae y la progesterona sube — el craving de dulce y la irritabilidad son señales hormonales, no falta de voluntad. El magnesio y el triptófano son prioritarios.',
  },
]

// ── Reading builder ──────────────────────────────────────────────────

const MOOD_DESCS: Record<MoodId, string> = {
  activacion: 'vitalidad que busca encenderse',
  calma:      'la necesidad de pausa y silencio interior',
  focus:      'la búsqueda de un centro nítido y dirección',
  social:     'el anhelo de conexión y pertenencia',
  reset:      'la necesidad de un lienzo en blanco',
  confort:    'el refugio de lo conocido y lo seguro',
}

const NEED_CONCLUSIONS: Record<MoodId, string> = {
  calma:      'Lo que observamos en conjunto apunta a un momento de calma activa — nutrir el sistema nervioso antes que activarlo.',
  reset:      'La señal de hoy apunta a restauración profunda — dar al intestino lo que necesita para reequilibrarse.',
  activacion: 'Tu sistema parece listo para activarse — apóyalo con los cofactores correctos y el impulso llegará más limpio.',
  focus:      'Hay capacidad de foco disponible — los ácidos grasos y los adaptógenos de hoy pueden potenciarlo.',
  confort:    'Hoy tu cuerpo pide raíz y seguridad — calidez y nutrición densa que haga sentir el suelo bajo los pies.',
  social:     'La energía parece orientada hacia afuera — los fermentos vivos y las especias cálidas pueden potenciar esa apertura.',
}

function buildReading(input: OracleInput, need: MoodId): string {
  const lines: string[] = []

  // 1 — Emotion state
  const moodA = input.emotions[0]
  const moodB = input.emotions[1]
  if (moodA && moodB) {
    lines.push(`Tu mezcla de hoy combina ${MOOD_DESCS[moodA as MoodId] ?? moodA} con ${MOOD_DESCS[moodB as MoodId] ?? moodB}.`)
  } else if (moodA) {
    lines.push(`Tu estado de hoy apunta a ${MOOD_DESCS[moodA as MoodId] ?? moodA}.`)
  }

  // 2 — Energy signal
  if (input.energyLevel <= 3) {
    lines.push('Tu energía parece pedir pausa — nutrición profunda, no impulso.')
  } else if (input.energyLevel >= 8) {
    lines.push('Tu vitalidad está en un momento alto — propicio para actuar y construir.')
  }

  // 3 — Sleep signal (only when notable)
  if (input.sleepQuality <= 2) {
    lines.push('El descanso de anoche ha sido escaso — apoyar la recuperación hoy podría marcar la diferencia.')
  } else if (input.sleepQuality >= 4 && input.energyLevel >= 6) {
    lines.push('Un descanso reparador; tu sistema nervioso llega bien preparado.')
  }

  // 4 — Symptom signal
  if (input.primarySymptom) {
    const symptomTexts: Record<string, string> = {
      'ansiedad':               'Tu cuerpo también señala tensión en el sistema nervioso — el eje intestino-cerebro podría estar enviando alertas.',
      'insomnio':               'La arquitectura del descanso parece comprometida — la melatonina y el GABA son los focos de hoy.',
      'cansancio':              'Hay señales de fatiga mitocondrial — los cofactores energéticos (CoQ10, magnesio, B12) son prioritarios.',
      'niebla-mental':          'La niebla mental apunta a posible neuroinflamación difusa — omega-3 y antioxidantes como prioridad.',
      'hambre-constante':       'El hambre constante podría señalar una señal de saciedad interrumpida — butirato y proteína de digestión lenta.',
      'inflamacion-silenciosa': 'Hay señales de inflamación de bajo nivel — los polifenoles y la reducción de picos glucémicos son el foco.',
      'digestion-pesada':       'El intestino pide bálsamo — fermentos suaves, enzimas digestivas y reducción de fibra dura por ahora.',
      'irritabilidad':          'La irritabilidad suele señalar cortisol elevado y déficit de magnesio — los adaptógenos y los fermentos pueden ayudar.',
    }
    const txt = symptomTexts[input.primarySymptom]
    if (txt) lines.push(txt)
  }

  // 5 — Conclusion based on dominant need
  lines.push(NEED_CONCLUSIONS[need])

  return lines.join(' ')
}

// ── Main scoring function ────────────────────────────────────────────

export function scoreCheckin(input: OracleInput): OracleScore {
  const s: Record<MoodId, number> = {
    activacion: 0, calma: 0, focus: 0, social: 0, reset: 0, confort: 0,
  }

  // 1 — Base from self-reported emotions
  if (input.emotions[0]) s[input.emotions[0] as MoodId] = (s[input.emotions[0] as MoodId] ?? 0) + 5
  if (input.emotions[1]) s[input.emotions[1] as MoodId] = (s[input.emotions[1] as MoodId] ?? 0) + 2

  // 2 — Energy level
  if      (input.energyLevel <= 2) { s.reset += 3; s.confort += 1; s.activacion -= 2 }
  else if (input.energyLevel <= 4) { s.reset  += 1 }
  else if (input.energyLevel >= 8) { s.activacion += 2 }

  // 3 — Sleep quality
  if      (input.sleepQuality <= 1) { s.reset += 4; s.calma += 2; s.activacion -= 3; s.focus -= 2 }
  else if (input.sleepQuality <= 2) { s.reset += 2; s.calma += 1; s.activacion -= 1 }
  else if (input.sleepQuality >= 4) { s.activacion += 1; s.focus += 1 }

  // 4 — Symptom
  const sym = input.primarySymptom
  if (sym === 'ansiedad')               { s.calma += 4; s.reset += 1 }
  if (sym === 'insomnio')               { s.calma += 3; s.reset += 3; s.activacion -= 2 }
  if (sym === 'cansancio')              { s.reset += 2 }
  if (sym === 'niebla-mental')          { s.focus += 3; s.reset += 1 }
  if (sym === 'hambre-constante')       { s.reset += 2; s.confort += 1 }
  if (sym === 'inflamacion-silenciosa') { s.reset += 4 }
  if (sym === 'digestion-pesada')       { s.reset += 2; s.calma += 2 }
  if (sym === 'irritabilidad')          { s.calma += 3; s.reset += 1 }

  // 5 — Craving
  const cr = input.cravingState
  if (cr === 'dulce')       { s.reset += 1; s.confort += 1 }
  if (cr === 'calor')       { s.confort += 2 }
  if (cr === 'proteina')    { s.activacion += 1 }
  if (cr === 'fresco')      { s.reset += 1 }
  if (cr === 'fermento')    { s.reset += 1; s.calma += 1 }
  if (cr === 'estimulante') { s.activacion += 1; s.reset += 1 }

  // 6 — Resolve dominant need (clamp negatives to 0)
  const moodIds: MoodId[] = ['activacion', 'calma', 'focus', 'social', 'reset', 'confort']
  const dominantNeed = moodIds.reduce<MoodId>(
    (best, id) => (s[id] ?? 0) > (s[best] ?? 0) ? id : best,
    'reset',
  )

  // 7 — Urgency
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

  // 8 — Pattern insight
  const matched = PATTERN_INSIGHTS.find(p => p.match(input))
  const insight = matched?.text ?? null

  // 9 — Compose output
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
