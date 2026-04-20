import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { generateWeeklyDigest, getWeekBounds } from "@/lib/weekly-insights"
import WeeklyDigestEmail from "@/emails/WeeklyDigestEmail"
import * as React from "react"

export const maxDuration = 300

function formatWeekLabel(start: string, end: string): string {
  const s = new Date(start).toLocaleDateString("es-ES", { day: "numeric", month: "long" })
  const e = new Date(end).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  return `${s} – ${e}`
}

function formatDayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
}

export async function POST(req: NextRequest) {
  // Protect: require CRON_SECRET header
  const secret = process.env.CRON_SECRET
  const auth   = req.headers.get("authorization") ?? ""
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = new Resend(process.env.RESEND_API_KEY)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://food-mood.app"
  const { weekStart, weekEnd } = getWeekBounds()

  // Get all users with at least one fm_index_log entry
  const { data: usersWithData } = await supabaseAdmin
    .from("fm_index_log")
    .select("user_id")
    .gte("log_date", new Date(Date.now() - 90 * 86_400_000).toISOString().split("T")[0])

  const uniqueUserIds = Array.from(
    new Set((usersWithData ?? []).map((r: { user_id: string }) => r.user_id))
  )

  // Get curated content for this week (shared across all users)
  const { data: curatedRaw } = await supabaseAdmin
    .from("blog_posts")
    .select("category, title, excerpt, external_url")
    .eq("week_start", weekStart)
    .not("category", "is", null)
    .eq("status", "published")
    .order("category", { ascending: true })
    .limit(10)

  const curatedItems = (curatedRaw ?? []).map((r: any) => ({
    category: r.category as string,
    title:    r.title    as string,
    summary:  r.excerpt  as string | null,
    url:      r.external_url as string | null,
  }))

  const results = { sent: 0, skipped: 0, errors: 0 }

  for (const userId of uniqueUserIds) {
    try {
      // Skip if already sent this week
      const { data: existing } = await supabaseAdmin
        .from("weekly_digest")
        .select("email_sent")
        .eq("user_id", userId)
        .eq("week_start", weekStart)
        .maybeSingle()

      if (existing?.email_sent) { results.skipped++; continue }

      // Generate digest
      const digest = await generateWeeklyDigest(userId, supabaseAdmin)
      if (!digest) { results.skipped++; continue }

      // Get user email
      const { data: { user: authUser } } = await supabaseAdmin.auth.admin.getUserById(userId)
      if (!authUser?.email) { results.skipped++; continue }

      const weekLabel = formatWeekLabel(weekStart, weekEnd)

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "hola@food-mood.app",
        to:   authUser.email,
        subject: `Tu semana Food·Mood · ${weekLabel}`,
        react: React.createElement(WeeklyDigestEmail, {
          weekLabel,
          fmIndexAvg:    digest.fm_index_avg,
          fmIndexChange: digest.fm_index_change,
          bestDayLabel:  digest.best_day ? formatDayLabel(digest.best_day) : null,
          bestDayIndex:  digest.best_day_index,
          correlation1:  digest.top_correlation_1,
          correlation2:  digest.top_correlation_2,
          correlation3:  digest.top_correlation_3,
          recordBroken:  digest.record_broken,
          curatedItems,
          appUrl,
        }),
      })

      // Mark sent
      await supabaseAdmin
        .from("weekly_digest")
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("week_start", weekStart)

      results.sent++
    } catch {
      results.errors++
    }
  }

  return NextResponse.json({ ok: true, weekStart, ...results })
}
