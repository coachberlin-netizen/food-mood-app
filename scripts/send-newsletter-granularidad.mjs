import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const key = env.match(/RESEND_API_KEY="?([^"\n]+)/)?.[1]
if (!key) { console.error('No se encontró RESEND_API_KEY'); process.exit(1) }

const html = readFileSync('scripts/newsletter-granularidad-emocional.html', 'utf8')

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from: 'Food·Mood <hola@food-mood.app>',
    to: 'coachberlin@gmail.com',
    subject: 'No estás "mal". Estás hambrienta.',
    html,
  }),
})

const data = await res.json()
console.log(JSON.stringify(data, null, 2))
