import { describe, expect, it } from 'vitest'
import { renderGallery } from './render'

const a = { id: 'a', title: 'Alpha', description: 'First', thumbnail: '/thumbnails/a.webp' }
const b = { id: 'b', title: 'Beta', description: 'Second', thumbnail: '/thumbnails/b.webp' }

describe('renderGallery', () => {
  it('renders one card per entry in the given order', () => {
    const html = renderGallery([b, a])
    expect(html.match(/class="card"/g)).toHaveLength(2)
    expect(html.indexOf('Beta')).toBeLessThan(html.indexOf('Alpha'))
  })
  it('links the title to the viewer and gives thumbnails alt text', () => {
    const html = renderGallery([a])
    expect(html).toContain('<a href="/models/a">Alpha</a>')
    expect(html).toContain('alt="Alpha"')
    expect(html).toContain('First')
  })
  it('escapes text and encodes ids', () => {
    const html = renderGallery([{ ...a, id: 'x y', title: '<b>T</b>', description: '"q"' }])
    expect(html).not.toContain('<b>T</b>')
    expect(html).toContain('&lt;b&gt;T&lt;/b&gt;')
    expect(html).toContain('href="/models/x%20y"')
    expect(html).toContain('&quot;q&quot;')
  })
  it('shows a message when there are no models', () => {
    expect(renderGallery([])).toContain('No models yet')
  })
})
