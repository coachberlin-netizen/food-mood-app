import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.RECETAS_SUPABASE_URL;
const key = process.env.RECETAS_SUPABASE_KEY;

// Try direct SQL via PostgREST - use the pg_catalog approach
const sql = `ALTER TABLE public.recetas DROP CONSTRAINT IF EXISTS recetas_grupo_edad_check; ALTER TABLE public.recetas DROP CONSTRAINT IF EXISTS recetas_sexo_check; ALTER TABLE public.recetas ADD COLUMN IF NOT EXISTS segmento text DEFAULT 'adulto';`;

// Use the Supabase management SQL endpoint
const projectRef = url.replace('https://', '').replace('.supabase.co', '');
console.log('Project ref:', projectRef);

const res = await fetch(`${url}/pg`, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
});

console.log('Status:', res.status);
const text = await res.text();
console.log('Response:', text.substring(0, 500));
