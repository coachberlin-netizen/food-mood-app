
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function test() {
  const { data, count, error } = await supabase
    .from('recetas')
    .select('id, segmento, mood_es', { count: 'exact' })
    .limit(10);
    
  console.log('Results:', data);
  console.log('Total count:', count);
  console.log('Error:', error);

  const { count: adultoCount } = await supabase
    .from('recetas')
    .select('id', { count: 'exact', head: true })
    .eq('segmento', 'adulto');
    
  console.log('Adulto count:', adultoCount);
}

test();
