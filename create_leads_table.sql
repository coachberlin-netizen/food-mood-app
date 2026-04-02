-- Run this in Supabase SQL Editor to create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text DEFAULT 'quiz',
  created_at timestamptz DEFAULT now()
);

-- Allow inserts from anon users (public-facing form)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert from anyone" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read from authenticated" ON public.leads
  FOR SELECT USING (auth.role() = 'authenticated');
