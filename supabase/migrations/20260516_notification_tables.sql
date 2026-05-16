CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id            text PRIMARY KEY,
  push_enabled       boolean NOT NULL DEFAULT true,
  email_enabled      boolean NOT NULL DEFAULT false,
  quiet_hours_start  time NOT NULL DEFAULT '22:00',
  quiet_hours_end    time NOT NULL DEFAULT '08:00',
  timezone           text NOT NULL DEFAULT 'Europe/Madrid',
  muted_rules        text[] NOT NULL DEFAULT '{mood_checkin_nudge}'
);

CREATE TABLE IF NOT EXISTS notification_dispatches (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text NOT NULL,
  rule        text NOT NULL,
  channel     text NOT NULL,
  sent_at     timestamptz NOT NULL DEFAULT now(),
  metadata    jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS dispatches_user_rule_sent
  ON notification_dispatches(user_id, rule, sent_at DESC);
