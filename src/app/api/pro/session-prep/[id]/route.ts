import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"
import logger from "@/lib/logger"

function makeSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

const PatchSchema = z.object({
  professional_notes:  z.string().max(5000).optional(),
  suggested_questions: z.array(z.string().max(500)).max(10).optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 })

  // RLS guarantees this professional can only see their own session_preps
  const { data: prep, error } = await supabase
    .from("session_preps")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error || !prep) return NextResponse.json({ error: "Informe no encontrado." }, { status: 404 })

  return NextResponse.json({ prep })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Datos no válidos." }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (parsed.data.professional_notes  !== undefined) updates.professional_notes  = parsed.data.professional_notes
  if (parsed.data.suggested_questions !== undefined) updates.suggested_questions = parsed.data.suggested_questions

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin campos para actualizar." }, { status: 400 })
  }

  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 })

  const { data: prep, error } = await supabase
    .from("session_preps")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error || !prep) {
    logger.error({ err: error, id }, "session-prep PATCH: error actualizando informe")
    return NextResponse.json({ error: "Error al actualizar el informe." }, { status: 500 })
  }

  return NextResponse.json({ prep })
}
