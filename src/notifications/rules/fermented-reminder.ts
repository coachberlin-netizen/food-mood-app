import type { NotificationRule, UserSnapshot, Notification } from "../types";

/**
 * Si han pasado >24h sin un registro de "fermented_consumed", recordatorio
 * en horario de comida principal (13:00–14:30 hora local del usuario).
 * Requiere que biomarker_samples tenga entradas de type = "fermented_consumed".
 */
export const fermentedReminder: NotificationRule = {
  id: "fermented_reminder",

  evaluate(snap: UserSnapshot, now: Date): Notification | null {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: snap.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const [h, m] = fmt.format(now).split(":").map(Number);
    const cur = h * 60 + m;

    // Solo en ventana de comida (13:00–14:30)
    if (cur < 13 * 60 || cur > 14 * 60 + 30) return null;

    const lastFermented = snap.recentBiomarkers
      .filter((b) => b.type === "fermented_consumed")
      .sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime())[0];

    // Si consumió fermentado en las últimas 24h, no avisar
    if (
      lastFermented &&
      now.getTime() - lastFermented.measuredAt.getTime() < 24 * 3600 * 1000
    )
      return null;

    return {
      ruleId: this.id,
      channel: "push",
      title: "Tu dosis de fermentados",
      body: "Un vasito de kéfir, kombucha o un cucharón de chucrut en la comida — pequeño gesto, gran impacto en tu microbiota.",
    };
  },
};
