const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('recetas').select('sexo, grupo_edad');
  if (error) throw error;
  
  const groups = {};
  for (const r of data) {
    const key = `${r.sexo} | ${r.grupo_edad}`;
    groups[key] = (groups[key] || 0) + 1;
  }
  
  console.log("Results (sexo | grupo_edad):");
  Object.keys(groups).sort().forEach(k => {
    console.log(`${k}: ${groups[k]} recetas`);
  });
}
check();
