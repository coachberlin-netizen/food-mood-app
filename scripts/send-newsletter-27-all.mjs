import { readFileSync } from 'fs'

// Leer variables de entorno
const env = readFileSync('.env.local', 'utf8')
const resendKey     = env.match(/RESEND_API_KEY="?([^"\n]+)/)?.[1]
const supabaseUrl   = env.match(/NEXT_PUBLIC_SUPABASE_URL="?([^"\n]+)/)?.[1]
const serviceKey    = env.match(/SUPABASE_SERVICE_ROLE_KEY="?([^"\n]+)/)?.[1]

if (!resendKey)   { console.error('❌ Falta RESEND_API_KEY');            process.exit(1) }
if (!supabaseUrl) { console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL');  process.exit(1) }
if (!serviceKey)  { console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }

const html    = readFileSync('newsletters/27-magnesio.html', 'utf8')
const FROM    = 'Food·Mood <hola@food-mood.app>'
const SUBJECT = '[Nº27] El mineral que el 70% de la población necesita. Y tu cerebro lo nota.'
const DELAY   = 1500

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Obtener suscriptores de Supabase
const leadsRes = await fetch(
  `${supabaseUrl}/rest/v1/leads?select=email&order=created_at.asc`,
  { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` } }
)
if (!leadsRes.ok) {
  console.error('❌ Error leyendo leads:', await leadsRes.text())
  process.exit(1)
}
const leads = await leadsRes.json()
const emails = [...new Set(leads.map(l => l.email.toLowerCase().trim()))]

if (emails.length === 0) {
  console.log('⚠️  No hay suscriptores en la tabla leads.')
  process.exit(0)
}

console.log(`\n📬 Enviando newsletter Nº 27 a ${emails.length} suscriptores\n`)

for (const email of emails) {
  process.stdout.write(`  → ${email} ... `)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: email, subject: SUBJECT, html }),
  })
  const data = await res.json()
  if (data.id) {
    console.log(`✅  id: ${data.id}`)
  } else {
    console.log(`❌  ${JSON.stringify(data)}`)
  }
  if (email !== emails[emails.length - 1]) await sleep(DELAY)
}

console.log('\n✨ Hecho.\n')
