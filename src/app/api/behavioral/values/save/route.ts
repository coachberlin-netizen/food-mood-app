import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import logger from "@/lib/logger"

const SaveSchema = z.object({
  core_values:                 z.array(z.string().min(1).max(80)).min(1).max(5),
  relationship_with_food_vision: z.string().min(1).max(1000),
  narrative_vision:            z.string().max(1000).optional(),
  committed_actions:           z.array(z.string().min(1).max(200)).min(1).max(3),
  ai_dialogue_turns:           z.array(z.object({
    role:    z.enum(["user", "assistant"]),
    content: z.string(),
  })).max(20),
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

  const { error } = await supabase.from("values_clarifications").insert({
    user_id:                       user.id,
    core_values:                   parsed.data.core_values,
    relationship_with_food_vision: parsed.data.relationship_with_food_vision,
    narrative_vision:              parsed.data.narrative_vision ?? null,
    committed_actions:             parsed.data.committed_actions,
    ai_dialogue_turns:             parsed.data.ai_dialogue_turns,
  })

  if (error) {
    logger.error({ err: error }, "behavioral/values/save: error insertando")
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
