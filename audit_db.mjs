import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Try to load from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = dotenv.parse(envFile);

const supabase = createClient(
  env.RECETAS_SUPABASE_URL,
  env.RECETAS_SUPABASE_KEY
);

async function audit() {
  console.log('--- AUDIT START ---');
  const { data, error } = await supabase.from('recetas').select('*').limit(1);
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  if (data.length === 0) {
    console.log('Table is empty.');
    return;
  }
  const columns = Object.keys(data[0]);
  console.log('Columns found:', columns.join(', '));
  console.log('Sample data (for type checking):');
  console.log(JSON.stringify(data[0], null, 2));
  console.log('--- AUDIT END ---');
}

audit();
