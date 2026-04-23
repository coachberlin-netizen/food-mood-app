-- ── RLS completo — tablas verificadas en producción ──────────────────────────

-- 1. Activar RLS en todas (idempotente)
ALTER TABLE public.blog_posts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_days           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correlations_cache       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_content          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_palettes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ferments_world           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fm_index_log             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_log                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_backup_ferments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_diary               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_sends         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_insights         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receta_del_test          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recetas                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_history           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reto_informes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reto_purchases           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_log              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recipe_history      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_digest            ENABLE ROW LEVEL SECURITY;

-- 2. Policies ──────────────────────────────────────────────────────────────────

-- profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- subscriptions
DROP POLICY IF EXISTS "subscriptions_own" ON public.subscriptions;
CREATE POLICY "subscriptions_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- test_results
DROP POLICY IF EXISTS "test_results_own" ON public.test_results;
CREATE POLICY "test_results_own" ON public.test_results USING (auth.uid() = user_id);

-- emotional_palettes
DROP POLICY IF EXISTS "emotional_palettes_own" ON public.emotional_palettes;
CREATE POLICY "emotional_palettes_own" ON public.emotional_palettes USING (auth.uid() = user_id);

-- fm_index_log
DROP POLICY IF EXISTS "fm_index_log_own" ON public.fm_index_log;
CREATE POLICY "fm_index_log_own" ON public.fm_index_log USING (auth.uid() = user_id);

-- food_log
DROP POLICY IF EXISTS "food_log_own" ON public.food_log;
CREATE POLICY "food_log_own" ON public.food_log USING (auth.uid() = user_id);

-- symptom_log
DROP POLICY IF EXISTS "symptom_log_own" ON public.symptom_log;
CREATE POLICY "symptom_log_own" ON public.symptom_log USING (auth.uid() = user_id);

-- mood_diary
DROP POLICY IF EXISTS "mood_diary_own" ON public.mood_diary;
CREATE POLICY "mood_diary_own" ON public.mood_diary USING (auth.uid() = user_id);

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

-- push_subscriptions
DROP POLICY IF EXISTS "push_subscriptions_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_own" ON public.push_subscriptions USING (auth.uid() = user_id);

-- newsletter_sends
DROP POLICY IF EXISTS "newsletter_sends_own" ON public.newsletter_sends;
CREATE POLICY "newsletter_sends_own" ON public.newsletter_sends FOR SELECT USING (auth.uid() = user_id);

-- leads
DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
DROP POLICY IF EXISTS "leads_select_own"    ON public.leads;
CREATE POLICY "leads_insert_public" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_select_own"    ON public.leads FOR SELECT USING (auth.uid() = user_id);

-- favoritos
DROP POLICY IF EXISTS "favoritos_own" ON public.favoritos;
CREATE POLICY "favoritos_own" ON public.favoritos USING (auth.uid() = user_id);

-- recipe_history
DROP POLICY IF EXISTS "recipe_history_own" ON public.recipe_history;
CREATE POLICY "recipe_history_own" ON public.recipe_history USING (auth.uid() = user_id);

-- user_recipe_history
DROP POLICY IF EXISTS "user_recipe_history_own" ON public.user_recipe_history;
CREATE POLICY "user_recipe_history_own" ON public.user_recipe_history USING (auth.uid() = user_id);

-- challenge_logs
DROP POLICY IF EXISTS "challenge_logs_own" ON public.challenge_logs;
CREATE POLICY "challenge_logs_own" ON public.challenge_logs USING (auth.uid() = user_id);

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

-- challenges — lectura pública
DROP POLICY IF EXISTS "challenges_public_read" ON public.challenges;
CREATE POLICY "challenges_public_read" ON public.challenges FOR SELECT USING (true);

-- challenge_days — lectura pública
DROP POLICY IF EXISTS "challenge_days_public_read" ON public.challenge_days;
CREATE POLICY "challenge_days_public_read" ON public.challenge_days FOR SELECT USING (true);

-- recetas — lectura pública
DROP POLICY IF EXISTS "recetas_public_read" ON public.recetas;
CREATE POLICY "recetas_public_read" ON public.recetas FOR SELECT USING (true);

-- receta_del_test — lectura pública
DROP POLICY IF EXISTS "receta_del_test_public_read" ON public.receta_del_test;
CREATE POLICY "receta_del_test_public_read" ON public.receta_del_test FOR SELECT USING (true);

-- blog_posts — lectura pública
DROP POLICY IF EXISTS "blog_posts_public_read" ON public.blog_posts;
CREATE POLICY "blog_posts_public_read" ON public.blog_posts FOR SELECT USING (true);

-- glossary — lectura pública
DROP POLICY IF EXISTS "glossary_public_read" ON public.glossary;
CREATE POLICY "glossary_public_read" ON public.glossary FOR SELECT USING (true);

-- glossary_backup_ferments — lectura pública
DROP POLICY IF EXISTS "glossary_backup_public_read" ON public.glossary_backup_ferments;
CREATE POLICY "glossary_backup_public_read" ON public.glossary_backup_ferments FOR SELECT USING (true);

-- ferments_world — lectura pública
DROP POLICY IF EXISTS "ferments_world_public_read" ON public.ferments_world;
CREATE POLICY "ferments_world_public_read" ON public.ferments_world FOR SELECT USING (true);

-- curated_content — solo service role (newsletter admin)
DROP POLICY IF EXISTS "curated_content_deny" ON public.curated_content;
CREATE POLICY "curated_content_deny" ON public.curated_content FOR SELECT USING (false);

-- 3. Verificación final
SELECT t.tablename, COUNT(p.policyname) AS policies
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = 'public'
WHERE t.schemaname = 'public'
GROUP BY t.tablename
ORDER BY policies, t.tablename;
