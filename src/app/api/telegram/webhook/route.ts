import logger from "@/lib/logger"
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Validate secret token Telegram sends in X-Telegram-Bot-Api-Secret-Token header
  const secret = req.headers.get('x-telegram-bot-api-secret-token')
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const update = await req.json()

  // We only care about new members joining the group
  const member = update?.chat_member
  if (!member) return NextResponse.json({ ok: true })

  const newStatus = member.new_chat_member?.status
  if (newStatus !== 'member' && newStatus !== 'administrator') {
    return NextResponse.json({ ok: true })
  }

  const telegramUser = member.new_chat_member?.user
  const inviteLink   = member.invite_link?.invite_link

  if (!telegramUser?.id || !inviteLink) return NextResponse.json({ ok: true })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Find the profile that holds this invite link
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('telegram_invite_url', inviteLink)
    .maybeSingle()

  if (!profile) return NextResponse.json({ ok: true })

  await supabase
    .from('profiles')
    .update({
      telegram_user_id: telegramUser.id,
      telegram_joined:  true,
    })
    .eq('id', profile.id)

  logger.info(`✅ Telegram joined: user=${profile.id} tg_id=${telegramUser.id}`)
  return NextResponse.json({ ok: true })
}
