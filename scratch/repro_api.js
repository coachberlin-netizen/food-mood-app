
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testApiLogic() {
  // Parameters from the client
  const mood = ""; // Todos
  const q = ""; // Empty
  const segmento = "adulto";
  const premiumLevel = null; // Todos

  let query = supabase
    .from('recetas')
    .select('id, nombre_es, mood_es, premium_level, segmento', { count: 'exact' });

  if (mood) {
    query = query.ilike('mood_es', `%${mood}%`);
  }
  if (q) {
    query = query.or(`nombre_es.ilike.%${q}%,tipo_plato.ilike.%${q}%`);
  }
  if (segmento) {
    query = query.eq('segmento', segmento);
  }
  if (premiumLevel !== null) {
    query = query.eq('premium_level', premiumLevel);
  }

  const { data, count, error } = await query.limit(5);

  console.log('Filters:', { mood, q, segmento, premiumLevel });
  console.log('Results:', data);
  console.log('Count:', count);
  if (error) console.log('Error:', error);
}

testApiLogic();
