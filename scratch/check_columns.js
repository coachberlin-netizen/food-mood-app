
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testQueryWithAllColumns() {
  const { data, error } = await supabase
    .from('recetas')
    .select('id, nombre_es, mood_es, tiempo_preparacion_min, tipo_plato, dificultad, temporada, segmento, premium_level, image')
    .limit(1);
    
  if (error) {
    console.log('Error searching for all columns:', error);
  } else {
    console.log('Success! Columns are fine:', Object.keys(data[0]));
  }
}

testQueryWithAllColumns();
