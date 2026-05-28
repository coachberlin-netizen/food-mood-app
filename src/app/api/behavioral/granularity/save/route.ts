import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import logger from "@/lib/logger"

const SaveSchema = z.object({
  initial_emotion_word: z.string().min(1).max(200),
  final_emotion_words:  z.array(z.string().min(1).max(80)).min(1).max(10),
  context:              z.string().max(300).optional(),
  ai_dialogue_turns:    z.array(z.object({
    role:    z.enum(["user", "assistant"]),
    content: z.string(),
  })).max(20),
})

function computeGranularityScore(words: string[]): number {
  const unique = new Set(words.map(w => w.toLowerCase().trim())).size
  const BASIC = new Set(["bien","mal","regular","triste","feliz","nervioso","nerviosa","cansado","cansada","estresado","estresada","rara","raro","agobiada","agobiado"])
  if (unique === 0) return 1
  if (unique === 1) return BASIC.has(words[0].toLowerCase().trim()) ? 1 : 2
  if (unique === 2) return 3
  if (unique === 3) return 4
  return 5
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

  const parsed = SaveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos" }, { status: 400 })
  }

  const { initial_emotion_word, final_emotion_words, context, ai_dialogue_turns } = parsed.data
  const granularity_score = computeGranularityScore(final_emotion_words)

  const { error } = await supabase.from("emotion_granularity_logs").insert({
    user_id: user.id,
    initial_emotion_word,
    final_emotion_words,
    granularity_score,
    context:          context ?? null,
    ai_dialogue_turns,
  })

  if (error) {
    logger.error({ err: error }, "behavioral/granularity/save: error insertando")
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }

  return NextResponse.json({ success: true, granularity_score })
}
