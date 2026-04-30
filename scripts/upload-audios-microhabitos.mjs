/**
 * Sube audios MP3 a Supabase Storage (retos-audio/microhabitos/)
 * y actualiza recipe_data.audio en challenge_days.
 *
 * Uso:
 *   node scripts/upload-audios-microhabitos.mjs <carpeta>
 *
 * Ejemplo:
 *   node scripts/upload-audios-microhabitos.mjs C:/Users/coach/Downloads/audios-microhabitos
 *
 * Los archivos deben llamarse:
 *   dia-01.mp3, dia-02.mp3, ... dia-21.mp3
 *   (también acepta: 01.mp3, 1.mp3, dia-1.mp3)
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

const BUCKET   = 'retos-audio'
const SLUG     = 'microhabitos'
const TIPO     = 'educativo'
const DURACION = 4   // minutos por defecto (puedes ajustar día a día abajo)

// Duración personalizada por día (en minutos) — ajusta si sabes la duración real
const DURACIONES = {
  1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 5,
  8: 4, 9: 4, 10: 4, 11: 4, 12: 4, 13: 4, 14: 5,
  15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4, 21: 5,
}

// ── Helper: extrae el número de día del nombre de archivo ─────────────────────
function extractDay(filename) {
  // acepta: dia-01.mp3 · dia-1.mp3 · 01.mp3 · 1.mp3 · audio_dia_01.mp3
  const m = filename.match(/(\d{1,2})/)
  return m ? parseInt(m[1], 10) : null
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('❌  Indica la carpeta con los MP3:')
    console.error('   node scripts/upload-audios-microhabitos.mjs <carpeta>')
    process.exit(1)
  }
  if (!fs.existsSync(folder)) {
    console.error(`❌  La carpeta no existe: ${folder}`)
    process.exit(1)
  }

  // 1. Leer archivos MP3 de la carpeta
  const files = fs.readdirSync(folder).filter(f => f.toLowerCase().endsWith('.mp3'))
  if (files.length === 0) {
    console.error('❌  No hay archivos .mp3 en la carpeta indicada')
    process.exit(1)
  }
  console.log(`\n📂  ${files.length} archivos MP3 encontrados en ${folder}\n`)

  // 2. Obtener el challenge_id y los challenge_days del reto
  const { data: ch, error: chErr } = await supabase
    .from('challenges')
    .select('id')
    .eq('slug', SLUG)
    .single()
  if (chErr || !ch) {
    console.error('❌  No se encontró el reto "microhabitos" en Supabase:', chErr?.message)
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

  // 3. Subir cada archivo y actualizar la BD
  let ok = 0, fail = 0

  for (const filename of files) {
    const day = extractDay(filename)
    if (!day || day < 1 || day > 21) {
      console.warn(`  ⚠️  No pude determinar el día de: ${filename} — omitido`)
      continue
    }

    const dayRecord = dayMap[day]
    if (!dayRecord) {
      console.warn(`  ⚠️  No existe challenge_day para el día ${day} — omitido`)
      continue
    }

    const storagePath = `${SLUG}/dia-${String(day).padStart(2, '0')}.mp3`
    const filePath    = path.join(folder, filename)
    const fileBuffer  = fs.readFileSync(filePath)

    // 3a. Subir a Storage (upsert para poder re-subir sin error)
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      })
    if (upErr) {
      console.error(`  ❌  Día ${day} — error subiendo: ${upErr.message}`)
      fail++
      continue
    }

    // 3b. Leer el título del audio desde lectura.titulo (ya guardado en seed)
    const rd       = dayRecord.recipe_data ?? {}
    const lectTit  = rd.lectura?.titulo ?? `Audio — Día ${day}`
    const duracion = DURACIONES[day] ?? DURACION

    // 3c. Actualizar recipe_data.audio en la BD
    const newRd = {
      ...rd,
      audio: {
        titulo:       lectTit,
        descripcion:  `Guía de ${duracion} minutos para el día ${day} del reto Microhábitos.`,
        duracion_min: duracion,
        tipo:         TIPO,
        archivo:      storagePath,
      },
    }

    const { error: dbErr } = await supabase
      .from('challenge_days')
      .update({ recipe_data: newRd })
      .eq('id', dayRecord.id)

    if (dbErr) {
      console.error(`  ❌  Día ${day} — error actualizando BD: ${dbErr.message}`)
      fail++
    } else {
      console.log(`  ✅  Día ${day} — subido y BD actualizada  →  ${storagePath}`)
      ok++
    }
  }

  console.log(`\n✨  ${ok} audios subidos y registrados, ${fail} errores`)
  if (fail > 0) process.exit(1)
}

main()
