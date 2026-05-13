import { readFileSync } from 'fs'
import { join } from 'path'

export function buildHtml(): string {
  return readFileSync(
    join(process.cwd(), 'newsletters', '24-microbioma-ansiedad.html'),
    'utf8'
  )
}
