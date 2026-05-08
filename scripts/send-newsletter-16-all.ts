/**
 * Envía la newsletter Nº 16 a todos los suscriptores de la base de datos.
 * Uso: npx ts-node scripts/send-newsletter-16-all.ts
 */
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { buildHtml } from '../src/lib/editorial-newsletters/16-habitos-con-placer'

const SUBJECT = 'Los hábitos duraderos no se crean con disciplina. Se crean con placer. ✨'
const FROM    = 'Food·Mood <hola@food-mood.app>'
const DELAY   = 1500

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  const apiKey      = process.env.RESEND_API_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!apiKey)      { console.error('❌ Falta RESEND_API_KEY');             process.exit(1) }
  if (!supabaseUrl) { console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL');   process.exit(1) }
  if (!serviceKey)  { console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY');  process.exit(1) }

  const resend   = new Resend(apiKey)
  const supabase = createClient(supabaseUrl, serviceKey)

  // Obtener todos los emails de la tabla leads
  const { data: leads, error } = await supabase
    .from('leads')
    .select('email')
    .order('created_at', { ascending: true })

  if (error) { console.error('❌ Error leyendo leads:', error.message); process.exit(1) }

  const emailSet = new Set((leads ?? []).map((l: { email: string }) => l.email.toLowerCase().trim()))
  const emails = Array.from(emailSet)

  if (emails.length === 0) {
    console.log('⚠️  No hay suscriptores en la tabla leads.')
    process.exit(0)
  }

  console.log(`\n📬 Enviando newsletter Nº 16 a ${emails.length} suscriptores\n`)
  const html = buildHtml()

  for (const email of emails) {
    process.stdout.write(`  → ${email} ... `)
    try {
      const { data, error: sendError } = await resend.emails.send({
        from:    FROM,
        to:      email,
        subject: `[Nº16] ${SUBJECT}`,
        html,
      })
      if (sendError) throw new Error(sendError.message)
      console.log(`✅  id: ${data?.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`❌  ${msg}`)
    }
    if (email !== emails[emails.length - 1]) await sleep(DELAY)
  }

  console.log('\n✨ Hecho.\n')
}

main()
