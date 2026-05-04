/**
 * Envía newsletters editoriales a un email concreto (uso admin / test).
 * Uso:
 *   npx ts-node scripts/send-editorials-to-email.ts
 *   npx ts-node scripts/send-editorials-to-email.ts --from 9        (solo desde la Nº 9)
 *   npx ts-node scripts/send-editorials-to-email.ts --only 10,11,12 (solo esas)
 */
import { Resend } from 'resend'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { buildHtml as html01 } from '../src/lib/editorial-newsletters/01-slow-food-mood'
import { buildHtml as html02 } from '../src/lib/editorial-newsletters/02-pan-de-masa-madre'
import { buildHtml as html03 } from '../src/lib/editorial-newsletters/03-salsa-de-tomate-fermentada'
import { buildHtml as html04 } from '../src/lib/editorial-newsletters/04-recupera-tu-energia'
import { buildHtml as html05 } from '../src/lib/editorial-newsletters/05-microhabitos'
import { buildHtml as html06 } from '../src/lib/editorial-newsletters/06-estrobioma'
import { buildHtml as html07 } from '../src/lib/editorial-newsletters/07-legumbres-menopausia'
import { buildHtml as html08 } from '../src/lib/editorial-newsletters/08-proteina-musculo'
import { buildHtml as html09 } from '../src/lib/editorial-newsletters/09-colageno-huesos'
import { buildHtml as html10 } from '../src/lib/editorial-newsletters/10-emociones-menopausia'
import { buildHtml as html11 } from '../src/lib/editorial-newsletters/11-fermentos-del-mundo'
import { buildHtml as html12 } from '../src/lib/editorial-newsletters/12-mosaico-emocional'
import { buildHtml as html13 } from '../src/lib/editorial-newsletters/13-lactobacillus-ph-vaginal'
import { buildHtml as html14 } from '../src/lib/editorial-newsletters/14-metabolismo-35'

const ALL = [
  { numero: 1,  subject: 'Fast life. Slow Food·Mood. 🍵',                                                           buildHtml: html01 },
  { numero: 2,  subject: 'Hay pan. Y luego hay PAN. 🍞',                                                            buildHtml: html02 },
  { numero: 3,  subject: 'Salsa de tomate fermentada. Neuroprotección en tarro. 🍅',                                buildHtml: html03 },
  { numero: 4,  subject: 'El cansancio que no se va con dormir ⚡',                                                 buildHtml: html04 },
  { numero: 5,  subject: 'El hábito que no necesita fuerza de voluntad. ✨',                                        buildHtml: html05 },
  { numero: 6,  subject: 'Tus bacterias gestionan el estrógeno. Empieza aquí. 🌸',                                  buildHtml: html06 },
  { numero: 7,  subject: 'El alimento más completo para tus hormonas. 🫘',                                          buildHtml: html07 },
  { numero: 8,  subject: 'La menopausia se come el músculo. La proteína lo frena. 💪',                              buildHtml: html08 },
  { numero: 9,  subject: 'La ventana que no se repite. Colágeno y huesos en la menopausia. 🦴',                     buildHtml: html09 },
  { numero: 10, subject: 'No es la edad. Es tu cerebro pidiendo lo que tus hormonas ya no le dan. 🧠',              buildHtml: html10 },
  { numero: 11, subject: 'De Japón a Perú. Lo que seis civilizaciones aprendieron sobre el eje intestino-cerebro. 🌍', buildHtml: html11 },
  { numero: 12, subject: 'Tu semana tiene un color. ¿Sabes cuál es? 🎨',                                            buildHtml: html12 },
  { numero: 13, subject: 'El kéfir del desayuno llega donde nadie te dijo que llegaba. 🌸',                         buildHtml: html13 },
  { numero: 14, subject: 'Tu metabolismo ya no tiene 25. Pero tampoco necesita dieta. ⚡',                          buildHtml: html14 },
]

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  const TO    = 'coachberlin@gmail.com'
  const FROM  = 'Food·Mood <hola@food-mood.app>'
  const DELAY = 1500 // ms entre envíos (límite Resend: 2 req/s)

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) { console.error('❌ Falta RESEND_API_KEY en .env.local'); process.exit(1) }

  const resend = new Resend(apiKey)

  // Parse args
  const args   = process.argv.slice(2)
  const fromIdx = args.indexOf('--from')
  const onlyIdx = args.indexOf('--only')

  let newsletters = ALL
  if (onlyIdx !== -1) {
    const nums = (args[onlyIdx + 1] ?? '').split(',').map(Number)
    newsletters = ALL.filter(n => nums.includes(n.numero))
  } else if (fromIdx !== -1) {
    const start = Number(args[fromIdx + 1])
    newsletters = ALL.filter(n => n.numero >= start)
  }

  console.log(`\n📬 Enviando ${newsletters.length} newsletters a ${TO}\n`)

  for (const nl of newsletters) {
    process.stdout.write(`  Nº ${String(nl.numero).padStart(2, '0')} — ${nl.subject.slice(0, 55)}... `)
    try {
      const { data, error } = await resend.emails.send({
        from:    FROM,
        to:      TO,
        subject: `[Nº${nl.numero}] ${nl.subject}`,
        html:    nl.buildHtml(),
      })
      if (error) throw new Error(error.message)
      console.log(`✅  id: ${data?.id}`)
    } catch (err: any) {
      console.log(`❌  ${err.message}`)
    }
    if (nl !== newsletters[newsletters.length - 1]) await sleep(DELAY)
  }

  console.log('\n✨ Hecho.\n')
}

main()
