const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { count } = await supabase.from('recetas').select('*', { count: 'exact', head: true }).eq('premium_level', 2);
  console.log(`Recipes with premium_level=2 (Chef/Exclusivo): ${count}`);
}
check();
