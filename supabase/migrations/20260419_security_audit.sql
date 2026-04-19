-- ============================================================
-- Security Audit Migration — Food·Mood
-- Covers: RLS, audit_log, analytics_aggregated, user_consent
-- ============================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- 1. AUDIT LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID,                          -- nullable (anonymous actions)
  action      TEXT        NOT NULL,          -- INSERT | UPDATE | DELETE | READ
  table_name  TEXT        NOT NULL,
  record_id   UUID,
  ip_hash     TEXT,                          -- SHA-256 of IP, never cleartext
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only service_role can read the audit trail
CREATE POLICY "audit_log: service role only"
  ON public.audit_log
  USING (false);   -- blocks all client access; service_role bypasses RLS


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
  v_user_id  UUID;
  v_record_id UUID;
BEGIN
  v_record_id := COALESCE(
    (CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END),
    NULL
  );

  v_user_id := CASE
    WHEN TG_OP = 'DELETE' THEN (OLD ->> 'user_id')::UUID
    ELSE (NEW ->> 'user_id')::UUID
  END;

  INSERT INTO public.audit_log (user_id, action, table_name, record_id)
  VALUES (v_user_id, TG_OP, TG_TABLE_NAME, v_record_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Attach trigger to sensitive tables (idempotent)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'test_results',
    'emotional_palettes',
    'diary_entries',
    'mood_history',
    'user_recipe_history'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I;
       CREATE TRIGGER trg_audit_%I
         AFTER INSERT OR UPDATE OR DELETE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.fn_audit_sensitive();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END;
$$;


-- ============================================================
-- 3. USER CONSENT (GDPR granular)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_consent (
  id                         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_essential          BOOLEAN     NOT NULL DEFAULT true,   -- always true
  consent_analytics          BOOLEAN     NOT NULL DEFAULT false,
  consent_newsletter         BOOLEAN     NOT NULL DEFAULT false,
  consent_aggregated_research BOOLEAN   NOT NULL DEFAULT false,
  consent_version            TEXT        NOT NULL DEFAULT '1.0',
  consent_date               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_consent ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "consent: user owns" ON public.user_consent;
CREATE POLICY "consent: user owns"
  ON public.user_consent
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 4. ANALYTICS AGGREGATED (no PII, B2B-safe)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.analytics_aggregated (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_hash    TEXT        NOT NULL,   -- SHA-256(user_id || server_salt) — NOT reversible
  cohort       JSONB,                  -- { age_range, country } — never individual
  metric_type  TEXT        NOT NULL,
  metric_value NUMERIC     NOT NULL,
  date_bucket  DATE        NOT NULL,   -- truncated to week: date_trunc('week', ...)
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_aggregated_date_metric
  ON public.analytics_aggregated (date_bucket, metric_type);

ALTER TABLE public.analytics_aggregated ENABLE ROW LEVEL SECURITY;

-- No client access — only service_role / scheduled job writes this
CREATE POLICY "analytics: deny all client access"
  ON public.analytics_aggregated
  USING (false);


-- ============================================================
-- 5. RLS — STRICT POLICIES ON ALL USER TABLES
-- ============================================================

-- Helper: enable RLS idempotently and drop all existing non-service policies
-- before creating new strict ones.


-- ── profiles ──────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: select own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles: update own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles: insert own"  ON public.profiles;

CREATE POLICY "profiles: select own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: insert own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ── user_profiles (legacy) ────────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_profiles: select own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles: update own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles: insert own" ON public.user_profiles;

CREATE POLICY "user_profiles: select own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "user_profiles: update own"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles: insert own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ── subscriptions ─────────────────────────────────────────────────────────
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions: select own" ON public.subscriptions;

CREATE POLICY "subscriptions: select own"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);
-- INSERT/UPDATE/DELETE: service_role only (Stripe webhook)


-- ── test_results ──────────────────────────────────────────────────────────
-- Drop the overly permissive insert policy from the previous migration
DROP POLICY IF EXISTS "Anyone can insert results" ON public.test_results;
DROP POLICY IF EXISTS "Users can view their own results" ON public.test_results;

CREATE POLICY "test_results: authenticated insert"
  ON public.test_results FOR INSERT
  WITH CHECK (
    user_id = auth.uid()           -- logged-in user
    OR user_id IS NULL             -- anonymous session
  );

CREATE POLICY "test_results: select own"
  ON public.test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "test_results: delete own"
  ON public.test_results FOR DELETE
  USING (auth.uid() = user_id);


-- ── emotional_palettes ────────────────────────────────────────────────────
ALTER TABLE public.emotional_palettes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "emotional_palettes: select own" ON public.emotional_palettes;
DROP POLICY IF EXISTS "emotional_palettes: insert own" ON public.emotional_palettes;
DROP POLICY IF EXISTS "emotional_palettes: delete own" ON public.emotional_palettes;

CREATE POLICY "emotional_palettes: select own"
  ON public.emotional_palettes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "emotional_palettes: insert own"
  ON public.emotional_palettes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "emotional_palettes: delete own"
  ON public.emotional_palettes FOR DELETE
  USING (auth.uid() = user_id);


-- ── push_subscriptions ────────────────────────────────────────────────────
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "push: select own" ON public.push_subscriptions;
DROP POLICY IF EXISTS "push: insert own" ON public.push_subscriptions;
DROP POLICY IF EXISTS "push: delete own" ON public.push_subscriptions;

CREATE POLICY "push: select own"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "push: insert own"
  ON public.push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "push: delete own"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);


-- ── user_recipe_history ───────────────────────────────────────────────────
ALTER TABLE public.user_recipe_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recipe_history: select own" ON public.user_recipe_history;
DROP POLICY IF EXISTS "recipe_history: insert own" ON public.user_recipe_history;

CREATE POLICY "recipe_history: select own"
  ON public.user_recipe_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "recipe_history: insert own"
  ON public.user_recipe_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ── diary_entries ─────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'diary_entries' AND table_schema = 'public') THEN
    ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

    EXECUTE 'DROP POLICY IF EXISTS "diary: select own" ON public.diary_entries';
    EXECUTE 'DROP POLICY IF EXISTS "diary: insert own" ON public.diary_entries';
    EXECUTE 'DROP POLICY IF EXISTS "diary: delete own" ON public.diary_entries';

    EXECUTE '
      CREATE POLICY "diary: select own" ON public.diary_entries
        FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "diary: insert own" ON public.diary_entries
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      CREATE POLICY "diary: delete own" ON public.diary_entries
        FOR DELETE USING (auth.uid() = user_id);
    ';
  END IF;
