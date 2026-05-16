import { z } from "zod";

export const RecetaSchema = z.object({
  titulo: z.string(),
  ingredientes: z.array(z.string()).min(1),
  pasos: z.array(z.string()).min(1),
  categoria_food_mood: z.enum(["Activación","Calma","Focus","Social","Reset","Confort"]),
  tiempo_min: z.number().int().positive(),
});

export const AgentResponseSchema = z.discriminatedUnion("modo", [
  z.object({
    modo: z.literal("recomendacion"),
    receta: RecetaSchema,
    microaccion: z.object({ titulo: z.string(), descripcion: z.string(), duracion_min: z.number().int().positive() }),
    microcontenido: z.object({
      titulo: z.string(),
      porque: z.string(),
      palancas_longevidad: z.array(z.string()).min(1),
      nivel_evidencia: z.enum(["A","B","C","D"]),
      fuentes: z.array(z.string()),
    }),
    advertencias: z.array(z.string()).default([]),
  }),
  z.object({ modo: z.literal("respuesta_libre"), texto: z.string().max(2000), advertencias: z.array(z.string()).default([]) }),
  z.object({
    modo: z.literal("derivar"),
    mensaje: z.string(),
    tipo_derivacion: z.enum(["crisis_emocional","tca","condicion_medica_activa","farmaceutico"]),
    recursos: z.array(z.string()),
  }),
  z.object({ modo: z.literal("necesito_mas_contexto"), pregunta: z.string(), opciones: z.array(z.string()).default([]) }),
]);

export type AgentResponse = z.infer<typeof AgentResponseSchema>;
export type Receta = z.infer<typeof RecetaSchema>;
