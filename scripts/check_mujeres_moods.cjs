const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('recetas')
    .select('mood_es')
    .eq('sexo', 'mujer');

  if (error) {
    console.error('Error:', error);
  } else {
    // Get distinct values
    const distinctMoods = [...new Set(data.map(d => d.mood_es))];
    console.log('Distinct mood_es for women:');
    console.log(distinctMoods);
    
    // Also, count them for 'Activación & Energía'
    const energyCount = data.filter(d => d.mood_es === 'Activación & Energía').length;
    console.log('Total Mujeres + Activación & Energía Recipes:', energyCount);
  }
}

check();
