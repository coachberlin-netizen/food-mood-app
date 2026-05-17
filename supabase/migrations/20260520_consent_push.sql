-- Añade columna de consentimiento para notificaciones push a user_consent
ALTER TABLE public.user_consent
  ADD COLUMN IF NOT EXISTS consent_push_notifications BOOLEAN NOT NULL DEFAULT false;
