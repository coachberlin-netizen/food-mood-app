import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import * as React from 'react'
import WeeklyDigestEmail from '@/emails/WeeklyDigestEmail'
import { generateWeeklyDigest } from '@/lib/weekly-insights'

export const dynamic     = 'force-dynamic'
export const maxDuration = 300

const BATCH_SIZE = 50

function formatWeekLabel(start: string): string {
  const s   = new Date(start)
  const end = new Date(s)
  end.setDate(s.getDate() + 6)
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString('es-ES', opts)
  return `${fmt(s, { day: 'numeric', month: 'long' })} – ${fmt(end, { day: 'numeric', month: 'long', year: 'numeric' })}`
}

function isoWeekNumber(weekStartStr: string): number {
  const d   = new Date(weekStartStr)
  const jan4 = new Date(d.getFullYear(), 0, 4)
  return Math.ceil(((d.getTime() - jan4.getTime()) / 86_400_000 + jan4.getDay() + 1) / 7)
}

function formatDayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// Reenvía una edición ya enviada solo a suscriptores que no la recibieron todavía.
// Útil para nuevos suscriptores que se unieron después del envío original.
export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { week_start } = await req.json()
  if (!week_start) {
    return NextResponse.json({ error: 'week_start requerido' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend  = new Resend(process.env.RESEND_API_KEY)
  const appUrl  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://food-mood.app'

  // Verificar que la edición existe y está enviada
  const { data: editionCheck } = await supabase
    .from('curated_content')
    .select('week_start')
    .eq('week_start', week_start)
    .eq('status', 'sent')
    .limit(1)
    .maybeSingle()

  if (!editionCheck) {
    return NextResponse.json({ error: 'Edición no encontrada o no enviada aún' }, { status: 404 })
  }

  const weekLabel  = formatWeekLabel(week_start)
  const weekNumber = isoWeekNumber(week_start)
  const subject    = `Tu resumen — Semana ${weekNumber} · Food·Mood`

  // Contenido curado de la edición
  const { data: curatedRaw } = await supabase
    .from('curated_content')
    .select('category, title, summary, url')
    .eq('week_start', week_start)
    .eq('status', 'sent')
    .order('created_at')

  const curatedItems = curatedRaw ?? []

  // Suscriptores activos que NO han recibido esta edición
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('newsletter_active', true)

  if (!profiles?.length) {
    return NextResponse.json({ success: true, weekStart: week_start, sentCount: 0, message: 'Sin suscriptores activos' })
  }

  const subscriberIds = new Set(profiles.map((p: { id: string }) => p.id))

  // Quienes ya recibieron esta edición
  const { data: alreadySent } = await supabase
    .from('newsletter_sends')
    .select('user_id')
    .eq('week_start', week_start)
    .eq('status', 'sent')

  const alreadySentIds = new Set((alreadySent ?? []).map((r: { user_id: string }) => r.user_id))

  // Obtener emails de los suscriptores nuevos
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const subscribers = users.filter(u =>
    u.email &&
    subscriberIds.has(u.id) &&
    !alreadySentIds.has(u.id)
  )

  if (!subscribers.length) {
    return NextResponse.json({ success: true, weekStart: week_start, sentCount: 0, message: 'Todos los suscriptores ya recibieron esta edición' })
  }

  const results = { sent: 0, errors: 0 }

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)

    await Promise.all(batch.map(async (user) => {
      try {
        const digest = await generateWeeklyDigest(user.id, supabase)

        await resend.emails.send({
          from:  'Food·Mood <hola@food-mood.app>',
          to:    user.email!,
          subject,
          react: React.createElement(WeeklyDigestEmail, {
            weekLabel,
            fmIndexAvg:    digest?.fm_index_avg      ?? null,
            fmIndexChange: digest?.fm_index_change   ?? null,
            bestDayLabel:  digest?.best_day          ? formatDayLabel(digest.best_day) : null,
            bestDayIndex:  digest?.best_day_index    ?? null,
            correlation1:  digest?.top_correlation_1 ?? null,
            correlation2:  digest?.top_correlation_2 ?? null,
            correlation3:  digest?.top_correlation_3 ?? null,
            recordBroken:  digest?.record_broken     ?? false,
            curatedItems,
            appUrl,
          }),
        })

        await supabase.from('newsletter_sends').insert({
          user_id:    user.id,
          week_start: week_start,
          subject,
          status:     'sent',
          sent_at:    new Date().toISOString(),
        })

        results.sent++
      } catch (err: any) {
        await supabase.from('newsletter_sends').insert({
          user_id:    user.id,
          week_start: week_start,
          subject,
          status:     'error',
          error_msg:  err?.message ?? 'unknown',
        })
        results.errors++
      }
    }))

    if (i + BATCH_SIZE < subscribers.length) await sleep(1000)
  }

  return NextResponse.json({ success: true, weekStart: week_start, weekLabel, ...results })
}
