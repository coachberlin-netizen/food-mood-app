const { execSync } = require('child_process');

const SQL = `
  CREATE TABLE IF NOT EXISTS public.mood_diary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood TEXT NOT NULL CHECK (mood IN ('activacion','calma','focus','social','reset','familia')),
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    date DATE DEFAULT CURRENT_DATE
  );
  DO $$ 
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mood_diary' AND column_name='intensity') THEN
      ALTER TABLE mood_diary ADD COLUMN intensity INTEGER CHECK (intensity BETWEEN 1 AND 5);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mood_diary' AND column_name='notes') THEN
      ALTER TABLE mood_diary ADD COLUMN notes TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mood_diary' AND column_name='date') THEN
      ALTER TABLE mood_diary ADD COLUMN date DATE DEFAULT CURRENT_DATE;
    END IF;
  END $$;
  CREATE INDEX IF NOT EXISTS idx_mood_diary_user_date ON mood_diary(user_id, date);
  ALTER TABLE mood_diary ENABLE ROW LEVEL SECURITY;
  
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users see own diary') THEN
      CREATE POLICY "Users see own diary" ON mood_diary FOR ALL USING (auth.uid() = user_id);
    END IF;
  END $$;

  CREATE TABLE IF NOT EXISTS public.user_recipe_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_slug TEXT NOT NULL,
    recipe_name TEXT,
    mood_state TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    cooked BOOLEAN DEFAULT FALSE
  );
  CREATE INDEX IF NOT EXISTS idx_user_recipe_history_user_id ON user_recipe_history(user_id);
  ALTER TABLE user_recipe_history ENABLE ROW LEVEL SECURITY;
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users see own history') THEN
      CREATE POLICY "Users see own history" ON user_recipe_history FOR ALL USING (auth.uid() = user_id);
    END IF;
  END $$;

  CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source TEXT,
    mood_state TEXT,
    converted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = 'cuoycqwtzorjbzmyclqo';

console.log('--- Launching CLI migration for project:', PROJECT_REF, '---');

try {
  const fs = require('fs');
  fs.writeFileSync('temp_migration.sql', SQL);

  const out = execSync(`npx -y supabase db query --project-ref ${PROJECT_REF} --file temp_migration.sql`, {
    env: { ...process.env, SUPABASE_ACCESS_TOKEN: ACCESS_TOKEN },
    shell: true
  });
  
  console.log('SUCCESS!');
  console.log(out.toString());
} catch (e) {
  console.error('ERROR during migration:', e.message);
}
