import type Stripe from "stripe";
import type { MembershipStore } from "./membership-store";
import type { MembershipStatus, Plan } from "./types";

export class InvalidSignature extends Error {
  constructor(m: string) { super(m); this.name = "InvalidSignature"; }
}

type Logger = (e: Record<string, unknown>) => void;
type Deps = { stripe: Stripe; store: MembershipStore; webhookSecret: string; logger: Logger };

export async function handleStripeWebhook(rawBody: string | Buffer, signature: string, deps: Deps): Promise<void> {
  let event: Stripe.Event;
  try {
    event = deps.stripe.webhooks.constructEvent(rawBody, signature, deps.webhookSecret);
  } catch (err) {
    throw new InvalidSignature((err as Error).message);
  }

  if (await deps.store.eventProcessed(event.id)) {
    deps.logger({ event: "stripe_event_duplicate", id: event.id, type: event.type });
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      await onCheckoutCompleted(event.data.object as Stripe.Checkout.Session, deps); break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await onSubscriptionUpdated(event.data.object as Stripe.Subscription, deps); break;
    case "customer.subscription.deleted":
      await onSubscriptionDeleted(event.data.object as Stripe.Subscription, deps); break;
    case "invoice.payment_failed":
      await onPaymentFailed(event.data.object as Stripe.Invoice, deps); break;
    default:
      deps.logger({ event: "stripe_event_ignored", type: event.type });
  }

  await deps.store.markEventProcessed(event.id);
}

async function onCheckoutCompleted(s: Stripe.Checkout.Session, deps: Deps) {
  const userId = s.client_reference_id;
  const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
  const subscriptionId = typeof s.subscription === "string" ? s.subscription : s.subscription?.id ?? null;
  if (!userId || !customerId) {
    deps.logger({ event: "stripe_checkout_missing_ids", session: s.id });
    return;
  }
  const sub = subscriptionId ? await deps.stripe.subscriptions.retrieve(subscriptionId) : null;
  await deps.store.upsert({
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    status: (sub?.status ?? "active") as MembershipStatus,
    plan: (sub?.metadata?.plan ?? "monthly") as Plan,
    currentPeriodEnd: sub?.billing_cycle_anchor ? new Date(sub.billing_cycle_anchor * 1000) : null,
  });
  deps.logger({ event: "membership_activated", user_id: userId });
}

async function onSubscriptionUpdated(sub: Stripe.Subscription, deps: Deps) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const existing = await deps.store.getByCustomerId(customerId);
  if (!existing) {
    deps.logger({ event: "stripe_subscription_orphan", subscription: sub.id });
    return;
  }
  await deps.store.upsert({
    ...existing,
    stripeSubscriptionId: sub.id,
    status: sub.status as MembershipStatus,
    plan: (sub.metadata?.plan ?? existing.plan) as Plan,
    currentPeriodEnd: sub.billing_cycle_anchor ? new Date(sub.billing_cycle_anchor * 1000) : null,
  });
  deps.logger({ event: "membership_updated", user_id: existing.userId, status: sub.status });
}

async function onSubscriptionDeleted(sub: Stripe.Subscription, deps: Deps) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const existing = await deps.store.getByCustomerId(customerId);
  if (!existing) return;
  await deps.store.upsert({ ...existing, status: "canceled", stripeSubscriptionId: sub.id });
  deps.logger({ event: "membership_canceled", user_id: existing.userId });
}

async function onPaymentFailed(invoice: Stripe.Invoice, deps: Deps) {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;
  const existing = await deps.store.getByCustomerId(customerId);
  if (!existing) return;
  await deps.store.upsert({ ...existing, status: "past_due" });
  deps.logger({ event: "membership_payment_failed", user_id: existing.userId });
}
