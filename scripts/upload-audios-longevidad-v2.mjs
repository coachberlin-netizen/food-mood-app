/**
 * Sube los 10 audios del reto "Activa tu longevidad" a Supabase Storage.
 * Nombres reales: audioantiagingdiaXX-nombre.mp3.mp3
 * node scripts/upload-audios-longevidad-v2.mjs "C:\Users\coach\Downloads\Audios Longevidad"
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
  { filename: 'audioantiagingdia01-telomeros-antioxidantes.mp3.mp3', day: 1,
    titulo: 'El tiempo que vive en tus células', tipo: 'educativo',
    descripcion: 'Qué son los telómeros, cómo los acorta el estilo de vida y cómo los protege la comida.',
    storageName: 'dia01-telomeros-antioxidantes.mp3' },
  { filename: 'audioantiagingdia02-autofagia-limpieza.mp3.mp3', day: 2,
    titulo: 'La noche que te limpia por dentro', tipo: 'educativo',
    descripcion: 'Cómo funciona la autofagia, cuándo se activa y qué alimentos la potencian.',
    storageName: 'dia02-autofagia-limpieza.mp3' },
  { filename: 'audioantiagingdia03-colageno-ritual.mp3.mp3', day: 3,
    titulo: 'El ritual de los 20 minutos que tu piel espera', tipo: 'ritual',
    descripcion: 'Cómo funciona la síntesis de colágeno y cómo el caldo de huesos es el suplemento más biodisponible.',
    storageName: 'dia03-colageno-ritual.mp3' },
  { filename: 'audioantiagingdia04-nad-energia-celular.mp3.mp3', day: 4,
    titulo: 'Las mitocondrias que no envejecen', tipo: 'educativo',
    descripcion: 'Qué es el NAD+, por qué cae con la edad y cómo la comida puede recuperarlo.',
    storageName: 'dia04-nad-energia-celular.mp3' },
  { filename: 'audioantiagingdia05-microbioma-joven.mp3.mp3', day: 5,
    titulo: 'La flora que tiene 30 años a los 60', tipo: 'educativo',
    descripcion: 'La ciencia del microbioma y la longevidad. Qué comen los centenarios sanos.',
    storageName: 'dia05-microbioma-joven.mp3' },
  { filename: 'audioantiagingdia06-inflamacion-silenciosa.mp3.mp3', day: 6,
    titulo: 'El fuego invisible que te envejece', tipo: 'educativo',
    descripcion: 'Qué es la inflammaging y cómo una forma de cocinar puede cambiar marcadores inflamatorios.',
    storageName: 'dia06-inflamacion-silenciosa.mp3' },
  { filename: 'audioantiagingdia07-cerebro-neuroplasticidad.mp3.mp3', day: 7,
    titulo: 'El cerebro que se renueva', tipo: 'ritual',
    descripcion: 'Neuroplasticidad, BDNF y los alimentos que regeneran neuronas.',
    storageName: 'dia07-cerebro-neuroplasticidad.mp3' },
  { filename: 'audioantiagingdia08-piel-desde-dentro.mp3.mp3', day: 8,
    titulo: 'Lo que la cosmética no puede hacer', tipo: 'educativo',
    descripcion: 'Cómo funciona el eje intestino-piel y los nutrientes que cambian la piel desde dentro.',
    storageName: 'dia08-piel-desde-dentro.mp3' },
  { filename: 'audioantiagingdia09-ritmo-circadiano.mp3.mp3', day: 9,
    titulo: 'Tu reloj biológico no está roto. Solo desincronizado.', tipo: 'educativo',
    descripcion: 'Cronobiología nutricional y el impacto del horario de comidas en el envejecimiento.',
    storageName: 'dia09-ritmo-circadiano.mp3' },
  { filename: 'audioantiagingdia10-protocolo-longevidad.mp3.mp3', day: 10,
    titulo: 'Lo que aprendiste en 10 días dura toda la vida', tipo: 'cierre',
    descripcion: 'Cierre del reto. Revisión de los 10 mecanismos antiaging. Cómo integrarlo como estilo de vida.',
    storageName: 'dia10-protocolo-longevidad.mp3' },
]

async function main() {
  const folder = process.argv[2]
  if (!folder || !fs.existsSync(folder)) {
    console.error('❌  Indica la carpeta: node scripts/upload-audios-longevidad-v2.mjs <carpeta>')
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

  console.log(`\n🌿  Subiendo 10 audios a "${BUCKET}/audio/antiaging/"\n`)

  let ok = 0, fail = 0

  for (const track of TRACKS) {
    const localFile = path.join(folder, track.filename)
    const storagePath = `audio/antiaging/${track.storageName}`

    if (!fs.existsSync(localFile)) {
      console.log(`  ⏭️  Día ${track.day} — no encontrado: ${track.filename}`)
      fail++
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
    if (!dayRecord) { console.log(`  ⚠️  Día ${track.day} — subido pero no hay challenge_day`); ok++; continue }

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
      console.error(`  ❌  Día ${track.day} — error BD: ${dbErr.message}`)
      fail++
    } else {
      console.log(`  ✅  Día ${track.day} — ${track.titulo}`)
      ok++
    }
  }

  if (ok > 0) {
    await supabase.from('challenges').update({ audio_count: 10 }).eq('slug', SLUG)
  }

  console.log(`\n✨  ${ok} subidos · ${fail} errores`)
  if (fail > 0) process.exit(1)
}

main()
