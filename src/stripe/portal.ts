import type Stripe from "stripe";
import type { MembershipStore } from "./membership-store";

export async function createPortalSession(args: {
  stripe: Stripe;
  store: MembershipStore;
  userId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const m = await args.store.get(args.userId);
  if (!m) throw new Error("Usuario sin membresía");
  const portal = await args.stripe.billingPortal.sessions.create({
    customer: m.stripeCustomerId,
    return_url: args.returnUrl,
  });
  return { url: portal.url };
}
