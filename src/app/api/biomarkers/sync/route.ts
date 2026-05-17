import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdapter } from "@/biomarkers/adapters";
import { BiomarkerStore } from "@/biomarkers/store";
import { syncUser } from "@/biomarkers/sync";
import type { Provider } from "@/biomarkers/types";

// POST /api/biomarkers/sync
// Authorization: Bearer CRON_SECRET
// Body: { userId?: string }  — si se omite, sincroniza todos los usuarios activos
export async function POST(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as { userId?: string };
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = db.from("biomarker_connections").select("user_id, provider");
  if (body.userId) query = query.eq("user_id", body.userId);

  const { data: connections, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const store = new BiomarkerStore();
  let totalSynced = 0;
  let totalErrors = 0;
  const details: { userId: string; provider: string; synced?: number; error?: string }[] = [];

  await Promise.all(
    (connections ?? []).map(async ({ user_id, provider }) => {
      try {
        const adapter = getAdapter(provider as Provider);
        const { synced } = await syncUser(user_id, adapter, store);
        totalSynced += synced;
        details.push({ userId: user_id, provider, synced });
      } catch (err) {
        totalErrors++;
        details.push({ userId: user_id, provider, error: String(err) });
        console.error(`[biomarkers/sync] ${provider}/${user_id}:`, err);
      }
    }),
  );

  return NextResponse.json({ synced: totalSynced, errors: totalErrors, connections: connections?.length ?? 0, details });
}
