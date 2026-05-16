import { Paywall } from "@/components/Paywall";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food·Mood Plus",
  robots: { index: false, follow: false },
};

export default function PaywallPage() {
  return <Paywall />;
}
