-- Creación de la tabla de historial de exposición a recetas para controlar la rotación

CREATE TABLE IF NOT EXISTS public.user_recipe_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id TEXT NOT NULL,
    source TEXT NOT NULL,          -- Ej: 'chat_inspiration', 'chat_recommendation', 'daily_dashboard'
    detected_mood TEXT,            -- Mood bajo el cual se recomendó (opcional)
    shown_as TEXT NOT NULL,        -- 'inspiration' (modo free/visitante) o 'full_recipe' (premium)
    shown_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_user_recipe_history_user_id ON public.user_recipe_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recipe_history_date ON public.user_recipe_history(shown_at);
CREATE INDEX IF NOT EXISTS idx_user_recipe_history_recipe_id ON public.user_recipe_history(recipe_id);
CREATE INDEX IF NOT EXISTS idx_user_recipe_history_user_date ON public.user_recipe_history(user_id, shown_at DESC);

-- RLS (Row Level Security)
ALTER TABLE public.user_recipe_history ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can insert their own history" 
    ON public.user_recipe_history FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own history" 
    ON public.user_recipe_history FOR SELECT 
    USING (auth.uid() = user_id);

-- Limitado explícitamente a service_role (backend de lado de servidor usando clave supabase_key)
CREATE POLICY "Service role has full access to user_recipe_history" 
    ON public.user_recipe_history 
    FOR ALL
    TO service_role
    USING (true) 
    WITH CHECK (true);
