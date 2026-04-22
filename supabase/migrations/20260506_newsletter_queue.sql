-- Newsletter queue: status per edition (week_start group)
ALTER TABLE curated_content
  ADD COLUMN IF NOT EXISTS status  text        NOT NULL DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;

-- Fast queue lookup
CREATE INDEX IF NOT EXISTS idx_curated_content_queue
  ON curated_content (status, week_start);

-- WhatsApp broadcast opt-in (GDPR-compliant, explicit)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS whatsapp_phone        text,
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in       boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in_at    timestamptz,
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in_source text;      -- 'checkout' | 'settings'

-- Telegram private channel
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS telegram_user_id       bigint,
  ADD COLUMN IF NOT EXISTS telegram_invite_url    text,
  ADD COLUMN IF NOT EXISTS telegram_invite_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS telegram_joined        boolean DEFAULT false;
