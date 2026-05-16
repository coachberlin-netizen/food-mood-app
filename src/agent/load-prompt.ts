import fs from 'fs'
import path from 'path'

let cachedPrompt: string | null = null

// Carga el system prompt una vez al arranque; lo cachea en memoria.
export function loadSystemPrompt(): string {
  if (cachedPrompt) return cachedPrompt
  const promptPath = path.join(process.cwd(), 'src', 'agent', 'system-prompt.md')
  cachedPrompt = fs.readFileSync(promptPath, 'utf-8')
  return cachedPrompt
}
