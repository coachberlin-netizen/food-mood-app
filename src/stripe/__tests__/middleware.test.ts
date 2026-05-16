import { describe, it, expect } from "vitest";
import { requireActiveMembership, InactiveMembership } from "../middleware";
import { InMemoryMembershipStore } from "../membership-store";

const base = { stripeCustomerId: "cus_1", stripeSubscriptionId: "sub_1", plan: "monthly" as const, currentPeriodEnd: null };

describe("requireActiveMembership", () => {
  it("lanza no_membership si el usuario no existe en el store", async () => {
    const store = new InMemoryMembershipStore();
    await expect(requireActiveMembership("u1", store)).rejects.toMatchObject({ reason: "no_membership" });
  });

  it("pasa sin error para status active", async () => {
    const store = new InMemoryMembershipStore();
    await store.upsert({ userId: "u1", ...base, status: "active" });
    await expect(requireActiveMembership("u1", store)).resolves.toBeUndefined();
  });

  it("pasa sin error para status trialing", async () => {
    const store = new InMemoryMembershipStore();
    await store.upsert({ userId: "u1", ...base, status: "trialing" });
    await expect(requireActiveMembership("u1", store)).resolves.toBeUndefined();
  });

  it("lanza past_due para membresía con pago fallido", async () => {
    const store = new InMemoryMembershipStore();
    await store.upsert({ userId: "u1", ...base, status: "past_due" });
    await expect(requireActiveMembership("u1", store)).rejects.toMatchObject({ reason: "past_due" });
    await expect(requireActiveMembership("u1", store)).rejects.toBeInstanceOf(InactiveMembership);
  });

  it("lanza canceled para suscripción cancelada", async () => {
    const store = new InMemoryMembershipStore();
    await store.upsert({ userId: "u1", ...base, status: "canceled" });
    await expect(requireActiveMembership("u1", store)).rejects.toMatchObject({ reason: "canceled" });
  });

  it("lanza incomplete para suscripción sin completar", async () => {
    const store = new InMemoryMembershipStore();
    await store.upsert({ userId: "u1", ...base, status: "incomplete" });
    await expect(requireActiveMembership("u1", store)).rejects.toMatchObject({ reason: "incomplete" });
  });
});
