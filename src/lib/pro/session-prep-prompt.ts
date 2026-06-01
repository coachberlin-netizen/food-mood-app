export type AttentionFlagSummary = {
  flag_type:   string
  severity:    "soft" | "moderate"
  detected_at: string
  evidence:    Record<string, unknown>
}

export type PatientData = {
  checkins:       { logged_at: string; nervous_system_state: string; interoceptive_clarity: number; dominant_sensation: string | null }[]
  granularity:    { logged_at: string; initial_emotion_word: string; final_emotion_words: string[]; granularity_score: number }[]
  dialogues:      { started_at: string; initial_thought: string; final_alternative_thought: string | null; emotion_before: string | null; emotion_after: string | null; intensity_before: number | null; intensity_after: number | null }[]
  hambre:         { logged_at: string; physical_hunger: number; emotional_hunger: number; interoceptive_clarity: number; decided_to_eat: boolean; context_notes: string | null }[]
  meals:          { logged_at: string; emotion_before: string; intensity_before: number; emotion_after: string; intensity_after: number; meal_description: string | null; post_nervous_system_state: string | null }[]
  intentions:     { trigger_situation: string; intended_action: string; linked_value: string | null; times_triggered: number; times_completed: number }[]
  nudges:         { generated_at: string; pattern_detected: string; action_taken: boolean }[]
  values:         { core_values: string[]; relationship_with_food_vision: string; committed_actions: string[] }[]
  assignments:    { title: string; tool_slug: string; frequency_per_week: number; completions_this_week: number; instruction: string }[]
  attentionFlags: AttentionFlagSummary[]
}

export type SessionPrepOutput = {
  weekly_summary:      string
  key_patterns:        { pattern: string; evidence: string }[]
  suggested_questions: string[]
  intervention_points: { point: string; rationale: string }[]
}

const NSS: Record<string, string> = {
  ventral:             "Ventral vagal (calma/conexión)",
  sympathetic_active:  "Simpático activo (activación positiva)",
  sympathetic_anxious: "Simpático ansioso (alerta/ansiedad)",
  dorsal_freeze:       "Dorsal freeze (baja energía/bloqueo)",
  dorsal_collapse:     "Dorsal collapse (colapso/disociación)",
  mixed:               "Estado mixto",
}

const GRAN: Record<number, string> = {
  1: "básica", 2: "nombrada", 3: "doble", 4: "triple", 5: "rica",
}

