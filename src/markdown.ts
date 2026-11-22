import { Marked } from 'marked'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const isSafeHref = (href: string) => /^(https?:|mailto:|\/(?!\/)|#)/i.test(href.trim())
const isExternal = (href: string) => /^https?:/i.test(href.trim())

const md = new Marked({ gfm: false, async: false })
md.use({
  renderer: {
    // Raw HTML is shown as text, never as markup.
    html: ({ text }) => escapeHtml(text),
    // Images are out of scope: keep the alt text only.
    image: ({ text }) => escapeHtml(text),
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens)
      if (!isSafeHref(href)) return inner
      const t = title ? ` title="${escapeHtml(title)}"` : ''
      const rel = isExternal(href) ? ' rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(href)}"${t}${rel}>${inner}</a>`
    },
  },
})

/** Renders Notes Markdown to an HTML string. Build-time only; never shipped as a parser. */
export function renderNotes(markdown: string): string {
  return md.parse(markdown) as string
}
