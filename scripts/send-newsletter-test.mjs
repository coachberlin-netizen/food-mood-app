import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const env = fs.readFileSync(envPath, 'utf8')
const getEnv = (key) => env.match(new RegExp(`${key}="?([^"\\n]+)`))?.[1]

const RESEND_API_KEY = getEnv('RESEND_API_KEY')
const TO = 'coachberlin@gmail.com'

const html = fs.readFileSync(path.join(__dirname, 'newsletter-no-dramatica.html'), 'utf8')

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Food·Mood <onboarding@resend.dev>',
    to: TO,
    subject: 'No eres dramática. Eres una mezcla que cambia cada día. 🌿',
    html,
  }),
})

const data = await res.json()
console.log(res.status, JSON.stringify(data, null, 2))
