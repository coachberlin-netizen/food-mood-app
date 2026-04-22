const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BASE_URL  = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}` : null

async function call(method: string, body: Record<string, unknown>) {
  if (!BASE_URL) throw new Error('TELEGRAM_BOT_TOKEN not configured')
  const res = await fetch(`${BASE_URL}/${method}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(`Telegram ${method} failed: ${data.description}`)
  return data.result
}

export function isTelegramConfigured() {
  return !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
}

export async function createInviteLink(name: string): Promise<string> {
  const chatId = process.env.TELEGRAM_CHAT_ID!
  const result = await call('createChatInviteLink', {
    chat_id:      chatId,
    name,
    member_limit: 1,
  })
  return result.invite_link as string
}

// Kick + immediately unban so the user *could* rejoin if they re-subscribe later
export async function removeMember(telegramUserId: number): Promise<void> {
  const chatId = process.env.TELEGRAM_CHAT_ID!
  await call('banChatMember',   { chat_id: chatId, user_id: telegramUserId })
  await call('unbanChatMember', { chat_id: chatId, user_id: telegramUserId })
}

export async function setWebhook(webhookUrl: string): Promise<void> {
  await call('setWebhook', {
    url:              webhookUrl,
    allowed_updates:  ['chat_member'],
    secret_token:     process.env.TELEGRAM_WEBHOOK_SECRET,
  })
}
