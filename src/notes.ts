import type { CatalogEntry } from './catalog'

// Rendered to HTML strings at build time by the notes plugin in vite.config.ts.
const files = import.meta.glob<string>('/src/content/*.md', { eager: true, import: 'default' })

/** Notes HTML for a Model, or undefined when it has none. Missing files are not an error. */
export function getNotesHtml(entry: Pick<CatalogEntry, 'id' | 'notes'>): string | undefined {
  const html = files[`/src/content/${entry.notes ?? `${entry.id}.md`}`]
  return html && html.trim() ? html : undefined
}