END; $$;


-- ── mood_history ──────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mood_history' AND table_schema = 'public') THEN
    ALTER TABLE public.mood_history ENABLE ROW LEVEL SECURITY;

    EXECUTE 'DROP POLICY IF EXISTS "mood_history: select own" ON public.mood_history';
    EXECUTE 'DROP POLICY IF EXISTS "mood_history: insert own" ON public.mood_history';

    EXECUTE '
      CREATE POLICY "mood_history: select own" ON public.mood_history
        FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "mood_history: insert own" ON public.mood_history
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    ';
  END IF;
END; $$;


-- ── leads / waitlist — anonymous capture (no user_id column) ─────────────
ALTER TABLE public.leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads: public insert"    ON public.leads;
DROP POLICY IF EXISTS "waitlist: public insert" ON public.waitlist;
DROP POLICY IF EXISTS "leads: no select"        ON public.leads;
DROP POLICY IF EXISTS "waitlist: no select"     ON public.waitlist;

-- Allow public inserts (lead capture) but block all reads from the client
CREATE POLICY "leads: public insert"
  ON public.leads FOR INSERT WITH CHECK (true);

CREATE POLICY "waitlist: public insert"
  ON public.waitlist FOR INSERT WITH CHECK (true);

-- SELECT / DELETE only via service_role (admin panel)


-- ============================================================
-- 6. ANALYTICS AGGREGATION FUNCTION (run nightly via cron)
-- ============================================================
-- Call this from a Supabase Edge Function scheduled job.
-- It reads from test_results and writes anonymized aggregates.

CREATE OR REPLACE FUNCTION public.fn_aggregate_analytics(p_salt TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.analytics_aggregated (user_hash, metric_type, metric_value, date_bucket)
  SELECT
    encode(
      sha256((user_id::text || p_salt)::bytea),
      'hex'
    )                                              AS user_hash,
    'avg_energia'                                  AS metric_type,
    AVG(energia)                                   AS metric_value,
    date_trunc('week', created_at)::date           AS date_bucket
  FROM public.test_results
  WHERE user_id IS NOT NULL
    AND created_at >= NOW() - INTERVAL '7 days'
  GROUP BY user_hash, date_bucket
  ON CONFLICT DO NOTHING;
END;
$$;
