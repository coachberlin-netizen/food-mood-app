import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getAdapter, WEB_PROVIDERS } from "@/biomarkers/adapters";
import type { Provider } from "@/biomarkers/types";

function isWebProvider(p: string): p is Provider {
  return WEB_PROVIDERS.includes(p as Provider);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { provider: string } },
) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { provider } = params;
  if (!isWebProvider(provider)) {
    return NextResponse.json(
      { error: `Proveedor no soportado: ${provider}` },
      { status: 400 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL no configurado" }, { status: 500 });

  const redirectUri = new URL(`/api/biomarkers/callback/${provider}`, appUrl).toString();
  const state = randomBytes(16).toString("hex");

  let authorizeUrl: string;
  try {
    authorizeUrl = getAdapter(provider).authorizeUrl(state, redirectUri);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al obtener adaptador" },
      { status: 500 },
    );
  }

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("bm_oauth_state", `${state}|${user.id}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
