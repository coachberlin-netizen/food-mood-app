-- ══════════════════════════════════════════════════════════════════════════════
-- Migración: políticas SELECT del profesional sobre tablas B2C existentes.
--
-- PURAMENTE ADITIVA. No modifica función is_linked_professional ni ninguna
-- política B2B existente. No toca flujo B2C del paciente.
-- 23 tablas (kb_bookmarks excluida: no existe en producción).
-- ══════════════════════════════════════════════════════════════════════════════

-- ── GRUPO A: datos clínicos primarios ─────────────────────────────────────

DROP POLICY IF EXISTS "pro_read_test_results" ON public.test_results;
CREATE POLICY "pro_read_test_results" ON public.test_results
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_emotional_palettes" ON public.emotional_palettes;
CREATE POLICY "pro_read_emotional_palettes" ON public.emotional_palettes
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_fm_index_log" ON public.fm_index_log;
CREATE POLICY "pro_read_fm_index_log" ON public.fm_index_log
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_food_log" ON public.food_log;
CREATE POLICY "pro_read_food_log" ON public.food_log
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_symptom_log" ON public.symptom_log;
CREATE POLICY "pro_read_symptom_log" ON public.symptom_log
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_mood_diary" ON public.mood_diary;
CREATE POLICY "pro_read_mood_diary" ON public.mood_diary
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_oracle_checkins" ON public.oracle_checkins;
CREATE POLICY "pro_read_oracle_checkins" ON public.oracle_checkins
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_diario_entradas" ON public.diario_entradas;
CREATE POLICY "pro_read_diario_entradas" ON public.diario_entradas
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_user_journey" ON public.user_journey;
CREATE POLICY "pro_read_user_journey" ON public.user_journey
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_user_streaks" ON public.user_streaks;
CREATE POLICY "pro_read_user_streaks" ON public.user_streaks
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_weekly_digest" ON public.weekly_digest;
CREATE POLICY "pro_read_weekly_digest" ON public.weekly_digest
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_correlations_cache" ON public.correlations_cache;
CREATE POLICY "pro_read_correlations_cache" ON public.correlations_cache
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_pattern_insights" ON public.pattern_insights;
CREATE POLICY "pro_read_pattern_insights" ON public.pattern_insights
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_user_challenges" ON public.user_challenges;
CREATE POLICY "pro_read_user_challenges" ON public.user_challenges
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_challenge_logs" ON public.challenge_logs;
CREATE POLICY "pro_read_challenge_logs" ON public.challenge_logs
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_reto_informes" ON public.reto_informes;
CREATE POLICY "pro_read_reto_informes" ON public.reto_informes
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_user_health_profile" ON public.user_health_profile;
CREATE POLICY "pro_read_user_health_profile" ON public.user_health_profile
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_evaluacion_resultados" ON public.evaluacion_resultados;
CREATE POLICY "pro_read_evaluacion_resultados" ON public.evaluacion_resultados
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_biomarker_samples" ON public.biomarker_samples;
CREATE POLICY "pro_read_biomarker_samples" ON public.biomarker_samples
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

-- ── GRUPO B: datos de comportamiento / engagement ──────────────────────────

DROP POLICY IF EXISTS "pro_read_favoritos" ON public.favoritos;
CREATE POLICY "pro_read_favoritos" ON public.favoritos
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_user_recipe_history" ON public.user_recipe_history;
CREATE POLICY "pro_read_user_recipe_history" ON public.user_recipe_history
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

DROP POLICY IF EXISTS "pro_read_receta_del_test" ON public.receta_del_test;
CREATE POLICY "pro_read_receta_del_test" ON public.receta_del_test
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

-- ── ESPECIAL: profiles (PK = id = auth user id, sin columna user_id) ──────

DROP POLICY IF EXISTS "pro_read_profiles" ON public.profiles;
CREATE POLICY "pro_read_profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (is_linked_professional(id));
