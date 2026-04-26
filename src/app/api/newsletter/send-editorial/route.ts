import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { EDITORIAL_NEWSLETTERS } from '@/lib/editorial-newsletters'

export const dynamic     = 'force-dynamic'
export const maxDuration = 300

const BATCH_SIZE = 50

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── 1. Encontrar la siguiente newsletter no enviada ───────────────────────
  const { data: sent } = await supabase
    .from('editorial_newsletters')
    .select('numero')
    .not('sent_at', 'is', null)

  const sentNums = new Set((sent ?? []).map((r: { numero: number }) => r.numero))
  const next = EDITORIAL_NEWSLETTERS.find(n => !sentNums.has(n.numero))

  if (!next) {
    return NextResponse.json({ success: true, message: 'No hay newsletters pendientes de envío' })
  }

  const html = next.buildHtml()

  // ── 2. Suscriptores activos ───────────────────────────────────────────────
  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('newsletter_active', true)

  if (profilesErr) return NextResponse.json({ error: profilesErr.message }, { status: 500 })
  if (!profiles?.length) {
    await markSent(supabase, next.numero, 0)
    return NextResponse.json({ success: true, numero: next.numero, sentCount: 0 })
  }

  const subscriberIds = new Set(profiles.map((p: { id: string }) => p.id))

  const { data: { users }, error: usersErr } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 500 })

  const subscribers = users.filter(u => u.email && subscriberIds.has(u.id))

  // ── 3. Enviar en lotes (saltando los que ya la recibieron) ────────────────
  const results = { sent: 0, skipped: 0, errors: 0 }

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)

    await Promise.all(batch.map(async (user) => {
      try {
        const { data: existing } = await supabase
          .from('editorial_sends')
          .select('id')
          .eq('user_id', user.id)
          .eq('newsletter_num', next.numero)
          .maybeSingle()

        if (existing) { results.skipped++; return }

        const res = await fetch('https://api.resend.com/emails', {
          method:  'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type':  'application/json',
          },
          body: JSON.stringify({
            from:    'Food·Mood <hola@food-mood.app>',
            to:      user.email,
            subject: next.subject,
            html,
          }),
        })

        if (!res.ok) throw new Error(await res.text())

        await supabase.from('editorial_sends').insert({
          user_id:        user.id,
          newsletter_num: next.numero,
          status:         'sent',
          sent_at:        new Date().toISOString(),
        })

        results.sent++
      } catch (err: any) {
        await supabase.from('editorial_sends').insert({
          user_id:        user.id,
          newsletter_num: next.numero,
          status:         'error',
          error_msg:      err?.message ?? 'unknown',
        })
        results.errors++
      }
    }))

    if (i + BATCH_SIZE < subscribers.length) await sleep(1000)
  }

  // ── 4. Marcar como enviada ────────────────────────────────────────────────
  await markSent(supabase, next.numero, results.sent)

  return NextResponse.json({
    success: true,
    numero:  next.numero,
    slug:    next.slug,
    subject: next.subject,
    ...results,
  })
}

async function markSent(
  supabase: ReturnType<typeof createClient<any>>,
  numero: number,
  sentCount: number,
) {
  await supabase.from('editorial_newsletters').upsert({
    numero,
    slug:       EDITORIAL_NEWSLETTERS.find(n => n.numero === numero)?.slug ?? '',
    subject:    EDITORIAL_NEWSLETTERS.find(n => n.numero === numero)?.subject ?? '',
    sent_at:    new Date().toISOString(),
    sent_count: sentCount,
  })
}
