-- ── Activar RLS en todas las tablas públicas (idempotente) ───────────────────
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END$$;

-- ── Policies por tabla ────────────────────────────────────────────────────────

-- profiles
DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"  ON public.profiles;
CREATE POLICY "profiles_select_own"  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- test_results
DROP POLICY IF EXISTS "test_results_own" ON public.test_results;
CREATE POLICY "test_results_own" ON public.test_results USING (auth.uid() = user_id);

-- food_log
DROP POLICY IF EXISTS "food_log_own" ON public.food_log;
CREATE POLICY "food_log_own" ON public.food_log USING (auth.uid() = user_id);

-- fm_index_log
DROP POLICY IF EXISTS "fm_index_log_own" ON public.fm_index_log;
CREATE POLICY "fm_index_log_own" ON public.fm_index_log USING (auth.uid() = user_id);

-- symptom_log
DROP POLICY IF EXISTS "symptom_log_own" ON public.symptom_log;
CREATE POLICY "symptom_log_own" ON public.symptom_log USING (auth.uid() = user_id);

-- user_consent
DROP POLICY IF EXISTS "user_consent_own" ON public.user_consent;
CREATE POLICY "user_consent_own" ON public.user_consent USING (auth.uid() = user_id);

-- user_journey
DROP POLICY IF EXISTS "user_journey_own" ON public.user_journey;
CREATE POLICY "user_journey_own" ON public.user_journey USING (auth.uid() = user_id);

-- user_streaks
DROP POLICY IF EXISTS "user_streaks_own" ON public.user_streaks;
CREATE POLICY "user_streaks_own" ON public.user_streaks USING (auth.uid() = user_id);

-- weekly_digest
DROP POLICY IF EXISTS "weekly_digest_own" ON public.weekly_digest;
CREATE POLICY "weekly_digest_own" ON public.weekly_digest USING (auth.uid() = user_id);

-- correlations_cache
DROP POLICY IF EXISTS "correlations_cache_own" ON public.correlations_cache;
CREATE POLICY "correlations_cache_own" ON public.correlations_cache USING (auth.uid() = user_id);

-- pattern_insights
DROP POLICY IF EXISTS "pattern_insights_own" ON public.pattern_insights;
CREATE POLICY "pattern_insights_own" ON public.pattern_insights USING (auth.uid() = user_id);

-- user_challenges
DROP POLICY IF EXISTS "user_challenges_select_own" ON public.user_challenges;
DROP POLICY IF EXISTS "user_challenges_insert_own" ON public.user_challenges;
DROP POLICY IF EXISTS "user_challenges_update_own" ON public.user_challenges;
CREATE POLICY "user_challenges_select_own" ON public.user_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_challenges_insert_own" ON public.user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_challenges_update_own" ON public.user_challenges FOR UPDATE USING (auth.uid() = user_id);

-- reto_purchases
DROP POLICY IF EXISTS "reto_purchases_own" ON public.reto_purchases;
CREATE POLICY "reto_purchases_own" ON public.reto_purchases FOR SELECT USING (auth.uid() = user_id);

-- reto_informes
DROP POLICY IF EXISTS "reto_informes_own" ON public.reto_informes;
CREATE POLICY "reto_informes_own" ON public.reto_informes FOR SELECT USING (auth.uid() = user_id);

-- challenge_logs
DROP POLICY IF EXISTS "challenge_logs_own" ON public.challenge_logs;
CREATE POLICY "challenge_logs_own" ON public.challenge_logs USING (auth.uid() = user_id);

-- newsletter_sends
DROP POLICY IF EXISTS "newsletter_sends_own" ON public.newsletter_sends;
CREATE POLICY "newsletter_sends_own" ON public.newsletter_sends FOR SELECT USING (auth.uid() = user_id);

-- push_subscriptions
DROP POLICY IF EXISTS "push_subscriptions_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_own" ON public.push_subscriptions USING (auth.uid() = user_id);

-- audit_log — solo lectura propia
DROP POLICY IF EXISTS "audit_log_own" ON public.audit_log;
CREATE POLICY "audit_log_own" ON public.audit_log FOR SELECT USING (auth.uid() = user_id);

-- challenges y challenge_days — lectura pública
DROP POLICY IF EXISTS "challenges_public_read"     ON public.challenges;
DROP POLICY IF EXISTS "challenge_days_public_read" ON public.challenge_days;
CREATE POLICY "challenges_public_read"     ON public.challenges     FOR SELECT USING (true);
CREATE POLICY "challenge_days_public_read" ON public.challenge_days FOR SELECT USING (true);

-- curated_content — solo service role escribe, nadie lee directamente
DROP POLICY IF EXISTS "curated_content_service_only" ON public.curated_content;
CREATE POLICY "curated_content_service_only" ON public.curated_content FOR SELECT USING (false);

-- analytics_aggregated — sin acceso directo (solo service role)
DROP POLICY IF EXISTS "analytics_aggregated_deny" ON public.analytics_aggregated;
CREATE POLICY "analytics_aggregated_deny" ON public.analytics_aggregated FOR SELECT USING (false);

-- ── Verificación: tablas sin policies ────────────────────────────────────────
SELECT t.tablename,
       COUNT(p.policyname) AS n_policies
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = 'public'
WHERE t.schemaname = 'public'
GROUP BY t.tablename
ORDER BY n_policies, t.tablename;
