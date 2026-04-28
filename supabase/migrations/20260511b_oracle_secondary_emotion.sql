-- Support for 2-emotion mix in the Oracle wizard
ALTER TABLE public.oracle_checkins ADD COLUMN IF NOT EXISTS secondary_emotion text;
