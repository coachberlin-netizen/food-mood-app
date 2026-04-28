/**
 * Correlaciones simples — Fase 1
 *
 * Análisis determinista de los últimos N check-ins.
 * Sin modelos externos. Mínimo 5 check-ins para producir resultados.
 * Umbrales conservadores para evitar falsos positivos con pocos datos.
 */

export interface CheckinForCorrelation {
  energy_level:    number
  sleep_quality:   number
  primary_symptom: string | null
  craving_state:   string | null
  recipe_mood_id:  string | null
  primary_emotion: string | null
  created_at:      string
}

export interface CorrelationInsight {
  text: string
  type: string   // for deduplication if called multiple times
}

const NEED_LABELS: Record<string, string> = {
  reset:      'restauración',
  calma:      'calma',
  activacion: 'activación',
  focus:      'foco',
  confort:    'confort',
  social:     'conexión social',
}

const SYMPTOM_LABELS: Record<string, string> = {
  ansiedad:               'la ansiedad',
  insomnio:               'el insomnio',
  cansancio:              'el cansancio',
  'niebla-mental':        'la niebla mental',
  'hambre-constante':     'el hambre constante',
  'inflamacion-silenciosa': 'la inflamación silenciosa',
  'digestion-pesada':     'la tensión digestiva',
  irritabilidad:          'la irritabilidad',
}

export function detectCorrelations(checkins: CheckinForCorrelation[]): CorrelationInsight[] {
  if (checkins.length < 5) return []

  const insights: CorrelationInsight[] = []
  const n = checkins.length
  // checkins assumed sorted newest first (ORDER BY created_at DESC)

  // ── 1. Energy ↔ Sleep correlation ────────────────────────────────
  const lowEnergyDays = checkins.filter(c => c.energy_level <= 4)
  if (lowEnergyDays.length >= 3) {
    const overlap = lowEnergyDays.filter(c => c.sleep_quality <= 2)
    const ratio   = overlap.length / lowEnergyDays.length
    if (ratio >= 0.6) {
      const out10 = Math.round(ratio * 10)
      insights.push({
        type: 'energy-sleep',
        text: `Tu energía baja coincide con mal descanso en ${out10} de cada 10 check-ins — apoyar el sueño podría ser el palanca más directa ahora mismo.`,
      })
    }
  }

  // ── 2. Dominant need ─────────────────────────────────────────────
  const needCounts: Record<string, number> = {}
  for (const c of checkins) {
    if (c.recipe_mood_id) needCounts[c.recipe_mood_id] = (needCounts[c.recipe_mood_id] ?? 0) + 1
  }
  const topNeedEntry = Object.entries(needCounts).sort((a, b) => b[1] - a[1])[0]
  if (topNeedEntry && topNeedEntry[1] / n >= 0.45) {
    const label = NEED_LABELS[topNeedEntry[0]] ?? topNeedEntry[0]
    insights.push({
      type: 'dominant-need',
      text: `Tu cuerpo ha pedido ${label} en ${topNeedEntry[1]} de los últimos ${n} check-ins — es la señal más consistente del periodo.`,
    })
  }

  // ── 3. Frequent symptom ──────────────────────────────────────────
  const symptomCounts: Record<string, number> = {}
  for (const c of checkins) {
    if (c.primary_symptom) symptomCounts[c.primary_symptom] = (symptomCounts[c.primary_symptom] ?? 0) + 1
  }
  const topSymEntry = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0]
  if (topSymEntry && topSymEntry[1] >= 3 && topSymEntry[1] / n >= 0.35) {
    const label = SYMPTOM_LABELS[topSymEntry[0]] ?? topSymEntry[0]
    insights.push({
      type: 'frequent-symptom',
      text: `${label.charAt(0).toUpperCase() + label.slice(1)} aparece en ${topSymEntry[1]} de tus últimos ${n} check-ins — merece atención sostenida, no solo puntual.`,
    })
  }

  // ── 4. Energy trend (newer half vs older half) ───────────────────
  if (n >= 6) {
    const mid    = Math.floor(n / 2)
    const newer  = checkins.slice(0, mid)   // índices bajos = más reciente
    const older  = checkins.slice(mid)
    const avgNew = newer.reduce((s, c) => s + c.energy_level, 0) / newer.length
    const avgOld = older.reduce((s, c) => s + c.energy_level, 0) / older.length
    const delta  = avgNew - avgOld
    if (delta >= 1.5) {
      insights.push({
        type: 'energy-trend',
        text: `Tu energía parece estar mejorando — la media de los últimos días es ${avgNew.toFixed(1)} sobre 10, frente a ${avgOld.toFixed(1)} en días anteriores.`,
      })
    } else if (delta <= -1.5) {
      insights.push({
        type: 'energy-trend',
        text: `Tu energía lleva varios días bajando — de ${avgOld.toFixed(1)} a ${avgNew.toFixed(1)} sobre 10. Puede valer la pena revisar el descanso y la alimentación de los primeros 90 minutos del día.`,
      })
    }
  }

  // ── 5. Sweet craving + emotional tension ─────────────────────────
  const sweetDays  = checkins.filter(c => c.craving_state === 'dulce')
  const sweetTense = sweetDays.filter(
    c => c.primary_symptom === 'ansiedad' || c.primary_symptom === 'irritabilidad',
  )
  if (sweetDays.length >= 2 && sweetTense.length / sweetDays.length >= 0.5) {
    insights.push({
      type: 'sweet-tension',
      text: `Cuando aparece el antojo de dulce, en más de la mitad de los casos también hay tensión emocional — señal del eje cortisol-glucosa, no hambre real.`,
    })
  }

  // ── 6. Stimulant craving + low energy ────────────────────────────
  const stimDays     = checkins.filter(c => c.craving_state === 'estimulante')
  const stimLowEnerg = stimDays.filter(c => c.energy_level <= 4)
  if (stimDays.length >= 2 && stimLowEnerg.length / stimDays.length >= 0.6) {
    insights.push({
      type: 'stimulant-energy',
      text: `El antojo de café o estimulante aparece casi siempre con energía baja — puede ser adenosín acumulado. El cuerpo pide café pero necesita recuperación real.`,
    })
  }

  return insights.slice(0, 3)
}
