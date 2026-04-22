import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import * as React from 'react'
import WeeklyDigestEmail from '@/emails/WeeklyDigestEmail'
import { generateWeeklyDigest, getWeekBounds } from '@/lib/weekly-insights'

export const dynamic    = 'force-dynamic'
export const maxDuration = 300

const BATCH_SIZE = 50

function isoWeekNumber(weekStartStr: string): number {
  const d = new Date(weekStartStr)
  const jan4 = new Date(d.getFullYear(), 0, 4)
  return Math.ceil(((d.getTime() - jan4.getTime()) / 86_400_000 + jan4.getDay() + 1) / 7)
}

function formatWeekLabel(start: string, end: string): string {
  const s = new Date(start).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
  const e = new Date(end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  return `${s} – ${e}`
}

function formatDayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = new Resend(process.env.RESEND_API_KEY)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://food-mood.app'

  const { weekStart, weekEnd } = getWeekBounds()
  const weekLabel  = formatWeekLabel(weekStart, weekEnd)
  const weekNumber = isoWeekNumber(weekStart)
  const subject    = `🛒 Tu lista de la compra — Semana ${weekNumber} · Food·Mood`

  // 1. Subscribers con newsletter_active = true
  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('newsletter_active', true)

  if (profilesErr) return NextResponse.json({ error: profilesErr.message }, { status: 500 })
  if (!profiles?.length) return NextResponse.json({ success: true, sentCount: 0 })

  const subscriberIds = new Set(profiles.map((p: { id: string }) => p.id))

  // 2. Emails desde auth.users (service role)
  const { data: { users }, error: usersErr } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 500 })

  const subscribers = users.filter(u => u.email && subscriberIds.has(u.id))

  // 3. Curated content de esta semana (compartido por todos)
  const { data: curatedRaw } = await supabase
    .from('curated_content')
    .select('category, title, summary, url')
    .eq('week_start', weekStart)
    .eq('is_active', true)
    .order('created_at')

  const curatedItems = curatedRaw ?? []

  const results = { sent: 0, skipped: 0, errors: 0 }

  // 4. Enviar en lotes de 50 con pausa de 1s entre lotes
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)

    await Promise.all(batch.map(async (user) => {
      try {
        // Saltar si ya se envió esta semana
        const { data: existing } = await supabase
          .from('newsletter_sends')
          .select('id')
          .eq('user_id', user.id)
          .eq('week_start', weekStart)
          .maybeSingle()

        if (existing) { results.skipped++; return }

        // Generar digest personal
        const digest = await generateWeeklyDigest(user.id, supabase)

        await resend.emails.send({
          from:    'Food·Mood <hola@food-mood.app>',
          to:      user.email!,
          subject,
          react: React.createElement(WeeklyDigestEmail, {
            weekLabel,
            fmIndexAvg:    digest?.fm_index_avg    ?? null,
            fmIndexChange: digest?.fm_index_change ?? null,
            bestDayLabel:  digest?.best_day        ? formatDayLabel(digest.best_day) : null,
            bestDayIndex:  digest?.best_day_index  ?? null,
            correlation1:  digest?.top_correlation_1 ?? null,
            correlation2:  digest?.top_correlation_2 ?? null,
            correlation3:  digest?.top_correlation_3 ?? null,
            recordBroken:  digest?.record_broken   ?? false,
            curatedItems,
            appUrl,
          }),
        })

        await supabase.from('newsletter_sends').insert({
          user_id:    user.id,
          week_start: weekStart,
          week_end:   weekEnd,
          subject,
          status:     'sent',
          sent_at:    new Date().toISOString(),
        })

        results.sent++
      } catch (err: any) {
        await supabase.from('newsletter_sends').insert({
          user_id:    user.id,
          week_start: weekStart,
          week_end:   weekEnd,
          subject,
          status:     'error',
          error_msg:  err?.message ?? 'unknown',
        })
        results.errors++
      }
    }))

    if (i + BATCH_SIZE < subscribers.length) {
      await sleep(1000)
    }
  }

  return NextResponse.json({ success: true, weekStart, weekLabel, ...results })
}
