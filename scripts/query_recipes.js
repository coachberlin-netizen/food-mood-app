import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  console.log('--- Checking for Hombres + Activación ---');
  const { count, error, data } = await supabase
    .from('recetas')
    .select('*', { count: 'exact' })
    .eq('sexo', 'hombre')
    .ilike('mood_es', '%Activacion%');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Found:', count, 'recipes');
    if (data && data.length > 0) {
      console.log('Sample IDs:', data.slice(0, 5).map(r => r.id));
    }
  }

  console.log('\n--- Checking for all Hombres ---');
  const { count: countAllHombres } = await supabase
    .from('recetas')
    .select('*', { count: 'exact', head: true })
    .eq('sexo', 'hombre');
  console.log('Total Hombres recipes:', countAllHombres);

  console.log('\n--- Checking for all Activación ---');
  const { count: countAllActivacion } = await supabase
    .from('recetas')
    .select('*', { count: 'exact', head: true })
    .ilike('mood_es', '%Activacion%');
  console.log('Total Activación recipes:', countAllActivacion);
}

check();
