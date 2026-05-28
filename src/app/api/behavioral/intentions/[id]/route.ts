import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import logger from "@/lib/logger"

const PatchSchema = z.object({
  action: z.enum(["toggle_active", "trigger", "complete"]),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("implementation_intentions")
    .select("id, is_active, times_triggered, times_completed")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!existing) {
    return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 })
  }

  let update: Record<string, unknown>
  switch (parsed.data.action) {
    case "toggle_active":
      update = { is_active: !existing.is_active }
      break
    case "trigger":
      update = { times_triggered: existing.times_triggered + 1 }
      break
    case "complete":
      update = { times_completed: existing.times_completed + 1 }
      break
  }

  const { error } = await supabase
    .from("implementation_intentions")
    .update(update)
    .eq("id", params.id)

  if (error) {
    logger.error({ err: error }, "behavioral/intentions PATCH: error actualizando")
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { error } = await supabase
    .from("implementation_intentions")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id)

  if (error) {
    logger.error({ err: error }, "behavioral/intentions DELETE: error")
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
