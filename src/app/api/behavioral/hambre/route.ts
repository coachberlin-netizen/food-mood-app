import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import logger from "@/lib/logger"

const HambreSchema = z.object({
  physical_hunger:       z.number().int().min(0).max(10),
  emotional_hunger:      z.number().int().min(0).max(10),
  interoceptive_clarity: z.number().int().min(0).max(10),
  decided_to_eat:        z.boolean(),
  context_notes:         z.string().max(300).optional(),
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

  const parsed = HambreSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 })
  }

  const { error } = await supabase.from("hunger_thermometer_logs").insert({
    user_id: user.id,
    ...parsed.data,
    context_notes: parsed.data.context_notes ?? null,
  })

  if (error) {
    logger.error({ err: error }, "behavioral/hambre: error insertando")
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
