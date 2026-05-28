import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import logger from "@/lib/logger"

const BodyLocationSchema = z.object({
  zone:      z.string().min(1).max(50),
  intensity: z.number().int().min(0).max(10),
  quality:   z.string().max(50).default(""),
})

const CheckinSchema = z.object({
  nervous_system_state:  z.enum([
    "ventral","sympathetic_active","sympathetic_anxious",
    "dorsal_freeze","dorsal_collapse","mixed",
  ]),
  secondary_state:       z.enum([
    "ventral","sympathetic_active","sympathetic_anxious",
    "dorsal_freeze","dorsal_collapse",
  ]).optional(),
  body_locations:        z.array(BodyLocationSchema).max(9).default([]),
  interoceptive_clarity: z.number().int().min(0).max(10),
  dominant_sensation:    z.string().max(100).optional(),
  pre_meal:              z.boolean().default(false),
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

  const parsed = CheckinSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 })
  }

  const { error } = await supabase
    .from("interoceptive_checkins")
    .insert({ user_id: user.id, ...parsed.data })

  if (error) {
    logger.error({ err: error }, "behavioral/checkin: error insertando")
    return NextResponse.json({ error: "Error al guardar el check-in" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
