/**
 * Elimina el campo `meditacion` de recipe_data en los días 2,5,7,9,10
 * del reto "activa-tu-longevidad" y actualiza audio_count a 10.
 * node scripts/remove-meditaciones-longevidad.mjs
 */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const SLUG = 'activa-tu-longevidad'
const DAYS_WITH_MEDITACION = [2, 5, 7, 9, 10]

async function main() {
  const { data: ch, error: chErr } = await supabase
    .from('challenges')
    .select('id')
    .eq('slug', SLUG)
    .single()
  if (chErr || !ch) { console.error('❌ Reto no encontrado:', chErr?.message); process.exit(1) }

  const { data: days, error: dErr } = await supabase
    .from('challenge_days')
    .select('id, day_number, recipe_data')
    .eq('challenge_id', ch.id)
    .in('day_number', DAYS_WITH_MEDITACION)
  if (dErr) { console.error('❌ Error leyendo días:', dErr.message); process.exit(1) }

  let ok = 0
  for (const day of days) {
    const rd = { ...day.recipe_data }
    delete rd.meditacion
    const { error } = await supabase
      .from('challenge_days')
      .update({ recipe_data: rd })
      .eq('id', day.id)
    if (error) {
      console.error(`  ❌ Día ${day.day_number}: ${error.message}`)
    } else {
      console.log(`  ✅ Día ${day.day_number}: meditacion eliminada`)
      ok++
    }
  }

  await supabase.from('challenges').update({ audio_count: 10 }).eq('id', ch.id)
  console.log('\n✓  audio_count actualizado a 10')
  console.log(`✨  ${ok} días actualizados`)
}

main()
