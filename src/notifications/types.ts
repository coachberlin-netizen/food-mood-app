export type Notification = {
  ruleId: string;
  channel: "push" | "email";
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export type UserSnapshot = {
  userId: string;
  timezone: string;
  preferences: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    mutedRules: string[];
    quietStart: string;
    quietEnd: string;
  };
  recentBiomarkers: { type: string; value: number; measuredAt: Date }[];
  fastingWindow?: { startsAt: string; endsAt: string }; // HH:mm en timezone del usuario
  lastMoodCheckinAt?: Date;
};

export interface NotificationRule {
  readonly id: string;
  evaluate(snap: UserSnapshot, now: Date): Notification | null;
}
