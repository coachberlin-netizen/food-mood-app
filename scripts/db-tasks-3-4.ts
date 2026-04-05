import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Role key is better for DDL

  if (!url || !key) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and a suitable key must be present.')
    process.exit(1)
  }

  const supabase = createClient(url, key)

  console.log('--- Task 3 & 4: Creating tables in Main DB ---')

  const tables = [
    {
      name: 'mood_diary',
      sql: `
        CREATE TABLE IF NOT EXISTS mood_diary (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          mood TEXT NOT NULL CHECK (mood IN ('activacion','calma','focus','social','reset','familia')),
          intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
          notes TEXT,
          logged_at TIMESTAMPTZ DEFAULT NOW(),
          date DATE DEFAULT CURRENT_DATE
        );
        -- Note: The following might fail if ran multiple times without checks, but we use IF NOT EXISTS for table.
        -- Policies and Indexes:
        -- CREATE INDEX IF NOT EXISTS idx_mood_diary_user_date ON mood_diary(user_id, date);
        -- ALTER TABLE mood_diary ENABLE ROW LEVEL SECURITY;
        -- CREATE POLICY "Users see own diary" ON mood_diary FOR ALL USING (auth.uid() = user_id);
      `
    },
    {
      name: 'user_recipe_history',
      sql: `
        CREATE TABLE IF NOT EXISTS user_recipe_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          recipe_slug TEXT NOT NULL,
          recipe_name TEXT,
          mood_state TEXT,
          viewed_at TIMESTAMPTZ DEFAULT NOW(),
          cooked BOOLEAN DEFAULT FALSE
        );
        -- CREATE INDEX IF NOT EXISTS idx_user_recipe_history_user_id ON user_recipe_history(user_id);
        -- ALTER TABLE user_recipe_history ENABLE ROW LEVEL SECURITY;
        -- CREATE POLICY "Users see own history" ON user_recipe_history FOR ALL USING (auth.uid() = user_id);
      `
    },
    {
      name: 'leads',
      sql: `
        CREATE TABLE IF NOT EXISTS leads (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          source TEXT,
          mood_state TEXT,
          converted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ]

  for (const table of tables) {
    console.log(`Creating/Verifying ${table.name}...`)
    const { error } = await supabase.rpc('exec_sql', { sql: table.sql })
    if (error) {
      console.warn(`Could not run SQL for ${table.name} via RPC: ${error.message}`)
      console.warn(`Please run this manually in Supabase:\n${table.sql}\n`)
    } else {
      console.log(`Success for ${table.name}`)
    }
  }
}

run().catch(console.error)
