import type Stripe from "stripe";
import type { Plan } from "./types";

const PRICE_IDS: Record<Plan, string | undefined> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  annual:  process.env.STRIPE_PRICE_ANNUAL,
};

export async function createCheckoutSession(args: {
  stripe: Stripe;
  userId: string;
  email: string;
  plan: Plan;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string }> {
  const priceId = PRICE_IDS[args.plan];
  if (!priceId) throw new Error(`Price ID no configurado para ${args.plan}`);
  const session = await args.stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: args.email,
    client_reference_id: args.userId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { metadata: { user_id: args.userId, plan: args.plan } },
    success_url: args.successUrl,
    cancel_url: args.cancelUrl,
    allow_promotion_codes: true,
  });
  if (!session.url) throw new Error("Stripe no devolvió URL de checkout");
  return { url: session.url };
}
