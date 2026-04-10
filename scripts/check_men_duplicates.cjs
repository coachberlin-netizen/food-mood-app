const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('recetas')
    .select('nombre_es, grupo_edad, sexo')
    .eq('sexo', 'hombre')
    .limit(20);
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample Men Recipes:');
    console.table(data);
    
    // Check if a specific recipe name exists for multiple age groups
    if (data.length > 0) {
        const name = data[0].nombre_es;
        const { data: duplicates } = await supabase
            .from('recetas')
            .select('grupo_edad')
            .eq('nombre_es', name)
            .eq('sexo', 'hombre');
        console.log(`\nChecking age groups for recipe: "${name}"`);
        console.log(duplicates.map(d => d.grupo_edad));
    }
  }
}

check();
