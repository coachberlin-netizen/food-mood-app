-- RPC callable by authenticated users to activate beta premium access.
-- Called from /api/beta/redeem after server-side code validation.
-- SECURITY DEFINER runs with owner privileges; only updates auth.uid() row.

CREATE OR REPLACE FUNCTION public.activate_beta_premium()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET is_premium = true,
      updated_at = NOW()
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, is_premium, updated_at)
    VALUES (auth.uid(), true, NOW());
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.activate_beta_premium() TO authenticated;
