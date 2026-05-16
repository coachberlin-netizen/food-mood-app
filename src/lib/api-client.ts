import type { AgentRequest } from "@/agent/types";
import type { AgentResponse } from "@/agent/safety/schema";

export class PaywallRequired extends Error {
  constructor() { super("Paywall required"); this.name = "PaywallRequired"; }
}

export async function callAgent(req: AgentRequest): Promise<AgentResponse> {
  const res = await fetch("/api/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (res.status === 402) throw new PaywallRequired();
  if (!res.ok) throw new Error(`Agent call failed: ${res.status}`);
  return res.json();
}

export async function startCheckout(plan: "monthly" | "annual"): Promise<void> {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) throw new Error("Error iniciando checkout");
  const { url } = await res.json();
  window.location.href = url;
}

export async function openBillingPortal(): Promise<void> {
  const res = await fetch("/api/stripe/portal", { method: "POST" });
  if (!res.ok) throw new Error("Error abriendo portal");
  const { url } = await res.json();
  window.location.href = url;
}
