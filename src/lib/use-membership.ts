"use client";
import { useEffect, useState } from "react";
import type { MembershipStatus } from "@/stripe/types";

type MembershipState =
  | { loading: true }
  | { loading: false; active: true; status: "active" | "trialing"; plan: string; periodEnd: Date | null }
  | { loading: false; active: false; status: MembershipStatus | "none" };

export function useMembership(): MembershipState {
  const [state, setState] = useState<MembershipState>({ loading: true });

  useEffect(() => {
    fetch("/api/stripe/membership")
      .then(r => r.json())
      .then((data: { status?: MembershipStatus; plan?: string; currentPeriodEnd?: string | null }) => {
        const s = data.status;
        if (s === "active" || s === "trialing") {
          setState({
            loading: false,
            active: true,
            status: s,
            plan: data.plan ?? "monthly",
            periodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : null,
          });
        } else {
          setState({ loading: false, active: false, status: s ?? "none" });
        }
      })
      .catch(() => setState({ loading: false, active: false, status: "none" }));
  }, []);

  return state;
}
