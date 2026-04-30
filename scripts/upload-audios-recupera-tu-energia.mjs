/**
 * Sube los 7 MP3 del reto "Recupera tu energía en 7 días" a Supabase Storage
 * y actualiza recipe_data.audio en challenge_days.
 *
 * Uso:
 *   node scripts/upload-audios-recupera-tu-energia.mjs <carpeta>
 *
 * Ejemplo:
 *   node scripts/upload-audios-recupera-tu-energia.mjs "C:/Users/coach/Downloads/Recupera tu energia en 7 dias"
 *
 * Los archivos deben llamarse:
 *   dia01-bienvenida.mp3
 *   dia02-hierro-oxigeno.mp3
 *   dia03-magnesio-relajacion.mp3
 *   dia04-revision-mitad.mp3
 *   dia05-biogenesis.mp3
 *   dia06-coherencia-cardiaca.mp3
 *   dia07-cierre-reset.mp3
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
const SLUG   = 'recupera-tu-energia'

// Los 7 audios con sus metadatos — sin duración en la descripción
const TRACKS = [
  {
    filename:    'dia01-bienvenida.mp3',
    storagePath: 'audio/recupera-tu-energia/dia01-bienvenida.mp3',
    day:         1,
    titulo:      'Bienvenida al reto',
    descripcion: 'Arrancamos el reset energético. Lo que vas a notar en los próximos 7 días.',
    tipo:        'introduccion',
  },
  {
    filename:    'dia02-hierro-oxigeno.mp3',
    storagePath: 'audio/recupera-tu-energia/dia02-hierro-oxigeno.mp3',
    day:         2,
    titulo:      'Hierro y oxígeno celular',
    descripcion: 'Por qué el hierro no funcional es una de las causas más silenciosas de fatiga.',
    tipo:        'educativo',
  },
  {
    filename:    'dia03-magnesio-relajacion.mp3',
    storagePath: 'audio/recupera-tu-energia/dia03-magnesio-relajacion.mp3',
    day:         3,
    titulo:      'Magnesio y relajación profunda',
    descripcion: 'El magnesio activa el ATP producido. Esta noche, lo sentirás.',
    tipo:        'relajacion',
  },
  {
    filename:    'dia04-revision-mitad.mp3',
    storagePath: 'audio/recupera-tu-energia/dia04-revision-mitad.mp3',
    day:         4,
    titulo:      'Revisión de mitad del reto',
    descripcion: 'Aquí es donde la mayoría empieza a notar el cambio. ¿Qué está pasando en tu cuerpo?',
    tipo:        'reflexion_cierre',
  },
  {
    filename:    'dia05-biogenesis.mp3',
    storagePath: 'audio/recupera-tu-energia/dia05-biogenesis.mp3',
    day:         5,
    titulo:      'Biogénesis mitocondrial',
    descripcion: 'NAD+ y el proceso de crear mitocondrias nuevas con lo que comes.',
    tipo:        'educativo',
  },
  {
    filename:    'dia06-coherencia-cardiaca.mp3',
    storagePath: 'audio/recupera-tu-energia/dia06-coherencia-cardiaca.mp3',
    day:         6,
    titulo:      'Coherencia cardíaca',
    descripcion: 'Respiración 5-5 para regular el cortisol y recuperar la energía del sistema nervioso.',
    tipo:        'respiracion',
  },
  {
    filename:    'dia07-cierre-reset.mp3',
    storagePath: 'audio/recupera-tu-energia/dia07-cierre-reset.mp3',
    day:         7,
    titulo:      'Cierre del reset energético',
    descripcion: '7 días completados. Qué has activado y cómo sostenerlo.',
    tipo:        'reflexion_cierre',
  },
]

async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('❌  Indica la carpeta con los MP3:')
    console.error('   node scripts/upload-audios-recupera-tu-energia.mjs <carpeta>')
    process.exit(1)
  }
  if (!fs.existsSync(folder)) {
    console.error(`❌  La carpeta no existe: ${folder}`)
    process.exit(1)
  }

  // Obtener challenge y days
  const { data: ch, error: chErr } = await supabase
    .from('challenges')
    .select('id')
    .eq('slug', SLUG)
    .single()
  if (chErr || !ch) {
    console.error('❌  No se encontró el reto en Supabase:', chErr?.message)
    process.exit(1)
  }

  const { data: days, error: dErr } = await supabase
    .from('challenge_days')
    .select('id, day_number, recipe_data')
    .eq('challenge_id', ch.id)
    .order('day_number')
  if (dErr || !days) {
    console.error('❌  Error leyendo challenge_days:', dErr?.message)
    process.exit(1)
  }
  const dayMap = Object.fromEntries(days.map(d => [d.day_number, d]))

  console.log(`\n🎯  Subiendo 7 audios a bucket "${BUCKET}" — carpeta audio/recupera-tu-energia/\n`)

  let ok = 0, skip = 0, fail = 0

  for (const track of TRACKS) {
    const localFile = path.join(folder, track.filename)

    if (!fs.existsSync(localFile)) {
      console.log(`  ⏭️   Día ${track.day} — no encontrado: ${track.filename}`)
      skip++
      continue
    }

    const buffer = fs.readFileSync(localFile)

    // Subir a Storage
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(track.storagePath, buffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      })
    if (upErr) {
      console.error(`  ❌  Día ${track.day} — error subiendo: ${upErr.message}`)
      fail++
      continue
    }

    // Actualizar recipe_data.audio en challenge_days
    const dayRecord = dayMap[track.day]
    if (!dayRecord) {
      console.log(`  ⚠️   Día ${track.day} — subido pero no existe challenge_day`)
      ok++
      continue
    }

    const rd = dayRecord.recipe_data ?? {}
    const newRd = {
      ...rd,
      audio: {
        titulo:      track.titulo,
        descripcion: track.descripcion,
        duracion_min: 1,
        tipo:        track.tipo,
        archivo:     track.storagePath,
      },
    }

    const { error: dbErr } = await supabase
      .from('challenge_days')
      .update({ recipe_data: newRd })
      .eq('id', dayRecord.id)

    if (dbErr) {
      console.error(`  ❌  Día ${track.day} — subido pero error en BD: ${dbErr.message}`)
      fail++
    } else {
      console.log(`  ✅  Día ${track.day} — ${track.titulo}`)
      ok++
    }
  }

  // Actualizar audio_count en el challenge
  if (ok > 0) {
    await supabase
      .from('challenges')
      .update({ audio_count: 7 })
      .eq('slug', SLUG)
    console.log('\n✓  audio_count actualizado a 7')
  }

  console.log(`\n✨  ${ok} subidos · ${skip} pendientes · ${fail} errores`)
  if (skip > 0) {
    console.log('\n📋  Archivos que faltan:')
    for (const t of TRACKS) {
      if (!fs.existsSync(path.join(folder, t.filename))) {
        console.log('    ' + t.filename)
      }
    }
  }
  if (fail > 0) process.exit(1)
}

main()
