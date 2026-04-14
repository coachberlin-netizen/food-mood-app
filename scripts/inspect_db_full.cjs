const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envData = fs.readFileSync('.env.local', 'utf8');
const env = envData.split('\n').filter(l => l.includes('=')).reduce((acc, l) => {
  const [k, ...v] = l.split('=');
  acc[k.trim()] = v.join('=').trim().replace(/^"(.*)"$/, '$1');
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
  try {
    console.log('--- DATABASE INSPECTION ---');
    
    // 1. Get all tables in public schema
    const { data: tables, error: tablesError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError.message);
      // fallback to known tables if listing fails
      const knownTables = ['profiles', 'user_profiles', 'subscriptions', 'leads'];
      for (const t of knownTables) await inspectTable(t);
    } else {
      console.log('Found tables:', tables.map(t => t.tablename).join(', '));
      for (const t of tables) {
        await inspectTable(t.tablename);
      }
    }

    // 2. Cross-reference with auth users for email
    console.log('\n--- AUTH USERS DATA ---');
    const { dataAuth, errorAuth } = await supabase.auth.admin.listUsers({
      perPage: 5
    });
    if (errorAuth) {
      console.error('Error fetching auth users:', errorAuth.message);
    } else {
      console.log(JSON.stringify(dataAuth?.users?.map(u => ({ id: u.id, email: u.email })), null, 2));
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

async function inspectTable(name) {
  try {
    const { data, error } = await supabase.from(name).select('*').limit(3);
    if (error) {
      console.log(`[${name}] Error: ${error.message}`);
    } else {
      console.log(`\n[${name}] Data (Top 3):`);
      console.log(JSON.stringify(data, null, 2));
      if (data && data[0]) {
        console.log(`[${name}] Columns: ${Object.keys(data[0]).join(', ')}`);
      } else {
        console.log(`[${name}] Table exists but is empty.`);
      }
    }
  } catch (e) {
    console.log(`[${name}] Unexpected error: ${e.message}`);
  }
}

inspect();
