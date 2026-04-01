-- Create the recipe_history table for the No-Repeat Logic
CREATE TABLE IF NOT EXISTS public.recipe_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_title TEXT NOT NULL,
    mood TEXT NOT NULL,
    recipe_content JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.recipe_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own history
CREATE POLICY "Users can view their own recipe history" 
    ON public.recipe_history 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow authenticated users to insert into their own history
CREATE POLICY "Users can insert their own recipe history" 
    ON public.recipe_history 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own history (e.g. monthly reset if done client-side, though we just filter by date)
CREATE POLICY "Users can delete their own recipe history" 
    ON public.recipe_history 
    FOR DELETE
    USING (auth.uid() = user_id);
