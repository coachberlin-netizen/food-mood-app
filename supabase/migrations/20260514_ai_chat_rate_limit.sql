-- Add daily AI message counters to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_messages_today    integer     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_messages_reset_at timestamptz NOT NULL DEFAULT now();

-- Allow authenticated users to update their own AI counters
DROP POLICY IF EXISTS "profiles: update own ai counters" ON public.profiles;
CREATE POLICY "profiles: update own ai counters" ON public.profiles
  FOR UPDATE
  USING     (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
