import type { Pool } from "pg";
import webpush from "web-push";
import { Resend } from "resend";
import type { Notification } from "./types";

export interface PushSender {
  send(userId: string, n: Notification): Promise<void>;
}

export interface EmailSender {
  send(userId: string, email: string, n: Notification): Promise<void>;
}

export class WebPushSender implements PushSender {
  constructor(private pool: Pool) {
    webpush.setVapidDetails(
      "mailto:admin@food-mood.app",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
  }

  async send(userId: string, n: Notification): Promise<void> {
    const { rows: subs } = await this.pool.query(
      "SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1",
      [userId],
    );

    await Promise.all(
      subs.map((sub) =>
        webpush
          .sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            JSON.stringify({ title: n.title, body: n.body, ...(n.data ?? {}) }),
          )
          .catch((err) =>
            console.error("[push]", userId, sub.endpoint, err.message),
          ),
      ),
    );
  }
}

export class ResendEmailSender implements EmailSender {
  private resend = new Resend(process.env.RESEND_API_KEY!);

  async send(userId: string, email: string, n: Notification): Promise<void> {
    await this.resend.emails.send({
      from: "Food·Mood <hola@food-mood.app>",
      to: email,
      subject: n.title,
      text: n.body,
    });
  }
}

export async function dispatch(
  pool: Pool,
  userId: string,
  n: Notification,
  senders: {
    push?: PushSender;
    email?: EmailSender;
    emailOf?: (uid: string) => Promise<string>;
  },
) {
  if (n.channel === "push" && senders.push) {
    await senders.push.send(userId, n);
  }
  if (n.channel === "email" && senders.email && senders.emailOf) {
    const email = await senders.emailOf(userId);
    await senders.email.send(userId, email, n);
  }

  await pool.query(
    `INSERT INTO notification_dispatches (user_id, rule, channel, metadata)
     VALUES ($1, $2, $3, $4)`,
    [userId, n.ruleId, n.channel, { title: n.title }],
  );
}

export async function emailOf(pool: Pool, userId: string): Promise<string> {
  const { rows } = await pool.query(
    "SELECT email FROM auth.users WHERE id = $1",
    [userId],
  );
  return rows[0]?.email ?? "";
}
