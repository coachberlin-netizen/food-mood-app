import logger from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { getAdapter, WEB_PROVIDERS } from "@/biomarkers/adapters";
import { BiomarkerStore } from "@/biomarkers/store";
import { handleOAuthCallback } from "@/biomarkers/oauth-callback";
import type { Provider } from "@/biomarkers/types";

function isWebProvider(p: string): p is Provider {
  return WEB_PROVIDERS.includes(p as Provider);
}

function deleteCookie(res: NextResponse) {
  res.cookies.set("bm_oauth_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

function errorRedirect(base: string): NextResponse {
  const res = NextResponse.redirect(new URL("/dashboard?biomarker_error=1", base));
  deleteCookie(res);
  return res;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } },
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/";
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");

  if (!code || !stateParam) return errorRedirect(appUrl);

  const cookieValue = request.cookies.get("bm_oauth_state")?.value;
  if (!cookieValue) return errorRedirect(appUrl);

  const sep = cookieValue.indexOf("|");
  if (sep === -1) return errorRedirect(appUrl);

  const cookieState = cookieValue.slice(0, sep);
  const userId = cookieValue.slice(sep + 1);

  if (cookieState !== stateParam) return errorRedirect(appUrl);

  const { provider } = params;
  if (!isWebProvider(provider)) return errorRedirect(appUrl);

  const redirectUri = new URL(`/api/biomarkers/callback/${provider}`, appUrl).toString();

  try {
    const adapter = getAdapter(provider);
    const store = new BiomarkerStore();
    await handleOAuthCallback({ adapter, store, code, userId, redirectUri });
  } catch (err) {
    logger.error("[biomarkers/callback]", err);
    return errorRedirect(appUrl);
  }

  const res = NextResponse.redirect(
    new URL(`/dashboard?biomarker_connected=${provider}`, appUrl),
  );
  deleteCookie(res);
  return res;
}