function d(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

export function buildSystemPrompt(): string {
  return `Eres un asistente clínico especializado en psiconutrición y regulación del sistema nervioso autónomo. Tu función es analizar datos conductuales y emocionales de una/un paciente y generar un informe de preparación de sesión para el/la profesional de salud responsable.

El informe es de USO INTERNO EXCLUSIVO del profesional. No se muestra al paciente. Usa terminología clínica apropiada: teoría polivagal, regulación emocional, hambre interoceptiva, granularidad afectiva, entrevista motivacional.

Devuelve ÚNICAMENTE un JSON con exactamente esta estructura (sin texto antes ni después, sin bloque markdown):
{
  "weekly_summary": "string — 2-3 párrafos clínicos narrativos integrando patrones emocionales, conductuales y fisiológicos del período. 150-300 palabras.",
  "key_patterns": [
    {"pattern": "Descripción del patrón observado", "evidence": "Datos específicos que lo evidencian, con fechas cuando sea relevante"}
  ],
  "suggested_questions": ["Pregunta abierta para la sesión — estilo socrático o entrevista motivacional"],
  "intervention_points": [
    {"point": "Intervención específica y accionable", "rationale": "Justificación basada en los datos del período"}
  ]
}

Reglas de contenido:
- key_patterns: 3-5 entradas, ordenadas de mayor a menor relevancia clínica
- suggested_questions: 4-6 preguntas abiertas, evita sí/no, basadas en los patrones detectados
- intervention_points: 2-4 entradas, concretas y accionables
- Nunca mencionar restricción calórica, pérdida de peso ni juicio moral sobre la alimentación
- Hablar desde el marco eje intestino-cerebro, regulación SNA, neurobiología afectiva
- Si hay asignaciones terapéuticas activas, incluir en weekly_summary un párrafo sobre adherencia a las mismas y en intervention_points qué ajustes sugiere según el nivel de cumplimiento
- Si hay señales de atención moderadas, priorizarlas como foco en suggested_questions e intervention_points; no usar los términos "trastorno", "TCA", "diagnóstico" ni "riesgo clínico"`
}

export function buildUserMessage(data: PatientData, periodStart: string, periodEnd: string): string {
  const lines: string[] = [
    `Período de análisis: ${periodStart} a ${periodEnd}`,
    "",
  ]

  // Check-ins interoceptivos
  lines.push(`== CHECK-INS INTEROCEPTIVOS (${data.checkins.length} registros) ==`)
  if (data.checkins.length === 0) {
    lines.push("Sin registros en el período.")
  } else {
    for (const c of data.checkins) {
      const nss = NSS[c.nervous_system_state] ?? c.nervous_system_state
      const sen = c.dominant_sensation ? `, sensación: ${c.dominant_sensation}` : ""
      lines.push(`- ${d(c.logged_at)}: NSS=${nss}, claridad interoceptiva=${c.interoceptive_clarity}/10${sen}`)
    }
  }
  lines.push("")

  // Granularidad emocional
  lines.push(`== GRANULARIDAD EMOCIONAL (${data.granularity.length} sesiones) ==`)
  if (data.granularity.length === 0) {
    lines.push("Sin registros en el período.")
  } else {
    for (const g of data.granularity) {
      const score = GRAN[g.granularity_score] ?? `${g.granularity_score}/5`
      lines.push(`- ${d(g.logged_at)}: "${g.initial_emotion_word}" → ${g.final_emotion_words.join(", ")} (granularidad ${score})`)
    }
  }
  lines.push("")

  // Diálogos socráticos
  lines.push(`== DIÁLOGOS SOCRÁTICOS (${data.dialogues.length} sesiones) ==`)
  if (data.dialogues.length === 0) {
    lines.push("Sin sesiones en el período.")
  } else {
    for (const diag of data.dialogues) {
      const after = diag.final_alternative_thought ? ` → "${diag.final_alternative_thought}"` : ""
      const intensities = diag.intensity_before != null && diag.intensity_after != null
        ? ` | intensidad: ${diag.intensity_before} → ${diag.intensity_after}`
        : ""
      lines.push(`- ${d(diag.started_at)}: "${diag.initial_thought}"${after}${intensities}`)
    }
  }
  lines.push("")

  // Termómetro de hambre
  lines.push(`== TERMÓMETRO DE HAMBRE (${data.hambre.length} registros) ==`)
  if (data.hambre.length === 0) {
    lines.push("Sin registros en el período.")
  } else {
    for (const h of data.hambre) {
      const ctx = h.context_notes ? `, contexto: ${h.context_notes}` : ""
      lines.push(`- ${d(h.logged_at)}: física=${h.physical_hunger}/10, emocional=${h.emotional_hunger}/10, claridad=${h.interoceptive_clarity}/10, ${h.decided_to_eat ? "comió" : "no comió"}${ctx}`)
    }
  }
  lines.push("")

  // Registro pre/post comida
  lines.push(`== REGISTRO PRE/POST COMIDA (${data.meals.length} registros) ==`)
  if (data.meals.length === 0) {
    lines.push("Sin registros en el período.")
  } else {
    for (const m of data.meals) {
      const nss = m.post_nervous_system_state ? `, NSS post: ${NSS[m.post_nervous_system_state] ?? m.post_nervous_system_state}` : ""
      lines.push(`- ${d(m.logged_at)}: ${m.emotion_before}(${m.intensity_before}) → ${m.emotion_after}(${m.intensity_after})${nss}`)
    }
  }
  lines.push("")

  // Planes si-entonces
  lines.push(`== PLANES SI-ENTONCES ACTIVOS (${data.intentions.length}) ==`)
  if (data.intentions.length === 0) {
    lines.push("Sin planes activos.")
  } else {
    for (const p of data.intentions) {
      const val = p.linked_value ? `, valor: ${p.linked_value}` : ""
      lines.push(`- Si "${p.trigger_situation}" → "${p.intended_action}"${val} | activado ${p.times_triggered}x, completado ${p.times_completed}x`)
    }
  }
  lines.push("")

  // Valores núcleo
  lines.push("== VALORES NÚCLEO (sesión más reciente) ==")
  if (data.values.length === 0) {
    lines.push("Sin sesión de valores registrada.")
  } else {
    const v = data.values[0]
    lines.push(`Valores: ${v.core_values.join(", ")}`)
    lines.push(`Visión relación con alimentación: ${v.relationship_with_food_vision}`)
    lines.push(`Acciones comprometidas: ${v.committed_actions.join("; ")}`)
  }
  lines.push("")

  // Nudges adaptativos
  lines.push(`== NUDGES ADAPTATIVOS (${data.nudges.length} en el período) ==`)
  if (data.nudges.length === 0) {
    lines.push("Sin nudges en el período.")
  } else {
    for (const n of data.nudges) {
      lines.push(`- ${d(n.generated_at)}: patrón=${n.pattern_detected.replace(/_/g, " ")}, ${n.action_taken ? "accionado" : "no accionado"}`)
    }
  }
  lines.push("")

  // Asignaciones terapéuticas activas
  lines.push(`== ASIGNACIONES TERAPÉUTICAS ACTIVAS (${data.assignments.length}) ==`)
  if (data.assignments.length === 0) {
    lines.push("Sin asignaciones activas.")
  } else {
    for (const a of data.assignments) {
      const adherencia = a.frequency_per_week > 0
        ? `${a.completions_this_week}/${a.frequency_per_week} completadas esta semana`
        : "sin objetivo semanal"
      lines.push(`- "${a.title}" (herramienta: ${a.tool_slug}) | frecuencia: ${a.frequency_per_week}×/semana | ${adherencia}`)
      lines.push(`  Instrucción: ${a.instruction}`)
    }
  }
  lines.push("")

  // Señales de atención (solo moderadas para no saturar el contexto)
  const moderateFlags = data.attentionFlags.filter(f => f.severity === "moderate")
  lines.push(`== SEÑALES DE ATENCIÓN ACTIVAS (${moderateFlags.length} moderadas de ${data.attentionFlags.length} total) ==`)
  if (moderateFlags.length === 0) {
    lines.push("Sin señales de atención moderadas activas.")
  } else {
    for (const f of moderateFlags) {
      const count = typeof f.evidence?.count === "number" ? `, ${f.evidence.count} ocurrencias` : ""
      lines.push(`- ${f.flag_type.replace(/_/g, " ")} (detectada ${f.detected_at.split("T")[0]}${count})`)
    }
    lines.push("NOTA: Estas señales son indicadores de patrón, no diagnóstico. Integrar en el análisis clínico con criterio profesional.")
  }

  return lines.join("\n")
}
