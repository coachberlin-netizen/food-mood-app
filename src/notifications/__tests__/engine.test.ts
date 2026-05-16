import { describe, it, expect, vi, beforeEach } from "vitest";
import { polyphenolWindow } from "../rules/polyphenol-window";
import { sleepShortCalm } from "../rules/sleep-short-calm";
import { fermentedReminder } from "../rules/fermented-reminder";
import { moodCheckinNudge } from "../rules/mood-checkin-nudge";
import { evaluateRules, alreadySentToday } from "../engine";
import type { UserSnapshot } from "../types";

const baseSnap = (): UserSnapshot => ({
  userId: "test-user",
  timezone: "Europe/Madrid",
  preferences: {
    pushEnabled: true,
    emailEnabled: false,
    mutedRules: [],
    quietStart: "22:00",
    quietEnd: "08:00",
  },
  recentBiomarkers: [],
});

describe("polyphenolWindow", () => {
  it("no dispara fuera de la ventana", () => {
    const snap = { ...baseSnap(), fastingWindow: { startsAt: "08:00", endsAt: "11:00" } };
    // 07:00 Madrid (UTC+2 en mayo) = 05:00 UTC
    const now = new Date("2026-05-16T05:00:00Z");
    expect(polyphenolWindow.evaluate(snap, now)).toBeNull();
  });

  it("dispara 15 min antes del cierre (10:46 Madrid = 08:46 UTC)", () => {
    const snap = { ...baseSnap(), fastingWindow: { startsAt: "08:00", endsAt: "11:00" } };
    const now = new Date("2026-05-16T08:46:00Z"); // 10:46 Madrid
    expect(polyphenolWindow.evaluate(snap, now)?.ruleId).toBe("polyphenol_window");
  });

  it("no dispara si no hay fastingWindow", () => {
    expect(polyphenolWindow.evaluate(baseSnap(), new Date())).toBeNull();
  });
});

describe("sleepShortCalm", () => {
  it("no dispara fuera de la ventana matinal", () => {
    const snap = {
      ...baseSnap(),
      recentBiomarkers: [{ type: "sleep_h", value: 5, measuredAt: new Date(Date.now() - 3600 * 1000) }],
    };
    // 14:00 Madrid
    const now = new Date("2026-05-16T12:00:00Z");
    expect(sleepShortCalm.evaluate(snap, now)).toBeNull();
  });

  it("dispara entre las 8 y las 10 con sueño <6h", () => {
    const snap = {
      ...baseSnap(),
      recentBiomarkers: [{ type: "sleep_h", value: 4.5, measuredAt: new Date(Date.now() - 3600 * 1000) }],
    };
    // 09:00 Madrid (UTC+2) = 07:00 UTC
    const now = new Date("2026-05-16T07:00:00Z");
    const result = sleepShortCalm.evaluate(snap, now);
    expect(result?.ruleId).toBe("sleep_short_calm");
    expect(result?.body).toContain("4.5h");
  });

  it("no dispara si el sueño fue ≥6h", () => {
    const snap = {
      ...baseSnap(),
      recentBiomarkers: [{ type: "sleep_h", value: 7, measuredAt: new Date(Date.now() - 3600 * 1000) }],
    };
    const now = new Date("2026-05-16T07:00:00Z");
    expect(sleepShortCalm.evaluate(snap, now)).toBeNull();
  });
});

describe("fermentedReminder", () => {
  it("no dispara fuera de la ventana de comida", () => {
    // 10:00 Madrid
    const now = new Date("2026-05-16T08:00:00Z");
    expect(fermentedReminder.evaluate(baseSnap(), now)).toBeNull();
  });

  it("dispara a las 13:30 si no hay fermentado en 24h", () => {
    // 13:30 Madrid (UTC+2) = 11:30 UTC
    const now = new Date("2026-05-16T11:30:00Z");
    expect(fermentedReminder.evaluate(baseSnap(), now)?.ruleId).toBe("fermented_reminder");
  });

  it("no dispara si fermentado fue consumido en las últimas 24h", () => {
    const snap = {
      ...baseSnap(),
      recentBiomarkers: [
        { type: "fermented_consumed", value: 1, measuredAt: new Date(Date.now() - 2 * 3600 * 1000) },
      ],
    };
    const now = new Date("2026-05-16T11:30:00Z");
    expect(fermentedReminder.evaluate(snap, now)).toBeNull();
  });
});

describe("moodCheckinNudge", () => {
  it("no dispara antes de las 20h", () => {
    // 19:00 Madrid = 17:00 UTC
    const now = new Date("2026-05-16T17:00:00Z");
    expect(moodCheckinNudge.evaluate(baseSnap(), now)).toBeNull();
  });

  it("dispara a las 20h si no hubo check-in hoy", () => {
    // 20:00 Madrid (UTC+2) = 18:00 UTC
    const now = new Date("2026-05-16T18:00:00Z");
    expect(moodCheckinNudge.evaluate(baseSnap(), now)?.ruleId).toBe("mood_checkin_nudge");
  });

  it("no dispara si ya hubo check-in hoy", () => {
    const snap = {
      ...baseSnap(),
      lastMoodCheckinAt: new Date("2026-05-16T10:00:00Z"),
    };
    const now = new Date("2026-05-16T18:00:00Z");
    expect(moodCheckinNudge.evaluate(snap, now)).toBeNull();
  });
});

describe("evaluateRules — quiet hours", () => {
  it("bloquea todas las reglas en quiet hours", async () => {
    const pool = { query: vi.fn() } as any;
    const snap: UserSnapshot = {
      ...baseSnap(),
      preferences: { ...baseSnap().preferences, quietStart: "22:00", quietEnd: "08:00" },
    };
    // 23:00 Madrid = 21:00 UTC
    const now = new Date("2026-05-16T21:00:00Z");
    const rules = [{ id: "test", evaluate: () => ({ ruleId: "test", channel: "push" as const, title: "T", body: "B" }) }];
    const result = await evaluateRules(pool, rules, snap, now);
    expect(result).toHaveLength(0);
    expect(pool.query).not.toHaveBeenCalled();
  });
});
