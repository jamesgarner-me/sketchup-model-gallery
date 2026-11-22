import type { CatalogEntry } from '../catalog'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

type Card = Pick<CatalogEntry, 'id' | 'title' | 'description' | 'thumbnail'>

/** Gallery markup for entries already in Catalog order. */
export function renderGallery(entries: Card[]): string {
  if (entries.length === 0) return '<p class="empty">No models yet.</p>'
  const cards = entries
    .map(
      (m) => `<li class="card">
  <img class="card-thumb" src="${esc(m.thumbnail)}" alt="${esc(m.title)}" loading="lazy" width="800" height="600" />
  <div class="card-body">
    <h2 class="card-title"><a href="/models/${encodeURIComponent(m.id)}">${esc(m.title)}</a></h2>
    <p class="card-desc">${esc(m.description)}</p>
  </div>
</li>`,
    )
    .join('\n')
  return `<ul class="grid">\n${cards}\n</ul>`
}
