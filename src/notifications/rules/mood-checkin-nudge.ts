import type { NotificationRule, UserSnapshot, Notification } from "../types";

/**
 * Si no hubo check-in de estado emocional hoy y son las 20-21h,
 * nudge suave para cerrar el día con el Asesor.
 * Silenciado por defecto en nuevos usuarios (muted_rules = ['mood_checkin_nudge']).
 */
export const moodCheckinNudge: NotificationRule = {
  id: "mood_checkin_nudge",

  evaluate(snap: UserSnapshot, now: Date): Notification | null {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: snap.timezone,
      hour: "2-digit",
      hour12: false,
    });
    const hour = Number(fmt.format(now));

    // Solo entre las 20 y las 21 hora local
    if (hour < 20 || hour >= 21) return null;

    // Comprobar si ya hizo check-in hoy (en timezone del usuario)
    if (snap.lastMoodCheckinAt) {
      const dateFmt = new Intl.DateTimeFormat("en-CA", {
        timeZone: snap.timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const todayStr = dateFmt.format(now);
      const lastStr = dateFmt.format(snap.lastMoodCheckinAt);
      if (lastStr === todayStr) return null;
    }

    return {
      ruleId: this.id,
      channel: "push",
      title: "¿Cómo terminó tu día?",
      body: "Un momento de atención a cómo te sientes — tu Asesor Food·Mood puede ayudarte a cerrar bien el día.",
      data: { url: "/quiz" },
    };
  },
};
