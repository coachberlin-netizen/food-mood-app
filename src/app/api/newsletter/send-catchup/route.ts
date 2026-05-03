import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { EDITORIAL_NEWSLETTERS } from '@/lib/editorial-newsletters'

export const dynamic     = 'force-dynamic'
export const maxDuration = 300

const BATCH_SIZE = 50

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

/**
 * Envía a cada suscriptor activo todas las newsletters editoriales
 * que ya se enviaron globalmente pero que ellos aún no han recibido.
 *
 * Se llama tras send-editorial (o diariamente) para que los nuevos
 * suscriptores reciban el archivo completo en el primer ciclo.
 */
export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Newsletters ya enviadas globalmente
  const { data: sentGlobal } = await supabase
    .from('editorial_newsletters')
    .select('numero, subject')
    .not('sent_at', 'is', null)
    .order('numero')

  if (!sentGlobal?.length) {
    return NextResponse.json({ success: true, message: 'Ninguna newsletter enviada aún' })
  }

  // 2. Suscriptores activos
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('newsletter_active', true)

  if (!profiles?.length) {
    return NextResponse.json({ success: true, message: 'Sin suscriptores activos' })
  }

  const subscriberIds = profiles.map((p: { id: string }) => p.id)

  // 3. Todos los registros de editorial_sends para estos suscriptores
  const { data: allSends } = await supabase
    .from('editorial_sends')
    .select('user_id, newsletter_num')
    .in('user_id', subscriberIds)
    .eq('status', 'sent')

  // Índice: userId → Set<newsletter_num>
  const receivedMap = new Map<string, Set<number>>()
  for (const row of allSends ?? []) {
    if (!receivedMap.has(row.user_id)) receivedMap.set(row.user_id, new Set())
    receivedMap.get(row.user_id)!.add(row.newsletter_num)
  }

  // 4. Emails de suscriptores
  const usersRes = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (usersRes.error) return NextResponse.json({ error: usersRes.error.message }, { status: 500 })

  const subscriberSet = new Set(subscriberIds)
  const users = usersRes.data.users.filter(u => u.email && subscriberSet.has(u.id))

  const totals = { sent: 0, skipped: 0, errors: 0 }

  // 5. Por cada newsletter global ya enviada, enviar a quien no la tenga
  for (const nlMeta of sentGlobal) {
    const nl = EDITORIAL_NEWSLETTERS.find(n => n.numero === nlMeta.numero)
    if (!nl) continue

    const html = nl.buildHtml()

    // Usuarios que faltan esta newsletter
    const pending = users.filter(u => !receivedMap.get(u.id)?.has(nl.numero))
    if (!pending.length) continue

    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
      const batch = pending.slice(i, i + BATCH_SIZE)

      await Promise.all(batch.map(async (user) => {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method:  'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type':  'application/json',
            },
            body: JSON.stringify({
              from:    'Food·Mood <hola@food-mood.app>',
              to:      user.email,
              subject: nl.subject,
              html,
            }),
          })

          if (!res.ok) throw new Error(await res.text())

          await supabase.from('editorial_sends').insert({
            user_id:        user.id,
            newsletter_num: nl.numero,
            status:         'sent',
            sent_at:        new Date().toISOString(),
          })

          // Actualizar índice local para evitar duplicados en la misma ejecución
          if (!receivedMap.has(user.id)) receivedMap.set(user.id, new Set())
          receivedMap.get(user.id)!.add(nl.numero)

          totals.sent++
        } catch (err: any) {
          await supabase.from('editorial_sends').insert({
            user_id:        user.id,
            newsletter_num: nl.numero,
            status:         'error',
            error_msg:      err?.message ?? 'unknown',
          })
          totals.errors++
        }
      }))

      if (i + BATCH_SIZE < pending.length) await sleep(800)
    }
  }

  return NextResponse.json({ success: true, ...totals })
}
