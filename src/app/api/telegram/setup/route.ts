import { NextRequest, NextResponse } from 'next/server'
import { setWebhook } from '@/lib/telegram'

// One-shot setup: POST /api/telegram/setup  (admin only, guarded by CRON_SECRET)
export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://food-mood.app'
  const webhookUrl = `${appUrl}/api/telegram/webhook`
  await setWebhook(webhookUrl)

  return NextResponse.json({ ok: true, webhookUrl })
}
