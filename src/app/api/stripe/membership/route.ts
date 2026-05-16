import { NextResponse } from "next/server";
import { createClient as createSessionClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET() {
  const session = await createSessionClient();
  const { data: { user }, error } = await session.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ status: "none" }, { status: 200 });
  }

  const service = serviceClient();
  const [{ data: profile }, { data: sub }] = await Promise.all([
    service.from("profiles").select("is_premium, premium_level").eq("id", user.id).maybeSingle(),
    service.from("subscriptions").select("status, plan_type, current_period_end").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const isActive =
    sub?.status === "active" ||
    sub?.status === "trialing" ||
    profile?.is_premium === true ||
    (profile?.premium_level ?? 0) > 0;

  if (!isActive) {
    return NextResponse.json({ status: sub?.status ?? "none" });
  }

  return NextResponse.json({
    status: sub?.status ?? "active",
    plan: sub?.plan_type ?? "monthly",
    currentPeriodEnd: sub?.current_period_end ?? null,
  });
}
