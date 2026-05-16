import type { NotificationRule, UserSnapshot, Notification } from "../types";

/** Avisa 15 min antes del cierre del ayuno: ventana polifenólica para romperlo bien. */
export const polyphenolWindow: NotificationRule = {
  id: "polyphenol_window",

  evaluate(snap: UserSnapshot, now: Date): Notification | null {
    if (!snap.fastingWindow) return null;

    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: snap.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const [h, m] = fmt.format(now).split(":").map(Number);
    const cur = h * 60 + m;

    const [eh, em] = snap.fastingWindow.endsAt.split(":").map(Number);
    const end = eh * 60 + em;

    if (cur < end - 20 || cur > end - 10) return null;

    return {
      ruleId: this.id,
      channel: "push",
      title: "Tu ventana polifenólica empieza pronto",
      body: "En 15 minutos puedes romper el ayuno. Si rompes con polifenoles (té verde, bayas, cacao), aprovechas mejor lo que ya estaba haciendo el ayuno.",
    };
  },
};
