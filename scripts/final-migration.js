const https = require('https');
const url = 'https://cuoycqwtzorjbzmyclqo.supabase.co/rest/v1/rpc/exec_sql';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sql = `
  -- 1. mood_diary
  CREATE TABLE IF NOT EXISTS mood_diary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood TEXT NOT NULL CHECK (mood IN ('activacion','calma','focus','social','reset','familia')),
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    date DATE DEFAULT CURRENT_DATE
  );
  -- 2. user_recipe_history
  CREATE TABLE IF NOT EXISTS user_recipe_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_slug TEXT NOT NULL,
    recipe_name TEXT,
    mood_state TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    cooked BOOLEAN DEFAULT FALSE
  );
  -- 3. leads
  CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source TEXT,
    mood_state TEXT,
    converted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

const data = JSON.stringify({ sql });
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': 'Bearer ' + key
  }
};

const req = https.request(url, options, (res) => {
  console.log('STATUS:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
