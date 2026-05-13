-- Explicit GRANTs for all public tables used via the Data API.
-- Required before Oct 30 2026 (Supabase default-grant removal for existing projects).

-- ── user-owned tables ────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_challenges       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles              TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_journey          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_streaks          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_recipe_history   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fm_index_log          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diary_entries         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.symptom_log           TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_results          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_digest         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oracle_checkins       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receta_del_test       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenge_logs        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenge_scores      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_consents     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_log              TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lista_compra_items    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.beta_codes            TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_correlations  TO authenticated;

-- ── public read-only tables ─────────────────────────────────────────────────
GRANT SELECT ON public.challenges     TO anon, authenticated;
GRANT SELECT ON public.challenge_days TO anon, authenticated;
GRANT SELECT ON public.recetas        TO anon, authenticated;
GRANT SELECT ON public.glossary       TO anon, authenticated;
GRANT SELECT ON public.blog_posts     TO anon, authenticated;
GRANT SELECT ON public.subscriptions  TO authenticated;

-- ── public insert-only ───────────────────────────────────────────────────────
GRANT INSERT ON public.leads TO anon, authenticated;

-- ── service_role always bypasses RLS — no extra grants needed ────────────────
