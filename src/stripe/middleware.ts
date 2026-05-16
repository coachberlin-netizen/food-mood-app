import type { MembershipStore } from "./membership-store";

export class InactiveMembership extends Error {
  constructor(public reason: "no_membership" | "past_due" | "canceled" | "incomplete") {
    super(`Membresía no activa: ${reason}`);
    this.name = "InactiveMembership";
  }
}

export async function requireActiveMembership(userId: string, store: MembershipStore): Promise<void> {
  const m = await store.get(userId);
  if (!m) throw new InactiveMembership("no_membership");
  if (m.status === "active" || m.status === "trialing") return;
  throw new InactiveMembership(m.status as "past_due" | "canceled" | "incomplete");
}
