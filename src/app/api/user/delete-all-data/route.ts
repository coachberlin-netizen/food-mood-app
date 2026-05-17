import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { createHash } from "crypto"

const adminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

const USER_TABLES = [
  "biomarker_connections",
  "biomarker_samples",
  "oracle_checkins",
  "symptom_log",
  "emotional_palettes",
  "test_results",
  "diary_entries",
  "mood_history",
  "user_recipe_history",
  "user_challenges",
  "push_subscriptions",
  "newsletter_sends",
  "weekly_digest",
  "subscriptions",
  "user_consent",
  "profiles",
  "user_profiles",
]

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Autenticación requerida" }, { status: 401 })
  }

  const admin = adminClient()
  const userId = user.id
  const deletedAt = new Date().toISOString()
  const errors: string[] = []

  // Delete from every user table
  for (const table of USER_TABLES) {
    const idField = table === "profiles" || table === "user_profiles" ? "id" : "user_id"
    const { error } = await admin.from(table).delete().eq(idField, userId)
    if (error && error.code !== "PGRST116") {
      // PGRST116 = table does not exist (skip gracefully)
      errors.push(`${table}: ${error.message}`)
    }
  }

  // Log the erasure in audit_log
  const ipRaw = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown"
  const ipHash = createHash("sha256").update(ipRaw).digest("hex")

  await admin.from("audit_log").insert({
    user_id:    userId,
    action:     "GDPR_DELETE",
    table_name: "ALL",
    ip_hash:    ipHash,
    metadata:   { deleted_at: deletedAt, errors: errors.length > 0 ? errors : null },
  })

  // Delete the auth user account (irreversible)
  const { error: authDeleteError } = await admin.auth.admin.deleteUser(userId)
  if (authDeleteError) {
    errors.push(`auth.users: ${authDeleteError.message}`)
  }

  // Confirmation hash — proves deletion happened at this timestamp
  const confirmHash = createHash("sha256")
    .update(`${userId}:${deletedAt}:${process.env.ENCRYPTION_SECRET ?? ""}`)
    .digest("hex")

  return NextResponse.json({
    ok: true,
    deleted_at: deletedAt,
    confirmation_hash: confirmHash,
    ...(errors.length > 0 && { partial_errors: errors }),
  })
}
