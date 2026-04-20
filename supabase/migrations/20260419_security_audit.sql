-- ============================================================
-- Security Audit Migration — Food·Mood
-- Covers: RLS, audit_log, analytics_aggregated, user_consent
-- All trigger attachments + optional-table RLS are IF EXISTS guarded
-- ============================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- 1. AUDIT LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID,
  action      TEXT        NOT NULL,
  table_name  TEXT        NOT NULL,
  record_id   UUID,
  ip_hash     TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_log: service role only" ON public.audit_log;
CREATE POLICY "audit_log: service role only"
  ON public.audit_log
  USING (false);


-- ============================================================
-- 2. TRIGGER FUNCTION — log INSERT / UPDATE / DELETE
-- ============================================================

CREATE OR REPLACE FUNCTION public.fn_audit_sensitive()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id   UUID;
  v_record_id UUID;
BEGIN
  v_record_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END;

  v_user_id := CASE
    WHEN TG_OP = 'DELETE' THEN (row_to_json(OLD) ->> 'user_id')::UUID
    ELSE (row_to_json(NEW) ->> 'user_id')::UUID
  END;

  INSERT INTO public.audit_log (user_id, action, table_name, record_id)
  VALUES (v_user_id, TG_OP, TG_TABLE_NAME, v_record_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ── test_results ──────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'test_results'
  ) THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_audit_test_results ON public.test_results';
    EXECUTE '
      CREATE TRIGGER trg_audit_test_results
        AFTER INSERT OR UPDATE OR DELETE ON public.test_results
        FOR EACH ROW EXECUTE FUNCTION public.fn_audit_sensitive()';
  END IF;
END; $$;

-- ── emotional_palettes ────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'emotional_palettes'
  ) THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_audit_emotional_palettes ON public.emotional_palettes';
    EXECUTE '
      CREATE TRIGGER trg_audit_emotional_palettes
        AFTER INSERT OR UPDATE OR DELETE ON public.emotional_palettes
        FOR EACH ROW EXECUTE FUNCTION public.fn_audit_sensitive()';
  END IF;
END; $$;

-- ── diary_entries ─────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'diary_entries'
  ) THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_audit_diary_entries ON public.diary_entries';
    EXECUTE '
      CREATE TRIGGER trg_audit_diary_entries
        AFTER INSERT OR UPDATE OR DELETE ON public.diary_entries
        FOR EACH ROW EXECUTE FUNCTION public.fn_audit_sensitive()';
  END IF;
END; $$;

-- ── mood_history ──────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'mood_history'
  ) THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_audit_mood_history ON public.mood_history';
    EXECUTE '
      CREATE TRIGGER trg_audit_mood_history
        AFTER INSERT OR UPDATE OR DELETE ON public.mood_history
        FOR EACH ROW EXECUTE FUNCTION public.fn_audit_sensitive()';
  END IF;
END; $$;

-- ── user_recipe_history ───────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_recipe_history'
  ) THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trg_audit_user_recipe_history ON public.user_recipe_history';
    EXECUTE '
      CREATE TRIGGER trg_audit_user_recipe_history
        AFTER INSERT OR UPDATE OR DELETE ON public.user_recipe_history
        FOR EACH ROW EXECUTE FUNCTION public.fn_audit_sensitive()';
  END IF;
END; $$;


-- ============================================================
-- 3. USER CONSENT (GDPR granular)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_consent (
  id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_essential           BOOLEAN     NOT NULL DEFAULT true,
  consent_analytics           BOOLEAN     NOT NULL DEFAULT false,
  consent_newsletter          BOOLEAN     NOT NULL DEFAULT false,
  consent_aggregated_research BOOLEAN     NOT NULL DEFAULT false,
  consent_version             TEXT        NOT NULL DEFAULT '1.0',
  consent_date                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_consent ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "consent: user owns" ON public.user_consent;
CREATE POLICY "consent: user owns"
  ON public.user_consent
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 4. ANALYTICS AGGREGATED (no PII)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.analytics_aggregated (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_hash    TEXT        NOT NULL,
  cohort       JSONB,
  metric_type  TEXT        NOT NULL,
  metric_value NUMERIC     NOT NULL,
  date_bucket  DATE        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_aggregated_date_metric
  ON public.analytics_aggregated (date_bucket, metric_type);

ALTER TABLE public.analytics_aggregated ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics: deny all client access" ON public.analytics_aggregated;
CREATE POLICY "analytics: deny all client access"
  ON public.analytics_aggregated
  USING (false);


-- ============================================================
-- 5. RLS — STRICT POLICIES ON ALL USER TABLES
-- ============================================================

-- ── profiles ──────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    EXECUTE 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "profiles: select own" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "profiles: update own" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "profiles: insert own" ON public.profiles';
    EXECUTE 'CREATE POLICY "profiles: select own" ON public.profiles FOR SELECT USING (auth.uid() = id)';
    EXECUTE 'CREATE POLICY "profiles: update own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)';
    EXECUTE 'CREATE POLICY "profiles: insert own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END; $$;


-- ── user_profiles ─────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_profiles'
  ) THEN
    EXECUTE 'ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "user_profiles: select own" ON public.user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "user_profiles: update own" ON public.user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "user_profiles: insert own" ON public.user_profiles';
    EXECUTE 'CREATE POLICY "user_profiles: select own" ON public.user_profiles FOR SELECT USING (auth.uid() = id)';
    EXECUTE 'CREATE POLICY "user_profiles: update own" ON public.user_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)';
    EXECUTE 'CREATE POLICY "user_profiles: insert own" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END; $$;


-- ── subscriptions ─────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'subscriptions'
  ) THEN
    EXECUTE 'ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "subscriptions: select own" ON public.subscriptions';
    EXECUTE 'CREATE POLICY "subscriptions: select own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id)';
  END IF;
