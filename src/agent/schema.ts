import { z } from 'zod'

// ── Enums ─────────────────────────────────────────────────────────────────────

export const CategoriaFoodMood = z.enum([
  'Activación', 'Calma', 'Focus', 'Social', 'Reset', 'Confort',
])

export const PalancaLongevidad = z.enum([
  'autofagia', 'NAD+', 'microbiota', 'AGEs', 'AMPK',
  'sirtuinas', 'senolíticos', 'espermidina', 'telómeros', 'BDNF', 'tono_vagal',
])

export const NivelEvidencia = z.enum(['A', 'B', 'C', 'D'])

export const TipoDerivacion = z.enum([
  'crisis_emocional', 'tca', 'condicion_medica_activa',
])

// ── Modo: recomendacion ───────────────────────────────────────────────────────

export const RecomendacionSchema = z.object({
  modo: z.literal('recomendacion'),
  receta: z.object({
    titulo:             z.string().min(1),
    ingredientes:       z.array(z.string()).min(1),
    pasos:              z.array(z.string()).min(1),
    categoria_food_mood: CategoriaFoodMood,
    tiempo_min:         z.number().int().positive(),
  }),
  microaccion: z.object({
    titulo:      z.string().min(1),
    descripcion: z.string().min(1),
    duracion_min: z.number().int().nonnegative(),
  }),
  microcontenido: z.object({
    titulo:              z.string().min(1),
    porque:              z.string().min(1),
    palancas_longevidad: z.array(PalancaLongevidad).min(1),
    nivel_evidencia:     NivelEvidencia,
    fuentes:             z.array(z.string()).min(1),
  }),
  advertencias: z.array(z.string()),
})

// ── Modo: respuesta_libre ─────────────────────────────────────────────────────

export const RespuestaLibreSchema = z.object({
  modo:        z.literal('respuesta_libre'),
  texto:       z.string().min(1).max(3000),
  advertencias: z.array(z.string()),
})

// ── Modo: derivar ─────────────────────────────────────────────────────────────

export const DerivarSchema = z.object({
  modo:             z.literal('derivar'),
  mensaje:          z.string().min(1),
  tipo_derivacion:  TipoDerivacion,
  recursos:         z.array(z.string()).min(1),
})

// ── Modo: necesito_mas_contexto ───────────────────────────────────────────────

export const NecesitoMasContextoSchema = z.object({
  modo:     z.literal('necesito_mas_contexto'),
  pregunta: z.string().min(1),
  opciones: z.array(z.string()).min(2),
})

// ── Union discriminada ────────────────────────────────────────────────────────

export const AgentResponseSchema = z.discriminatedUnion('modo', [
  RecomendacionSchema,
  RespuestaLibreSchema,
  DerivarSchema,
  NecesitoMasContextoSchema,
])

// ── Types ─────────────────────────────────────────────────────────────────────

export type AgentResponse         = z.infer<typeof AgentResponseSchema>
export type Recomendacion         = z.infer<typeof RecomendacionSchema>
export type RespuestaLibre        = z.infer<typeof RespuestaLibreSchema>
export type Derivar               = z.infer<typeof DerivarSchema>
export type NecesitoMasContexto   = z.infer<typeof NecesitoMasContextoSchema>

export type CategoriaFoodMoodType  = z.infer<typeof CategoriaFoodMood>
export type PalancaLongevidadType  = z.infer<typeof PalancaLongevidad>
export type NivelEvidenciaType     = z.infer<typeof NivelEvidencia>
