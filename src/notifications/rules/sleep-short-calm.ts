import type { NotificationRule, UserSnapshot, Notification } from "../types";

/** Si el último sueño fue corto (<6h), sugiere modo Calma para el día. Se evalúa por la mañana (8-10h). */
export const sleepShortCalm: NotificationRule = {
  id: "sleep_short_calm",

  evaluate(snap: UserSnapshot, now: Date): Notification | null {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: snap.timezone,
      hour: "2-digit",
      hour12: false,
    });
    const hour = Number(fmt.format(now));
    if (hour < 8 || hour > 10) return null;

    const lastSleep = snap.recentBiomarkers
      .filter((b) => b.type === "sleep_h")
      .sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime())[0];

    if (!lastSleep) return null;
    if (lastSleep.value >= 6) return null;
    if (now.getTime() - lastSleep.measuredAt.getTime() > 24 * 3600 * 1000) return null;

    return {
      ruleId: this.id,
      channel: "push",
      title: "Hoy modo Calma, sin forzar",
      body: `Anoche dormiste ${lastSleep.value.toFixed(1)}h. Te propongo un día Calma: fermentos suaves, respiración postprandial y nada de cafeína después de las 14h.`,
      data: { suggestedMood: "Calma" },
    };
  },
};
