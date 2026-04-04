-- Creación de la tabla de leads para capturar emails de la newsletter

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'newsletter_hero',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Políticas
-- Permitir a cualquier usuario anónimo (o autenticado) insertar (para el formulario público)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
EXCEPTION WHEN undefined_object THEN
    -- Ignore
END $$;

CREATE POLICY "Anyone can insert leads"
    ON public.leads FOR INSERT
    WITH CHECK (true);

-- Solo administradores (service_role) o usuarios autenticados con ciertos roles de admin podrían leer
DO $$
BEGIN
    DROP POLICY IF EXISTS "Only service role can view leads" ON public.leads;
EXCEPTION WHEN undefined_object THEN
    -- Ignore
END $$;

CREATE POLICY "Only service role can view leads"
    ON public.leads FOR SELECT
    TO service_role
    USING (true);
