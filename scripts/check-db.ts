import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function check() {
  const url = process.env.RECETAS_SUPABASE_URL!
  const key = process.env.RECETAS_SUPABASE_KEY!
  const supabase = createClient(url, key)
  
  console.log('--- Database Check: recetas table ---')
  const { data, error } = await supabase.from('recetas').select('*').limit(1)
  
  if (error) {
    console.error('Error fetching data:', error.message)
    return
  }
  
  if (data && data.length > 0) {
    console.log('Columns found:', Object.keys(data[0]).join(', '))
  } else {
    console.log('No data found to check columns.')
  }
}

check()
