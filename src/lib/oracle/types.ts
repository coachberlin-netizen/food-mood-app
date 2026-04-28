export type MoodId = 'activacion' | 'calma' | 'focus' | 'social' | 'reset' | 'confort'

export interface OracleInput {
  emotions:       string[]       // hasta 2, índice 0 = dominante
  energyLevel:    number         // 1–10
  sleepQuality:   number         // 1–5
  primarySymptom: string | null
  cravingState:   string | null
  cyclePhase:     string | null
  notes:          string
}

export interface OracleRecipeQuery {
  moodId: MoodId
  tags:   string[]
}

export interface OracleSuggestedAction {
  focus:  string[]
  ritual: string
}

export interface OracleScore {
  dominantNeed:      MoodId
  urgencyLevel:      1 | 2 | 3   // 1 = suave · 2 = moderado · 3 = alto
  reading:           string       // 3–5 frases compuestas por reglas
  insight:           string | null  // patrón cruzado específico, si existe
  nutritionPriority: string[]     // top 4 prioridades nutricionales
  ritual:            string       // acción concreta para hoy
  recipeQuery:       OracleRecipeQuery
}

/** Contrato estable para emotional_mix jsonb en oracle_checkins */
export interface EmotionalMix {
  emotions:      string[]               // seleccionadas por el usuario, dominante primero
  weights:       Record<string, number> // dominante = 1.0, secundaria = 0.4
  mixed_color:   string                 // hex
  dominant_need: MoodId                 // calculada por el scoring engine
}
