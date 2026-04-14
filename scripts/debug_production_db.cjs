const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Basic env parser
const envData = fs.readFileSync('.env.local', 'utf8');
const env = envData.split('\n')
  .filter(line => line.includes('=') && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    acc[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    return acc;
  }, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runQueries() {
  try {
    console.log('--- SUBSCRIPTIONS (TOP 5) ---');
    const { data: subs, error: subsError } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (subsError) {
      console.error('Error fetching subscriptions:', JSON.stringify(subsError, null, 2));
    } else {
      console.log(JSON.stringify(subs, null, 2));
    }

    console.log('\n--- PROFILES (TOP 5) ---');
    // First, let's see what columns we actually have by selecting the first row's all columns
    const { data: firstProfile, error: profileColsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileColsError) {
      console.error('Error fetching profiles columns:', JSON.stringify(profileColsError, null, 2));
    } else {
      const columns = firstProfile && firstProfile[0] ? Object.keys(firstProfile[0]) : [];
      console.log('Detected columns in profiles:', columns.join(', '));
      
      // Now fetch the top 5 with all columns to be safe and thorough
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (profError) {
        console.error('Error fetching profiles:', JSON.stringify(profError, null, 2));
      } else {
        console.log(JSON.stringify(profiles, null, 2));
      }
    }

    console.log('\n--- AUTH USERS (TOP 5) ---');
    // Since we have service role, we can also peek at auth.users via a direct raw query if we had it,
    // but typically we check profiles first. The user asked for id, email, is_premium, premium_level, tier.
    // If email is missing in profiles, we'll know from the schema check.

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

runQueries();
