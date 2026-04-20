-- Añadir campos de newsletter curated a blog_posts
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS category     text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS week_start   date;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS external_url text;

-- Índice para búsquedas por semana
CREATE INDEX IF NOT EXISTS blog_posts_week_start_idx ON public.blog_posts (week_start)
  WHERE week_start IS NOT NULL;
