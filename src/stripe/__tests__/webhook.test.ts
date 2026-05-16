import { describe, it, expect, vi } from "vitest";
import { handleStripeWebhook, InvalidSignature } from "../webhook";
import { InMemoryMembershipStore } from "../membership-store";

const stripe = {
  webhooks: { constructEvent: vi.fn() },
  subscriptions: { retrieve: vi.fn() },
} as any;

describe("stripe webhook", () => {
  it("rechaza signature inválida", async () => {
    stripe.webhooks.constructEvent.mockImplementation(() => { throw new Error("bad sig"); });
    await expect(
      handleStripeWebhook("body", "sig", { stripe, store: new InMemoryMembershipStore(), webhookSecret: "x", logger: vi.fn() })
    ).rejects.toBeInstanceOf(InvalidSignature);
  });

  it("activa membresía en checkout.session.completed", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      id: "evt_1",
      type: "checkout.session.completed",
      data: { object: { id: "cs_1", client_reference_id: "u1", customer: "cus_1", subscription: "sub_1" } },
    });
    stripe.subscriptions.retrieve.mockResolvedValue({
      status: "active",
      metadata: { plan: "monthly" },
      current_period_end: 1_900_000_000,
    });
    const store = new InMemoryMembershipStore();
    await handleStripeWebhook("body", "sig", { stripe, store, webhookSecret: "x", logger: vi.fn() });
    const m = await store.get("u1");
    expect(m?.status).toBe("active");
    expect(m?.plan).toBe("monthly");
    expect(m?.stripeCustomerId).toBe("cus_1");
  });

  it("es idempotente ante eventos duplicados", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      id: "evt_dup",
      type: "customer.subscription.deleted",
      data: { object: { customer: "cus_x", id: "sub_x" } },
    });
    const store = new InMemoryMembershipStore();
    await store.markEventProcessed("evt_dup");
    const logger = vi.fn();
    await handleStripeWebhook("body", "sig", { stripe, store, webhookSecret: "x", logger });
    expect(logger).toHaveBeenCalledWith(expect.objectContaining({ event: "stripe_event_duplicate" }));
  });

  it("marca past_due en invoice.payment_failed", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      id: "evt_2",
      type: "invoice.payment_failed",
      data: { object: { customer: "cus_2" } },
    });
    const store = new InMemoryMembershipStore();
    await store.upsert({ userId: "u2", stripeCustomerId: "cus_2", stripeSubscriptionId: "sub_2", status: "active", plan: "monthly", currentPeriodEnd: null });
    await handleStripeWebhook("body", "sig", { stripe, store, webhookSecret: "x", logger: vi.fn() });
    expect((await store.get("u2"))?.status).toBe("past_due");
  });

  it("cancela membresía en subscription.deleted", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      id: "evt_3",
      type: "customer.subscription.deleted",
      data: { object: { id: "sub_3", customer: "cus_3", status: "canceled", metadata: {}, current_period_end: 0 } },
    });
    const store = new InMemoryMembershipStore();
    await store.upsert({ userId: "u3", stripeCustomerId: "cus_3", stripeSubscriptionId: "sub_3", status: "active", plan: "annual", currentPeriodEnd: null });
    const logger = vi.fn();
    await handleStripeWebhook("body", "sig", { stripe, store, webhookSecret: "x", logger });
    expect((await store.get("u3"))?.status).toBe("canceled");
    expect(logger).toHaveBeenCalledWith(expect.objectContaining({ event: "membership_canceled" }));
  });
});
