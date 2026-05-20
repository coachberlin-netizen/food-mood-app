CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled       boolean NOT NULL DEFAULT true,
  email_enabled      boolean NOT NULL DEFAULT false,
  quiet_hours_start  time NOT NULL DEFAULT '22:00',
  quiet_hours_end    time NOT NULL DEFAULT '08:00',
  timezone           text NOT NULL DEFAULT 'Europe/Madrid',
  muted_rules        text[] NOT NULL DEFAULT '{mood_checkin_nudge}'
);

CREATE TABLE IF NOT EXISTS notification_dispatches (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rule        text NOT NULL,
  channel     text NOT NULL,
  sent_at     timestamptz NOT NULL DEFAULT now(),
  metadata    jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS dispatches_user_rule_sent
  ON notification_dispatches(user_id, rule, sent_at DESC);

-- RLS: solo service_role puede leer y escribir (el worker usa service key)
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_dispatches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notification_preferences_service" ON notification_preferences;
CREATE POLICY "notification_preferences_service"
  ON notification_preferences FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "notification_preferences_own_read" ON notification_preferences;
CREATE POLICY "notification_preferences_own_read"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_preferences_own_write" ON notification_preferences;
CREATE POLICY "notification_preferences_own_write"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_dispatches_service" ON notification_dispatches;
CREATE POLICY "notification_dispatches_service"
  ON notification_dispatches FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
