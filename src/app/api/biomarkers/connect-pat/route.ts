import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BiomarkerStore } from "@/biomarkers/store";

async function validateOuraPAT(token: string): Promise<boolean> {
  const res = await fetch("https://api.ouraring.com/v2/usercollection/personal_info", {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as { token?: string };
  const token = body.token?.trim();
  if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

  const valid = await validateOuraPAT(token).catch(() => false);
  if (!valid) {
    return NextResponse.json(
      { error: "Token inválido. Comprueba que lo copiaste completo desde Oura Cloud." },
      { status: 422 },
    );
  }

  const store = new BiomarkerStore();
  await store.saveConnection({ userId: user.id, provider: "oura", access: token });

  return NextResponse.json({ ok: true });
}
