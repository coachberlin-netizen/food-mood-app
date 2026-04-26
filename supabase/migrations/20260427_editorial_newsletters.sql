-- Cola de newsletters editoriales (una fila por número de edición)
CREATE TABLE IF NOT EXISTS public.editorial_newsletters (
  numero      int          PRIMARY KEY,
  slug        text         NOT NULL,
  subject     text         NOT NULL,
  sent_at     timestamptz,
  sent_count  int          NOT NULL DEFAULT 0
);

-- Registro de envíos individuales (una fila por usuario × edición)
CREATE TABLE IF NOT EXISTS public.editorial_sends (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  newsletter_num   int         NOT NULL REFERENCES public.editorial_newsletters(numero),
  sent_at          timestamptz NOT NULL DEFAULT now(),
  status           text        NOT NULL DEFAULT 'sent',
  error_msg        text,
  UNIQUE (user_id, newsletter_num)
);

ALTER TABLE public.editorial_newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_sends       ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "editorial_newsletters_public_read" ON public.editorial_newsletters;
CREATE POLICY "editorial_newsletters_public_read"
  ON public.editorial_newsletters FOR SELECT USING (true);

DROP POLICY IF EXISTS "editorial_sends_own_read" ON public.editorial_sends;
CREATE POLICY "editorial_sends_own_read"
  ON public.editorial_sends FOR SELECT USING (auth.uid() = user_id);

-- Las dos editoriales ya enviadas manualmente — marcarlas como enviadas
-- para que el cron automático empiece desde la Nº 03
INSERT INTO public.editorial_newsletters (numero, slug, subject, sent_at, sent_count)
VALUES
  (1, 'slow-food-mood',    'Fast life. Slow Food·Mood. 🍵', now(), 1),
  (2, 'pan-de-masa-madre', 'Hay pan. Y luego hay PAN. 🍞',  now(), 1)
ON CONFLICT (numero) DO NOTHING;
