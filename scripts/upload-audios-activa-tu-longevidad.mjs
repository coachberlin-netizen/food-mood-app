/**
 * Sube los audios del reto "Activa tu longevidad" a Supabase Storage
 * y actualiza recipe_data.audio (y meditacion donde aplica) en challenge_days.
 *
 * Uso:
 *   node scripts/upload-audios-activa-tu-longevidad.mjs <carpeta>
 *
 * Los archivos deben llamarse como se indica en la columna "filename".
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
const SLUG   = 'activa-tu-longevidad'

const TRACKS = [
  { filename: 'dia01-telomeros-antioxidantes.mp3', day: 1, field: 'audio',
    titulo: 'El tiempo que vive en tus células', tipo: 'educativo',
    descripcion: 'Qué son los telómeros, cómo los acorta el estilo de vida y cómo los protege la comida.' },
  { filename: 'dia02-autofagia-limpieza.mp3',      day: 2, field: 'audio',
    titulo: 'La noche que te limpia por dentro', tipo: 'educativo',
    descripcion: 'Cómo funciona la autofagia, cuándo se activa y qué alimentos la potencian.' },
  { filename: 'dia02-meditacion-soltar.mp3',        day: 2, field: 'meditacion',
    titulo: 'Soltar para renovar', tipo: 'meditacion',
    descripcion: 'Visualización de liberación celular. Respiración 4-7-8. Cierre: "Mi cuerpo sabe limpiar."' },
  { filename: 'dia03-colageno-ritual.mp3',          day: 3, field: 'audio',
    titulo: 'El ritual de los 20 minutos que tu piel espera', tipo: 'ritual',
    descripcion: 'Cómo funciona la síntesis de colágeno y cómo el caldo de huesos es el suplemento más biodisponible.' },
  { filename: 'dia04-nad-energia-celular.mp3',      day: 4, field: 'audio',
    titulo: 'Las mitocondrias que no envejecen', tipo: 'educativo',
    descripcion: 'Qué es el NAD+, por qué cae con la edad y cómo la comida puede recuperarlo.' },
  { filename: 'dia05-microbioma-joven.mp3',          day: 5, field: 'audio',
    titulo: 'La flora que tiene 30 años a los 60', tipo: 'educativo',
    descripcion: 'La ciencia del microbioma y la longevidad. Qué comen los centenarios sanos.' },
  { filename: 'dia05-meditacion-jardin.mp3',         day: 5, field: 'meditacion',
    titulo: 'El jardín interior', tipo: 'meditacion',
    descripcion: 'Visualización del intestino como jardín vivo. Respiración abdominal. Cierre: "Soy el jardín y el jardinero."' },
  { filename: 'dia06-inflamacion-silenciosa.mp3',    day: 6, field: 'audio',
    titulo: 'El fuego invisible que te envejece', tipo: 'educativo',
    descripcion: 'Qué es la inflammaging y cómo una forma de cocinar puede cambiar marcadores inflamatorios.' },
  { filename: 'dia07-cerebro-neuroplasticidad.mp3',  day: 7, field: 'audio',
    titulo: 'El cerebro que se renueva', tipo: 'ritual',
    descripcion: 'Neuroplasticidad, BDNF y los alimentos que regeneran neuronas.' },
  { filename: 'dia07-meditacion-redes.mp3',           day: 7, field: 'meditacion',
    titulo: 'Redes que brillan', tipo: 'meditacion',
    descripcion: 'Visualización de redes neuronales formando nuevas conexiones. Box breathing 4-4-4-4.' },
  { filename: 'dia08-piel-desde-dentro.mp3',          day: 8, field: 'audio',
    titulo: 'Lo que la cosmética no puede hacer', tipo: 'educativo',
    descripcion: 'Cómo funciona el eje intestino-piel y los nutrientes que cambian la piel desde dentro.' },
  { filename: 'dia09-ritmo-circadiano.mp3',            day: 9, field: 'audio',
    titulo: 'Tu reloj biológico no está roto. Solo desincronizado.', tipo: 'educativo',
    descripcion: 'Cronobiología nutricional y el impacto del horario de comidas en el envejecimiento.' },
  { filename: 'dia09-meditacion-sinconia.mp3',         day: 9, field: 'meditacion',
    titulo: 'Sincronía', tipo: 'meditacion',
    descripcion: 'Cierre del día. Respiración 4-8 (activa parasimpático). Cierre: "Soy ritmo. Descanso para renovarme."' },
  { filename: 'dia10-protocolo-longevidad.mp3',        day: 10, field: 'audio',
    titulo: 'Lo que aprendiste en 10 días dura toda la vida', tipo: 'cierre',
    descripcion: 'Cierre del reto. Revisión de los 10 mecanismos antiaging. Cómo integrarlo como estilo de vida.' },
  { filename: 'dia10-meditacion-integracion.mp3',      day: 10, field: 'meditacion',
    titulo: 'El cuerpo que eres ahora', tipo: 'integracion',
    descripcion: 'Scan corporal con gratitud. Revisión de los 10 días. Cierre: "Elegí bien. Voy a seguir eligiendo."' },
]

async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('❌  Indica la carpeta con los MP3:')
    console.error('   node scripts/upload-audios-activa-tu-longevidad.mjs <carpeta>')
    process.exit(1)
  }
  if (!fs.existsSync(folder)) {
    console.error(`❌  La carpeta no existe: ${folder}`)
    process.exit(1)
  }

  const { data: ch, error: chErr } = await supabase
    .from('challenges')
    .select('id')
    .eq('slug', SLUG)
    .single()
  if (chErr || !ch) {
    console.error('❌  No se encontró el reto:', chErr?.message)
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

  console.log(`\n🌿  Subiendo audios a bucket "${BUCKET}" — carpeta audio/antiaging/\n`)

  let ok = 0, skip = 0, fail = 0

  for (const track of TRACKS) {
    const localFile = path.join(folder, track.filename)
    const storagePath = `audio/antiaging/${track.filename}`

    if (!fs.existsSync(localFile)) {
      console.log(`  ⏭️   Día ${track.day} [${track.field}] — no encontrado: ${track.filename}`)
      skip++
      continue
    }

    const buffer = fs.readFileSync(localFile)
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: 'audio/mpeg', upsert: true })
    if (upErr) {
      console.error(`  ❌  Día ${track.day} [${track.field}] — error subiendo: ${upErr.message}`)
      fail++
      continue
    }

    const dayRecord = dayMap[track.day]
    if (!dayRecord) {
      console.log(`  ⚠️   Día ${track.day} — subido pero no existe challenge_day`)
      ok++
      continue
    }

    const rd = dayRecord.recipe_data ?? {}
    const newRd = {
      ...rd,
      [track.field]: {
        titulo:       track.titulo,
        descripcion:  track.descripcion,
        duracion_min: 1,
        tipo:         track.tipo,
        archivo:      storagePath,
      },
    }

    const { error: dbErr } = await supabase
      .from('challenge_days')
      .update({ recipe_data: newRd })
      .eq('id', dayRecord.id)

    if (dbErr) {
      console.error(`  ❌  Día ${track.day} [${track.field}] — error en BD: ${dbErr.message}`)
      fail++
    } else {
      console.log(`  ✅  Día ${track.day} [${track.field}] — ${track.titulo}`)
      ok++
    }
  }

  if (ok > 0) {
    await supabase.from('challenges').update({ audio_count: 15 }).eq('slug', SLUG)
    console.log('\n✓  audio_count actualizado a 15 (10 audios + 5 meditaciones)')
  }

  console.log(`\n✨  ${ok} subidos · ${skip} pendientes · ${fail} errores`)
  if (skip > 0) {
    console.log('\n📋  Archivos pendientes:')
    for (const t of TRACKS) {
      if (!fs.existsSync(path.join(folder, t.filename))) {
        console.log('    ' + t.filename)
      }
    }
  }
  if (fail > 0) process.exit(1)
}

main()
