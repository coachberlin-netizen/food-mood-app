import Stripe from "stripe";

export function buildStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error("STRIPE_SECRET_KEY no definida");
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}
