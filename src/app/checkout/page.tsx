import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Food·Mood",
  robots: { index: false, follow: true },
};

// Checkout is handled via /api/stripe/checkout — this URL has no standalone page.
// Redirect to pricing so users land somewhere useful instead of a 404/500.
export default function CheckoutPage() {
  redirect("/pricing");
}
