/**
 * Limpia las descripciones de audio que mencionan duración en minutos.
 * Afecta a todos los challenge_days que tengan recipe_data.audio.descripcion
 * con patrón "Guía de X minutos..." o similar.
 *
 * Uso: node scripts/patch-audio-descriptions.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Patrón a eliminar: "Guía de X minutos para el día Y del reto Z."
// Lo reemplazamos por una descripción más corta basada en el título del audio
const SLUG_LABELS: Record<string, string> = {
  microhabitos:         'Microhábitos',
  'food-mood-reset':    'Food·Mood Reset',
  'recupera-tu-energia':'Recupera tu energía',
  'mejora-tu-sueno':    'Mejora tu sueño',
}

const { data: days, error } = await supabase
  .from('challenge_days')
  .select('id, day_number, challenge_id, recipe_data')
  .not('recipe_data->audio', 'is', null)

if (error) { console.error('❌', error.message); process.exit(1) }

// Obtener slugs de los challenges
const { data: challenges } = await supabase
  .from('challenges')
  .select('id, slug')

const slugMap = Object.fromEntries((challenges ?? []).map(c => [c.id, c.slug]))

let updated = 0, skipped = 0

for (const day of days ?? []) {
  const rd    = day.recipe_data
  const audio = rd?.audio
  if (!audio?.descripcion) { skipped++; continue }

  // Detectar si la descripción menciona minutos
  const hasMinutes = /\d+\s*minutos?/i.test(audio.descripcion)
  if (!hasMinutes) { skipped++; continue }

  // Quitar la parte de duración: "Guía de X minutos para el día Y del reto Z."
  // También: "Audio de X minutos para..."
  const cleaned = audio.descripcion
    .replace(/Guía de \d+ minutos para el día \d+ del reto [^.]+\./i, '')
    .replace(/Audio de \d+ minutos para [^.]+\./i, '')
    .replace(/\d+ minutos?\s*[·\-–]\s*/i, '')
    .trim()

  const slug = slugMap[day.challenge_id] ?? '?'
  console.log(`  Día ${day.day_number} [${slug}]: "${audio.descripcion.slice(0, 60)}…" → "${cleaned || '(vacío)'}"`)

  const { error: upErr } = await supabase
    .from('challenge_days')
    .update({
      recipe_data: {
        ...rd,
        audio: { ...audio, descripcion: cleaned },
      },
    })
    .eq('id', day.id)

  if (upErr) {
    console.error(`  ❌  Error actualizando día ${day.day_number}:`, upErr.message)
  } else {
    updated++
  }
}

console.log(`\n✨  ${updated} descripciones limpiadas · ${skipped} sin cambios`)
