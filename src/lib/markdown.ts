import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

/**
 * Converts Markdown string to HTML string.
 * This runs on the server side to keep the client bundle small.
 */
export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(gfm) // Support for tables, task lists, strikethrough, etc.
    .use(html)
    .process(markdown);
  
  return result.toString();
}
