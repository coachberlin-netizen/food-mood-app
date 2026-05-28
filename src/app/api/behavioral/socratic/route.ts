import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"
import logger from "@/lib/logger"
import { SOCRATIC_SYSTEM_PROMPT } from "@/lib/behavioral/prompts"

const MAX_TURNS   = 8
const DAILY_LIMIT = 20

const MessageSchema = z.object({
  role:    z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1000),
})

const BodySchema = z.object({
  messages:         z.array(MessageSchema).max(MAX_TURNS * 2 + 2),
  initial_thought:  z.string().min(1).max(500),
  emotion_before:   z.string().max(100).optional(),
  intensity_before: z.number().int().min(1).max(10).optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("ai_messages_today, ai_messages_reset_at")
    .eq("id", user.id)
    .maybeSingle()

  const now        = new Date()
  const todayUtc   = now.toISOString().slice(0, 10)
  const resetDay   = profile?.ai_messages_reset_at
    ? new Date(profile.ai_messages_reset_at).toISOString().slice(0, 10)
    : null
  const needsReset = resetDay !== todayUtc
  const count      = needsReset ? 0 : (profile?.ai_messages_today ?? 0)
  if (count >= DAILY_LIMIT) {
    return NextResponse.json({ error: "Límite diario de IA alcanzado", limitReached: true }, { status: 429 })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 })
  }

  const { messages, initial_thought, emotion_before, intensity_before } = parsed.data
  const userTurns  = messages.filter(m => m.role === "user").length
  const isLastTurn = userTurns >= MAX_TURNS

  const contextLine = [
    emotion_before   ? `Emoción antes: "${emotion_before}"` : "",
    intensity_before ? `Intensidad antes: ${intensity_before}/10` : "",
  ].filter(Boolean).join(". ")

  const systemFull = [
    SOCRATIC_SYSTEM_PROMPT,
    `\n\nPensamiento inicial de la persona: "${initial_thought}"`,
    contextLine ? `\nContexto: ${contextLine}` : "",
    isLastTurn
      ? "\n\nEste es el TURNO FINAL (8/8). Formula la pregunta de cierre para que la persona reformule el pensamiento inicial con sus propias palabras."
      : `\n\nTurno actual: ${userTurns + 1} de ${MAX_TURNS}.`,
  ].join("")

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Servicio de IA no disponible" }, { status: 503 })
  }

  try {
    const anthropic = new Anthropic({ apiKey })
    const response  = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: [{ type: "text", text: systemFull, cache_control: { type: "ephemeral" } }],
      messages,
    })

    const reply = response.content[0]?.type === "text" ? response.content[0].text : ""

    const newCount = count + 1
    const upd: Record<string, unknown> = { ai_messages_today: newCount }
    if (needsReset) upd.ai_messages_reset_at = now.toISOString()
    await supabase.from("profiles").update(upd).eq("id", user.id)

    return NextResponse.json({ reply, complete: isLastTurn })
  } catch (err) {
    logger.error({ err }, "behavioral/socratic: error IA")
    return NextResponse.json({ error: "Error del servicio de IA" }, { status: 502 })
  }
}
