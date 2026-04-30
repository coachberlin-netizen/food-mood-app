/**
 * Sube los MP3 del Food-Mood Reset a Supabase Storage.
 * Los paths ya están en la BD — solo hay que subir los archivos.
 *
 * Uso:
 *   node scripts/upload-audios-reset.mjs <carpeta>
 *
 * Ejemplo:
 *   node scripts/upload-audios-reset.mjs C:/Users/coach/Downloads/audios-reset
 *
 * Los archivos deben llamarse exactamente así (ya definido en la BD):
 *   dia01-bienvenida.mp3
 *   dia02-serotonina.mp3
 *   dia03-glucosa.mp3
 *   dia04-meditacion-intestino.mp3
 *   dia05-respiracion-vagal.mp3
 *   dia06-body-scan.mp3
 *   dia07-cierre-semana1.mp3
 *   dia08-relajacion-gaba.mp3
 *   dia09-visualizacion-dopamina.mp3
 *   dia10-relajacion-magnesio.mp3
 *   dia11-hambre-emocional.mp3
 *   dia12-gratitud-microbioma.mp3
 *   dia13-enfoque-claridad.mp3
 *   dia14-cierre-semana2.mp3
 *   dia15-ritual-nocturno.mp3
 *   dia16-yoga-nidra.mp3
 *   dia17-mindful-eating.mp3
 *   dia18-journaling-patron.mp3
 *   dia19-visualizacion-completa.mp3
 *   dia20-carta-personal.mp3
 *   dia21-cierre-reto.mp3
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

// Los 21 paths exactos tal como están en la BD
const TRACKS = [
  'audio/reset/dia01-bienvenida.mp3',
  'audio/reset/dia02-serotonina.mp3',
  'audio/reset/dia03-glucosa.mp3',
  'audio/reset/dia04-meditacion-intestino.mp3',
  'audio/reset/dia05-respiracion-vagal.mp3',
  'audio/reset/dia06-body-scan.mp3',
  'audio/reset/dia07-cierre-semana1.mp3',
  'audio/reset/dia08-relajacion-gaba.mp3',
  'audio/reset/dia09-visualizacion-dopamina.mp3',
  'audio/reset/dia10-relajacion-magnesio.mp3',
  'audio/reset/dia11-hambre-emocional.mp3',
  'audio/reset/dia12-gratitud-microbioma.mp3',
  'audio/reset/dia13-enfoque-claridad.mp3',
  'audio/reset/dia14-cierre-semana2.mp3',
  'audio/reset/dia15-ritual-nocturno.mp3',
  'audio/reset/dia16-yoga-nidra.mp3',
  'audio/reset/dia17-mindful-eating.mp3',
  'audio/reset/dia18-journaling-patron.mp3',
  'audio/reset/dia19-visualizacion-completa.mp3',
  'audio/reset/dia20-carta-personal.mp3',
  'audio/reset/dia21-cierre-reto.mp3',
]

async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('❌  Indica la carpeta con los MP3:')
    console.error('   node scripts/upload-audios-reset.mjs <carpeta>')
    process.exit(1)
  }
  if (!fs.existsSync(folder)) {
    console.error(`❌  La carpeta no existe: ${folder}`)
    process.exit(1)
  }

  const available = fs.readdirSync(folder).filter(f => f.toLowerCase().endsWith('.mp3'))
  console.log(`\n📂  ${available.length} archivos MP3 encontrados en ${folder}`)
  console.log(`🎯  Subiendo a bucket "${BUCKET}" — carpeta audio/reset/\n`)

  let ok = 0, skip = 0, fail = 0

  for (const storagePath of TRACKS) {
    const filename = path.basename(storagePath)         // dia01-bienvenida.mp3
    const localFile = path.join(folder, filename)
    const day = parseInt(filename.replace('dia', ''), 10)

    if (!fs.existsSync(localFile)) {
      console.log(`  ⏭️   Día ${String(day).padStart(2,' ')} — no encontrado: ${filename}`)
      skip++
      continue
    }

    const buffer = fs.readFileSync(localFile)

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: 'audio/mpeg',
        upsert: true,     // permite re-subir si quieres actualizar un archivo
      })

    if (error) {
      console.error(`  ❌  Día ${String(day).padStart(2,' ')} — ${error.message}`)
      fail++
    } else {
      console.log(`  ✅  Día ${String(day).padStart(2,' ')} — ${filename}`)
      ok++
    }
  }

  console.log(`\n✨  ${ok} subidos · ${skip} pendientes · ${fail} errores`)
  if (skip > 0) {
    console.log('\n📋  Archivos que faltan todavía:')
    for (const p of TRACKS) {
      if (!fs.existsSync(path.join(folder, path.basename(p)))) {
        console.log('    ' + path.basename(p))
      }
    }
  }
  if (fail > 0) process.exit(1)
}

main()
