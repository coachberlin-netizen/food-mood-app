import type { Pool } from "pg";
import type { NotificationRule, UserSnapshot, Notification } from "./types";

function isInQuietHours(
  now: Date,
  timezone: string,
  quietStart: string,
  quietEnd: string,
): boolean {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [h, m] = fmt.format(now).split(":").map(Number);
  const cur = h * 60 + m;
  const [sh, sm] = quietStart.split(":").map(Number);
  const [eh, em] = quietEnd.split(":").map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  // wrap-around (e.g. 22:00 → 08:00 crosses midnight)
  return start < end ? cur >= start && cur < end : cur >= start || cur < end;
}

export async function alreadySentToday(
  pool: Pool,
  userId: string,
  ruleId: string,
): Promise<boolean> {
  const { rowCount } = await pool.query(
    `SELECT 1 FROM notification_dispatches
     WHERE user_id = $1 AND rule = $2 AND sent_at >= date_trunc('day', now())
     LIMIT 1`,
    [userId, ruleId],
  );
  return (rowCount ?? 0) > 0;
}

export async function evaluateRules(
  pool: Pool,
  rules: NotificationRule[],
  snap: UserSnapshot,
  now: Date,
): Promise<Notification[]> {
  if (
    isInQuietHours(
      now,
      snap.timezone,
      snap.preferences.quietStart,
      snap.preferences.quietEnd,
    )
  )
    return [];

  const out: Notification[] = [];
  for (const rule of rules) {
    if (snap.preferences.mutedRules.includes(rule.id)) continue;
    if (await alreadySentToday(pool, snap.userId, rule.id)) continue;
    const n = rule.evaluate(snap, now);
    if (n) out.push(n);
  }
  return out;
}
