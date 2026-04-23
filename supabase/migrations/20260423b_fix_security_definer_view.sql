-- Fix: user_weekly_summary was SECURITY DEFINER (bypasses RLS).
-- Switch to SECURITY INVOKER so queries run with the caller's permissions + RLS.
-- ALTER VIEW ... SET (security_invoker) requires PostgreSQL 15+ (Supabase default).

ALTER VIEW public.user_weekly_summary SET (security_invoker = true);
