import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRow() {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_email', 'testbot@example.com')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching from Supabase:', error);
  } else {
    console.log('--- SUPABASE SAVED ROW ---');
    console.log(JSON.stringify(data, null, 2));
    console.log('--------------------------');
  }
}

checkRow();
