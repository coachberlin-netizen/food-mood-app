import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import logger from "@/lib/logger"

const NSS = z.enum([
  "ventral","sympathetic_active","sympathetic_anxious",
  "dorsal_freeze","dorsal_collapse","mixed",
])

const MealSchema = z.object({
  emotion_before:            z.string().min(1).max(100),
  intensity_before:          z.number().int().min(1).max(10),
  emotion_after:             z.string().min(1).max(100),
  intensity_after:           z.number().int().min(1).max(10),
  meal_description:          z.string().max(200).optional(),
  notes:                     z.string().max(400).optional(),
  post_nervous_system_state: NSS.optional(),
  body_change:               z.enum(["mejor","igual","peor"]).optional(),
  pre_checkin_id:            z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const parsed = MealSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 })
  }

  const { error } = await supabase.from("emotional_meal_logs").insert({
    user_id: user.id,
    emotion_before:            parsed.data.emotion_before,
    intensity_before:          parsed.data.intensity_before,
    emotion_after:             parsed.data.emotion_after,
    intensity_after:           parsed.data.intensity_after,
    meal_description:          parsed.data.meal_description ?? null,
    notes:                     parsed.data.notes ?? null,
    post_nervous_system_state: parsed.data.post_nervous_system_state ?? null,
    body_change:               parsed.data.body_change ?? null,
    pre_checkin_id:            parsed.data.pre_checkin_id ?? null,
  })

  if (error) {
    logger.error({ err: error }, "behavioral/meal: error insertando")
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
