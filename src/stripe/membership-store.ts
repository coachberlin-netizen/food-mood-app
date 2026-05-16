import type { Membership } from "./types";

export interface MembershipStore {
  get(userId: string): Promise<Membership | null>;
  getByCustomerId(stripeCustomerId: string): Promise<Membership | null>;
  upsert(m: Membership): Promise<void>;
  eventProcessed(eventId: string): Promise<boolean>;
  markEventProcessed(eventId: string): Promise<void>;
}

export class InMemoryMembershipStore implements MembershipStore {
  private byUser = new Map<string, Membership>();
  private byCustomer = new Map<string, string>();
  private events = new Set<string>();

  async get(userId: string) { return this.byUser.get(userId) ?? null; }
  async getByCustomerId(id: string) { const u = this.byCustomer.get(id); return u ? (this.byUser.get(u) ?? null) : null; }
  async upsert(m: Membership) { this.byUser.set(m.userId, m); this.byCustomer.set(m.stripeCustomerId, m.userId); }
  async eventProcessed(id: string) { return this.events.has(id); }
  async markEventProcessed(id: string) { this.events.add(id); }
}
