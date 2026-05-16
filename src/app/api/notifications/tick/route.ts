import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/server/pool";
import { tick } from "@/notifications/worker";

// Vercel cron fires GET requests
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pool = getPool();
    const result = await tick(pool);
    console.log("[notifications/tick]", result);
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    console.error("[notifications/tick] error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
