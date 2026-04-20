require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

// Supabase direct connection: db.{ref}.supabase.co
// Password = lo que usas en el dashboard de Supabase > Settings > Database
const DB_URL = process.env.SUPABASE_DB_URL;

if (!DB_URL) {
  const ref = 'cuoycqwtzorjbzmyclqo';
  console.error('Falta SUPABASE_DB_URL en .env.local');
  console.error('');
  console.error('Ve a: Supabase Dashboard > Settings > Database > Connection string > URI');
  console.error(`Tiene este formato:`);
  console.error(`postgresql://postgres:[TU-PASSWORD]@db.${ref}.supabase.co:5432/postgres`);
  console.error('');
  console.error('Añádelo a .env.local como:');
  console.error('SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.' + ref + '.supabase.co:5432/postgres');
  process.exit(1);
}

const SQL = `
CREATE OR REPLACE FUNCTION public.fn_update_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
DECLARE
  v_last_date date;
  v_current   int;
  v_longest   int;
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT last_log_date, current_streak, longest_streak
    INTO v_last_date, v_current, v_longest
    FROM public.user_streaks
   WHERE user_id = NEW.user_id;

  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_log_date)
    VALUES (NEW.user_id, 1, 1, NEW.log_date);
    RETURN NEW;
  END IF;

  IF v_last_date = NEW.log_date THEN
    RETURN NEW;
  END IF;

  IF v_last_date = NEW.log_date - INTERVAL '1 day' THEN
    v_current := v_current + 1;
  ELSE
    v_current := 1;
  END IF;

  v_longest := GREATEST(v_longest, v_current);

  UPDATE public.user_streaks
     SET current_streak = v_current,
         longest_streak = v_longest,
         last_log_date  = NEW.log_date,
         updated_at     = NOW()
   WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$func$;

DROP TRIGGER IF EXISTS trg_update_streak ON public.fm_index_log;

CREATE TRIGGER trg_update_streak
  AFTER INSERT ON public.fm_index_log
  FOR EACH ROW EXECUTE FUNCTION public.fn_update_streak();
`;

async function run() {
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Conectado. Ejecutando SQL...');
    await client.query(SQL);
    console.log('OK — fn_update_streak y trg_update_streak creados correctamente.');
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
