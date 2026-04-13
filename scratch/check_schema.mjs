import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = dotenv.parse(envFile);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('emotional_palettes').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
    return;
  }
  if (data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
  } else {
    console.log('Table empty, checking RPC or similar is not possible here easily.');
  }
}

check();
