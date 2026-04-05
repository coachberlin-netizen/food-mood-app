import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

async function run() {
  const url = process.env.RECETAS_SUPABASE_URL
  const key = process.env.RECETAS_SUPABASE_KEY

  if (!url || !key) {
    console.error('Error: RECETAS_SUPABASE_URL y RECETAS_SUPABASE_KEY deben estar en .env.local')
    process.exit(1)
  }

  // Note: key might have quotes if not handled by dotenv perfectly in some environments
  const cleanKey = key.replace(/^"|"$/g, '')
  const cleanUrl = url.replace(/^"|"$/g, '')

  const supabase = createClient(cleanUrl, cleanKey)

  console.log('--- Tarea 1: Añadiendo columna ingrediente_firma ---')
  
  // We try to call exec_sql RPC. If it doesn't exist, we'll suggest manual creation.
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE recetas ADD COLUMN IF NOT EXISTS ingrediente_firma TEXT;'
  })

  if (error) {
    if (error.message.includes('function exec_sql() does not exist')) {
      console.warn('\n>>> ALERTA: La función rpc "exec_sql" no existe en este proyecto de Supabase.')
      console.warn('Por favor, ejecuta el siguiente SQL manualmente en el SQL Editor de Supabase:')
      console.warn('\nALTER TABLE recetas ADD COLUMN IF NOT EXISTS ingrediente_firma TEXT;\n')
    } else {
      console.error('Error ejecutando SQL:', error.message)
    }
  } else {
    console.log('¡Columna ingrediente_firma añadida (o ya existía)!')
  }
}

run().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
