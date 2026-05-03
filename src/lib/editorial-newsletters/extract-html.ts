export function extractNewsletterParts(html: string): { styles: string; body: string } {
  const rawStyles = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? ''
  // Strip body{} rule to avoid overriding the page layout background/font
  const styles = rawStyles.replace(/\bbody\s*\{[^}]*\}/g, '')
  const body   = html.match(/<body>([\s\S]*?)<\/body>/)?.[1]?.trim() ?? ''
  return { styles, body }
}
