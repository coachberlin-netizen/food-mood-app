-- Add indexable recipe_mood_id and full engine output snapshot to oracle_checkins
-- recipe_mood_id: the MoodId computed by the scoring engine (may differ from primary_emotion)
-- engine_output:  full OracleScore snapshot so history can render without re-running the engine

ALTER TABLE public.oracle_checkins
  ADD COLUMN IF NOT EXISTS recipe_mood_id text,
  ADD COLUMN IF NOT EXISTS engine_output   jsonb;

CREATE INDEX IF NOT EXISTS oracle_checkins_recipe_mood
  ON public.oracle_checkins (user_id, recipe_mood_id);
