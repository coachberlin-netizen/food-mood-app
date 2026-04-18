
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, count, error } = await supabase
    .from('recetas')
    .select('id, segmento, mood_es', { count: 'exact' })
    .limit(5);
    
  console.log('Results Sample:', data);
  console.log('Total total count:', count);
  if (error) console.log('Error:', error);

  const { count: adultoCount } = await supabase
    .from('recetas')
    .select('id', { count: 'exact', head: true })
    .eq('segmento', 'adulto');
    
  console.log('Adulto count:', adultoCount);

  const { count: noSegmentoCount } = await supabase
    .from('recetas')
    .select('id', { count: 'exact', head: true })
    .is('segmento', null);
    
  console.log('Null segmento count:', noSegmentoCount);
}

test();
