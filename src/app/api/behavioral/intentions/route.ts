import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import logger from "@/lib/logger"

const CreateSchema = z.object({
  trigger_situation: z.string().min(1).max(300),
  intended_action:   z.string().min(1).max(300),
  linked_value:      z.string().max(80).optional(),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("implementation_intentions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Error al obtener planes" }, { status: 500 })
  }

  return NextResponse.json({ intentions: data })
}

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

  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 })
  }

  const { data, error } = await supabase.from("implementation_intentions").insert({
    user_id:           user.id,
    trigger_situation: parsed.data.trigger_situation,
    intended_action:   parsed.data.intended_action,
    linked_value:      parsed.data.linked_value ?? null,
  }).select().single()

  if (error) {
    logger.error({ err: error }, "behavioral/intentions POST: error insertando")
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }

  return NextResponse.json({ intention: data })
}
