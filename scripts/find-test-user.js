const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findUser() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, is_premium')
    .limit(1);

  if (error) {
    console.error('❌ Error finding user:', error.message);
    process.exit(1);
  }

  if (data.length === 0) {
    console.error('❌ No users found in profiles table.');
    process.exit(1);
  }

  console.log('✅ Found Test User:');
  console.log(JSON.stringify(data[0], null, 2));
}

findUser();
