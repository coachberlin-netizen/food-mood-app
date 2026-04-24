-- Tabla de códigos beta/influencer gestionados desde Supabase
CREATE TABLE IF NOT EXISTS public.beta_codes (
  code        text PRIMARY KEY,
  label       text,           -- descripción opcional: "influencer X", "prensa", etc.
  active      bool DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.beta_codes ENABLE ROW LEVEL SECURITY;

-- Solo el service role puede leer (la API usa service role)
CREATE POLICY "beta_codes_service_only" ON public.beta_codes
  FOR SELECT USING (false);

-- Insertar el código inicial
INSERT INTO public.beta_codes (code, label) VALUES
  ('FOODMOOD2026', 'Código beta inicial')
ON CONFLICT (code) DO NOTHING;
