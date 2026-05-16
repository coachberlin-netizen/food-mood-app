import type { Pool } from "pg";

export type NotificationPrefs = {
  pushEnabled: boolean;
  emailEnabled: boolean;
  quietStart: string;
  quietEnd: string;
  timezone: string;
  mutedRules: string[];
};

export async function getPreferences(
  pool: Pool,
  userId: string,
): Promise<NotificationPrefs | null> {
  const { rows } = await pool.query(
    "SELECT * FROM notification_preferences WHERE user_id = $1",
    [userId],
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    pushEnabled: r.push_enabled,
    emailEnabled: r.email_enabled,
    quietStart: String(r.quiet_hours_start).slice(0, 5),
    quietEnd: String(r.quiet_hours_end).slice(0, 5),
    timezone: r.timezone,
    mutedRules: r.muted_rules ?? [],
  };
}

export async function upsertPreferences(
  pool: Pool,
  userId: string,
  prefs: Partial<NotificationPrefs>,
): Promise<void> {
  await pool.query(
    `INSERT INTO notification_preferences
       (user_id, push_enabled, email_enabled, quiet_hours_start, quiet_hours_end, timezone, muted_rules)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO UPDATE SET
       push_enabled      = COALESCE($2, notification_preferences.push_enabled),
       email_enabled     = COALESCE($3, notification_preferences.email_enabled),
       quiet_hours_start = COALESCE($4, notification_preferences.quiet_hours_start),
       quiet_hours_end   = COALESCE($5, notification_preferences.quiet_hours_end),
       timezone          = COALESCE($6, notification_preferences.timezone),
       muted_rules       = COALESCE($7, notification_preferences.muted_rules)`,
    [
      userId,
      prefs.pushEnabled ?? null,
      prefs.emailEnabled ?? null,
      prefs.quietStart ?? null,
      prefs.quietEnd ?? null,
      prefs.timezone ?? null,
      prefs.mutedRules ?? null,
    ],
  );
}
