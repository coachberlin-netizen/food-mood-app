import { describe, it, expect, vi, afterEach } from "vitest";
import { isAdminEmail, getPremiumStatus } from "../premium";
import type { SupabaseClient } from "@supabase/supabase-js";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

type TableData = Record<string, unknown> | null;

function makeSupabase(opts: {
  userEmail?: string | null;
  sub?:         TableData;
  profile?:     TableData;
  userProfile?: TableData;
} = {}): SupabaseClient {
  const { userEmail = null, sub = null, profile = null, userProfile = null } = opts;

  const chain = (data: TableData) => ({
    select:      vi.fn().mockReturnThis(),
    eq:          vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error: null }),
  });

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userEmail ? { email: userEmail } : null },
        error: null,
      }),
    },
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "subscriptions") return chain(sub);
      if (table === "profiles")      return chain(profile);
      if (table === "user_profiles") return chain(userProfile);
      return chain(null);
    }),
  } as unknown as SupabaseClient;
}

// ------------------------------------------------------------------
// isAdminEmail
// ------------------------------------------------------------------

describe("isAdminEmail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns true when email matches FM_ADMIN_EMAILS", () => {
    vi.stubEnv("FM_ADMIN_EMAILS", "admin@food-mood.app,ops@food-mood.app");
    expect(isAdminEmail("admin@food-mood.app")).toBe(true);
  });

  it("is case-insensitive", () => {
    vi.stubEnv("FM_ADMIN_EMAILS", "admin@food-mood.app");
    expect(isAdminEmail("ADMIN@food-mood.app")).toBe(true);
  });

  it("falls back to ADMIN_EMAIL when FM_ADMIN_EMAILS is not set", () => {
    // ?? only triggers on undefined/null, not empty string — must truly unset the var
    const original = process.env.FM_ADMIN_EMAILS;
    delete process.env.FM_ADMIN_EMAILS;
    vi.stubEnv("ADMIN_EMAIL", "backup@food-mood.app");
    expect(isAdminEmail("backup@food-mood.app")).toBe(true);
    if (original !== undefined) process.env.FM_ADMIN_EMAILS = original;
  });

  it("returns false for a non-admin email", () => {
    vi.stubEnv("FM_ADMIN_EMAILS", "admin@food-mood.app");
    expect(isAdminEmail("user@example.com")).toBe(false);
  });

  it("returns false for undefined email", () => {
    vi.stubEnv("FM_ADMIN_EMAILS", "admin@food-mood.app");
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("returns false when both env vars are empty", () => {
    vi.stubEnv("FM_ADMIN_EMAILS", "");
    vi.stubEnv("ADMIN_EMAIL", "");
    expect(isAdminEmail("anyone@example.com")).toBe(false);
  });
});

// ------------------------------------------------------------------
// getPremiumStatus
// ------------------------------------------------------------------

describe("getPremiumStatus", () => {
  it("returns false immediately for empty userId", async () => {
    const supabase = makeSupabase();
    expect(await getPremiumStatus(supabase, "")).toBe(false);
  });

  it("returns true for admin email (bypasses DB checks)", async () => {
    vi.stubEnv("FM_ADMIN_EMAILS", "admin@food-mood.app");
    const supabase = makeSupabase({ userEmail: "admin@food-mood.app" });
    expect(await getPremiumStatus(supabase, "user-uuid")).toBe(true);
    vi.unstubAllEnvs();
  });

  it("returns true when subscriptions table has an active row", async () => {
    const supabase = makeSupabase({ sub: { status: "active" } });
    expect(await getPremiumStatus(supabase, "user-uuid")).toBe(true);
  });

  it("returns true when profiles.is_premium is true", async () => {
    const supabase = makeSupabase({
      sub:     null,
      profile: { is_premium: true, premium_level: 0 },
    });
    expect(await getPremiumStatus(supabase, "user-uuid")).toBe(true);
  });

  it("returns true when profiles.premium_level > 0", async () => {
    const supabase = makeSupabase({
      sub:     null,
      profile: { is_premium: false, premium_level: 1 },
    });
    expect(await getPremiumStatus(supabase, "user-uuid")).toBe(true);
  });

  it("returns true when user_profiles.tier is 'premium'", async () => {
    const supabase = makeSupabase({
      sub:         null,
      profile:     { is_premium: false, premium_level: 0 },
      userProfile: { tier: "premium" },
    });
    expect(await getPremiumStatus(supabase, "user-uuid")).toBe(true);
  });

  it("returns false when all checks fail", async () => {
    const supabase = makeSupabase({
      sub:         null,
      profile:     { is_premium: false, premium_level: 0 },
      userProfile: { tier: "free" },
    });
    expect(await getPremiumStatus(supabase, "user-uuid")).toBe(false);
  });

  it("returns false (not throw) when Supabase throws an unexpected error", async () => {
    const supabase = {
      auth: { getUser: vi.fn().mockRejectedValue(new Error("network")) },
      from: vi.fn(),
    } as unknown as SupabaseClient;
    expect(await getPremiumStatus(supabase, "user-uuid")).toBe(false);
  });

  it("subscription check short-circuits — profiles are not queried", async () => {
    const supabase = makeSupabase({ sub: { status: "active" } });
    await getPremiumStatus(supabase, "user-uuid");
    const fromCalls = (supabase.from as ReturnType<typeof vi.fn>).mock.calls.map(
      (args: unknown[]) => args[0] as string
    );
    expect(fromCalls).not.toContain("profiles");
    expect(fromCalls).not.toContain("user_profiles");
  });
});
