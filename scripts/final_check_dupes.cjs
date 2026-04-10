const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase.from('recetas').select('nombre_es').limit(200);
  if (error) {
    console.error(error);
  } else {
    const counts = {};
    data.forEach(r => {
      counts[r.nombre_es] = (counts[r.nombre_es] || 0) + 1;
    });
    const duplicates = Object.entries(counts).filter(([n, c]) => c > 1);
    console.log('Duplicates found:', duplicates.length);
    if (duplicates.length > 0) {
      console.log('Sample duplicates:', duplicates.slice(0, 5));
    } else {
      console.log('No duplicates found in first 200 records.');
    }
  }
}

check();
