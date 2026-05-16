export type MembershipStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete";
export type Plan = "monthly" | "annual";

export type Membership = {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  status: MembershipStatus;
  plan: Plan;
  currentPeriodEnd: Date | null;
};