END; $$;


-- ── test_results ──────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'test_results'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can insert results" ON public.test_results';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their own results" ON public.test_results';
    EXECUTE 'DROP POLICY IF EXISTS "test_results: authenticated insert" ON public.test_results';
    EXECUTE 'DROP POLICY IF EXISTS "test_results: select own" ON public.test_results';
    EXECUTE 'DROP POLICY IF EXISTS "test_results: delete own" ON public.test_results';
    EXECUTE '
      CREATE POLICY "test_results: authenticated insert" ON public.test_results
        FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL)';
    EXECUTE '
      CREATE POLICY "test_results: select own" ON public.test_results
        FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE '
      CREATE POLICY "test_results: delete own" ON public.test_results
        FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END; $$;


-- ── emotional_palettes ────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'emotional_palettes'
  ) THEN
    EXECUTE 'ALTER TABLE public.emotional_palettes ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "emotional_palettes: select own" ON public.emotional_palettes';
    EXECUTE 'DROP POLICY IF EXISTS "emotional_palettes: insert own" ON public.emotional_palettes';
    EXECUTE 'DROP POLICY IF EXISTS "emotional_palettes: delete own" ON public.emotional_palettes';
    EXECUTE 'CREATE POLICY "emotional_palettes: select own" ON public.emotional_palettes FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "emotional_palettes: insert own" ON public.emotional_palettes FOR INSERT WITH CHECK (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "emotional_palettes: delete own" ON public.emotional_palettes FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END; $$;


-- ── push_subscriptions ────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'push_subscriptions'
  ) THEN
    EXECUTE 'ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "push: select own" ON public.push_subscriptions';
    EXECUTE 'DROP POLICY IF EXISTS "push: insert own" ON public.push_subscriptions';
    EXECUTE 'DROP POLICY IF EXISTS "push: delete own" ON public.push_subscriptions';
    EXECUTE 'CREATE POLICY "push: select own" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "push: insert own" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "push: delete own" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END; $$;


-- ── user_recipe_history ───────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_recipe_history'
  ) THEN
    EXECUTE 'ALTER TABLE public.user_recipe_history ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "recipe_history: select own" ON public.user_recipe_history';
    EXECUTE 'DROP POLICY IF EXISTS "recipe_history: insert own" ON public.user_recipe_history';
    EXECUTE 'CREATE POLICY "recipe_history: select own" ON public.user_recipe_history FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "recipe_history: insert own" ON public.user_recipe_history FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
END; $$;


-- ── diary_entries ─────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'diary_entries'
  ) THEN
    EXECUTE 'ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "diary: select own" ON public.diary_entries';
    EXECUTE 'DROP POLICY IF EXISTS "diary: insert own" ON public.diary_entries';
    EXECUTE 'DROP POLICY IF EXISTS "diary: delete own" ON public.diary_entries';
    EXECUTE 'CREATE POLICY "diary: select own" ON public.diary_entries FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "diary: insert own" ON public.diary_entries FOR INSERT WITH CHECK (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "diary: delete own" ON public.diary_entries FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END; $$;


-- ── mood_history ──────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'mood_history'
  ) THEN
    EXECUTE 'ALTER TABLE public.mood_history ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "mood_history: select own" ON public.mood_history';
    EXECUTE 'DROP POLICY IF EXISTS "mood_history: insert own" ON public.mood_history';
    EXECUTE 'CREATE POLICY "mood_history: select own" ON public.mood_history FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "mood_history: insert own" ON public.mood_history FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
END; $$;


-- ── leads ─────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'leads'
  ) THEN
    EXECUTE 'ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "leads: public insert" ON public.leads';
    EXECUTE 'DROP POLICY IF EXISTS "leads: no select" ON public.leads';
    EXECUTE 'CREATE POLICY "leads: public insert" ON public.leads FOR INSERT WITH CHECK (true)';
  END IF;
END; $$;


-- ── waitlist ──────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'waitlist'
  ) THEN
    EXECUTE 'ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "waitlist: public insert" ON public.waitlist';
    EXECUTE 'DROP POLICY IF EXISTS "waitlist: no select" ON public.waitlist';
    EXECUTE 'CREATE POLICY "waitlist: public insert" ON public.waitlist FOR INSERT WITH CHECK (true)';
  END IF;
END; $$;


-- ============================================================
-- 6. ANALYTICS AGGREGATION FUNCTION (run nightly via cron)
-- ============================================================

CREATE OR REPLACE FUNCTION public.fn_aggregate_analytics(p_salt TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'test_results'
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.analytics_aggregated (user_hash, metric_type, metric_value, date_bucket)
  SELECT
    encode(sha256((user_id::text || p_salt)::bytea), 'hex') AS user_hash,
    'avg_energia'                                            AS metric_type,
    AVG(energia)                                             AS metric_value,
    date_trunc('week', created_at)::date                     AS date_bucket
  FROM public.test_results
  WHERE user_id IS NOT NULL
    AND created_at >= NOW() - INTERVAL '7 days'
  GROUP BY user_hash, date_bucket
  ON CONFLICT DO NOTHING;
END;
$$;
