import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";
import { BiomarkerStore } from "@/biomarkers/store";
import type { Provider } from "@/biomarkers/types";

// GET /api/biomarkers/status
// Devuelve los proveedores conectados y las métricas medias de los últimos 7 días
export async function GET() {
  const session = await createSessionClient();
  const { data: { user }, error } = await session.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: connections } = await db
    .from("biomarker_connections")
    .select("provider, connected_at")
    .eq("user_id", user.id);

  const connected = (connections ?? []).map((c) => c.provider as Provider);

  const store = new BiomarkerStore();
  const samples = await store.recent(user.id, 7).catch(() => []);

  const byType: Record<string, number[]> = {};
  for (const s of samples) {
    (byType[s.type] ??= []).push(s.value);
  }
  const avg = (arr: number[]) => Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

  const metrics: Record<string, number> = {};
  if (byType.hrv?.length)          metrics.hrv          = avg(byType.hrv);
  if (byType.sleep_h?.length)      metrics.sleep_h       = avg(byType.sleep_h);
  if (byType.resting_hr?.length)   metrics.resting_hr    = avg(byType.resting_hr);
  if (byType.glucose_mean?.length) metrics.glucose_mean  = avg(byType.glucose_mean);

  return NextResponse.json({ connected, metrics });
}
