import type { Pool } from "pg";
import { evaluateRules } from "./engine";
import { dispatch, WebPushSender, ResendEmailSender, emailOf } from "./sender";
import { polyphenolWindow } from "./rules/polyphenol-window";
import { sleepShortCalm } from "./rules/sleep-short-calm";
import { fermentedReminder } from "./rules/fermented-reminder";
import { moodCheckinNudge } from "./rules/mood-checkin-nudge";
import type { UserSnapshot } from "./types";

const RULES = [polyphenolWindow, sleepShortCalm, fermentedReminder, moodCheckinNudge];

export async function tick(pool: Pool): Promise<{ processed: number; sent: number }> {
  // Solo usuarios premium con preferencias de notificación configuradas
  const { rows: users } = await pool.query<{
    user_id: string;
    timezone: string;
    quiet_hours_start: string;
    quiet_hours_end: string;
    push_enabled: boolean;
    email_enabled: boolean;
    muted_rules: string[];
  }>(`
    SELECT np.*
    FROM notification_preferences np
    JOIN profiles p ON p.id = np.user_id
    WHERE p.is_premium = true
  `);

  const pushSender = new WebPushSender(pool);
  const emailSender = new ResendEmailSender();
  const senders = {
    push: pushSender,
    email: emailSender,
    emailOf: (uid: string) => emailOf(pool, uid),
  };

  const now = new Date();
  let sent = 0;

  for (const u of users) {
    // Biomarkers — graceful si la tabla aún no existe
    let bio: { type: string; value: number; measuredAt: Date }[] = [];
    try {
      const { rows } = await pool.query(
        `SELECT type, value, measured_at
         FROM biomarker_samples
         WHERE user_id = $1 AND measured_at >= now() - interval '7 days'`,
        [u.user_id],
      );
      bio = rows.map((b) => ({
        type: b.type,
        value: Number(b.value),
        measuredAt: new Date(b.measured_at),
      }));
    } catch {
      // biomarker_samples no disponible aún
    }

    // Último check-in emocional (agent_interactions)
    let lastMoodCheckinAt: Date | undefined;
    try {
      const { rows: lastMood } = await pool.query(
        `SELECT created_at FROM agent_interactions
         WHERE user_id = $1 AND modo = 'recomendacion'
         ORDER BY created_at DESC LIMIT 1`,
        [u.user_id],
      );
      if (lastMood[0]) lastMoodCheckinAt = new Date(lastMood[0].created_at);
    } catch {
      // agent_interactions no disponible
    }

    const snap: UserSnapshot = {
      userId: u.user_id,
      timezone: u.timezone,
      preferences: {
        pushEnabled: u.push_enabled,
        emailEnabled: u.email_enabled,
        mutedRules: u.muted_rules ?? [],
        quietStart: String(u.quiet_hours_start).slice(0, 5),
        quietEnd: String(u.quiet_hours_end).slice(0, 5),
      },
      recentBiomarkers: bio,
      lastMoodCheckinAt,
    };

    const notifications = await evaluateRules(pool, RULES, snap, now);
    for (const n of notifications) {
      await dispatch(pool, u.user_id, n, senders);
      sent++;
    }
  }

  return { processed: users.length, sent };
}
