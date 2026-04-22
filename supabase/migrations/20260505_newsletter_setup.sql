-- newsletter_active en profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS newsletter_active boolean DEFAULT true;

-- newsletter_sends: registro de cada envío por usuario
CREATE TABLE IF NOT EXISTS public.newsletter_sends (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  week_end   date NOT NULL,
  subject    text,
  status     text NOT NULL DEFAULT 'sent', -- 'sent' | 'error'
  error_msg  text,
  sent_at    timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter_sends_select_own" ON public.newsletter_sends;
CREATE POLICY "newsletter_sends_select_own"
  ON public.newsletter_sends FOR SELECT
  USING (auth.uid() = user_id);
