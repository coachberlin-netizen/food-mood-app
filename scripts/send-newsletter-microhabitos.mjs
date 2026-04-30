import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const env  = readFileSync('.env.local', 'utf8')
const key  = env.match(/RESEND_API_KEY="?([^"\n]+)/)?.[1]
if (!key) { console.error('No se encontró RESEND_API_KEY'); process.exit(1) }

// Importar buildHtml desde el archivo TypeScript compilado (via tsx/ts-node)
// Uso: node --import tsx/esm scripts/send-newsletter-microhabitos.mjs
// O mejor: npx tsx scripts/send-newsletter-microhabitos.mjs

const { buildHtml } = await import('../src/lib/editorial-newsletters/05-microhabitos.ts')
const html = buildHtml()

const res = await fetch('https://api.resend.com/emails', {
  method:  'POST',
  headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from:    'Food·Mood <hola@food-mood.app>',
    to:      'coachberlin@gmail.com',
    subject: 'El hábito que no necesita fuerza de voluntad. ✨',
    html,
  }),
})

const data = await res.json()
console.log(JSON.stringify(data, null, 2))
