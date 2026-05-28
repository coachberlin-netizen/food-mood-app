import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import logger from "@/lib/logger"

const SaveSchema = z.object({
  initial_thought:           z.string().min(1).max(500),
  conversation:              z.array(z.object({
    role:    z.enum(["user", "assistant"]),
    content: z.string(),
  })).max(20),
  final_alternative_thought: z.string().max(500).optional(),
  emotion_before:            z.string().max(100).optional(),
  emotion_after:             z.string().max(100).optional(),
  intensity_before:          z.number().int().min(1).max(10).optional(),
  intensity_after:           z.number().int().min(1).max(10).optional(),
  techniques_used:           z.array(z.string().max(50)).max(10).default([]),
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

  const parsed = SaveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 })
  }

  const { error } = await supabase.from("socratic_dialogues").insert({
    user_id:  user.id,
    ended_at: new Date().toISOString(),
    ...parsed.data,
    emotion_before:            parsed.data.emotion_before ?? null,
    emotion_after:             parsed.data.emotion_after  ?? null,
    intensity_before:          parsed.data.intensity_before ?? null,
    intensity_after:           parsed.data.intensity_after  ?? null,
    final_alternative_thought: parsed.data.final_alternative_thought ?? null,
  })

  if (error) {
    logger.error({ err: error }, "behavioral/socratic/save: error insertando")
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
