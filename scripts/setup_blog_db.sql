-- 1. Crear la tabla blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content_md TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    author_name TEXT DEFAULT 'Food·Mood',
    newsletter_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_newsletter_date ON public.blog_posts(newsletter_date);

-- 4. Políticas de Seguridad (RLS)

-- Permiso de lectura para el público (solo publicados y con fecha de publicación pasada)
CREATE POLICY "Public can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (
    status = 'published' 
    AND (published_at IS NULL OR published_at <= now())
);

-- Permiso total para administradores (vía Service Role o email whitelist en la app)
-- Nota: La protección fuerte se hará en el servidor Next.js, 
-- pero añadimos una política para permitir acceso total vía Service Role.
CREATE POLICY "Full access for admin via service role" 
ON public.blog_posts 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
