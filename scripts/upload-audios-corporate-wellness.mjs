/**
 * Sube los audios del reto "Food·Mood for Work — Corporate Wellness"
 * node scripts/upload-audios-corporate-wellness.mjs "C:\Users\coach\Downloads\Audioscorporate"
 */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const BUCKET = 'retos-audio'
const SLUG   = 'corporate-wellness'

const TRACKS = [
  {
    filename:    'audiocorporateglucosa-energia-variabilidad.mp3.mp3',
    storageName: 'dia01-glucosa-energia.mp3',
    day: 1,
    titulo:      'La glucosa que no ves pero que decide tu tarde',
    descripcion: 'Qué es la variabilidad glucémica, cómo afecta al foco y al ánimo laboral, y por qué el desayuno de hoy define tu energía de las 15:00.',
    tipo:        'educativo',
  },
  {
    filename:    'La trampa de la cafeína y cómo salir de ella.mp3.mp3',
    storageName: 'dia02-cafeina-focus.mp3',
    day: 2,
    titulo:      'La trampa de la cafeína y cómo salir de ella',
    descripcion: 'Cómo funciona realmente la cafeína en el cerebro, qué es el crash de adenosina y qué combinaciones producen foco sostenido sin ansiedad.',
    tipo:        'educativo',
  },
  {
    filename:    'audioestrescalma-bajo-presion-cortisol-hpa.mp3.mp3',
    storageName: 'dia03-estres-cortisol.mp3',
    day: 3,
    titulo:      'Qué le pasa a tu cerebro en un deadline',
    descripcion: 'La fisiología del estrés laboral agudo: cortisol, amígdala, corteza prefrontal y por qué comemos mal cuando más importa lo que comemos.',
    tipo:        'educativo',
  },
  {
    filename:    'audiocorporateanti-bajon-1600-circadiano.mp3.mp3',
    storageName: 'dia04-bajon-tarde-circadiano.mp3',
    day: 4,
    titulo:      'Por qué las 16:00 son el enemigo y cómo ganarles',
    descripcion: 'El trough circadiano, la insulina posprandial y la adenosina: tres mecanismos que se suman para hacerte inútil a media tarde. Y cómo intervenir en cada uno.',
    tipo:        'educativo',
  },
  {
    filename:    'audiocorporatecreatividad-flujo-anandamida.mp3.mp3',
    storageName: 'dia05-flujo-creatividad.mp3',
    day: 5,
    titulo:      'La química del estado de flujo en el trabajo',
    descripcion: 'Dopamina, anandamida, norepinefrina: los neurotransmisores del flow, cómo se producen, qué los bloquea y qué alimentos los favorecen.',
    tipo:        'educativo',
  },
  {
    filename:    'audiocorporaterecuperacion-fatiga-mental-glutamato.mp3.mp3',
    storageName: 'dia06-recuperacion-cerebro.mp3',
    day: 6,
    titulo:      'Cómo limpiar tu cerebro sin dormir: la ciencia del descanso activo',
    descripcion: 'Glutamato, BDNF, sistema glinfático: qué pasa en el cerebro cuando se acumula fatiga cognitiva y qué estrategias nutricionales y de movimiento aceleran la recuperación.',
    tipo:        'educativo',
  },
  {
    filename:    'audiocorporatereset-patrones-cierre-semana.mp3.mp3',
    storageName: 'dia07-patron-personal.mp3',
    day: 7,
    titulo:      'Tu protocolo personal: qué aprendiste esta semana',
    descripcion: 'Cómo interpretar tu índice Food·Mood de 7 días, qué patrones buscar, cómo mantener los cambios más allá del reto y cuál es el siguiente paso.',
    tipo:        'cierre',
  },
]

async function main() {
  const folder = process.argv[2]
  if (!folder || !fs.existsSync(folder)) {
    console.error('❌  Indica la carpeta: node scripts/upload-audios-corporate-wellness.mjs <carpeta>')
    process.exit(1)
  }

  const { data: ch, error: chErr } = await supabase
    .from('challenges').select('id').eq('slug', SLUG).single()
  if (chErr || !ch) { console.error('❌  Reto no encontrado:', chErr?.message); process.exit(1) }

  const { data: days, error: dErr } = await supabase
    .from('challenge_days').select('id, day_number, recipe_data')
    .eq('challenge_id', ch.id).order('day_number')
  if (dErr) { console.error('❌  Error leyendo días:', dErr.message); process.exit(1) }
  const dayMap = Object.fromEntries(days.map(d => [d.day_number, d]))

  console.log(`\n🧑‍💻  Subiendo audios corporate wellness a "${BUCKET}/audio/corporate/"\n`)

  let ok = 0, skip = 0, fail = 0

  for (const track of TRACKS) {
    const localFile = path.join(folder, track.filename)
    const storagePath = `audio/corporate/${track.storageName}`

    if (!fs.existsSync(localFile)) {
      console.log(`  ⏭️  Día ${track.day} — no encontrado: ${track.filename}`)
      skip++
      continue
    }

    const buffer = fs.readFileSync(localFile)
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: 'audio/mpeg', upsert: true })
    if (upErr) {
      console.error(`  ❌  Día ${track.day} — error subiendo: ${upErr.message}`)
      fail++
      continue
    }

    const dayRecord = dayMap[track.day]
    if (!dayRecord) { console.log(`  ⚠️  Día ${track.day} — subido pero sin challenge_day`); ok++; continue }

    const newRd = {
      ...dayRecord.recipe_data,
      audio: {
        titulo:       track.titulo,
        descripcion:  track.descripcion,
        duracion_min: 1,
        tipo:         track.tipo,
        archivo:      storagePath,
      },
    }

    const { error: dbErr } = await supabase
      .from('challenge_days').update({ recipe_data: newRd }).eq('id', dayRecord.id)

    if (dbErr) {
      console.error(`  ❌  Día ${track.day} BD: ${dbErr.message}`)
      fail++
    } else {
      console.log(`  ✅  Día ${track.day} — ${track.titulo}`)
      ok++
    }
  }

  const audioCount = ok
  await supabase.from('challenges').update({ audio_count: audioCount }).eq('slug', SLUG)
  console.log(`\n✓  audio_count actualizado a ${audioCount}`)
  console.log(`✨  ${ok} subidos · ${skip} pendientes · ${fail} errores`)
  if (skip > 0) {
    console.log('\n📋  Pendientes:')
    TRACKS.filter(t => !fs.existsSync(path.join(folder, t.filename)))
      .forEach(t => console.log(`    Día ${t.day}: ${t.filename}`))
  }
  if (fail > 0) process.exit(1)
}

main()
