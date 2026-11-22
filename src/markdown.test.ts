import { describe, expect, it } from 'vitest'
import { renderNotes } from './markdown'

describe('renderNotes', () => {
  it('renders headings and paragraphs', () => {
    const html = renderNotes('# Title\n\n## Sub\n\nHello world')
    expect(html).toContain('<h1>Title</h1>')
    expect(html).toContain('<h2>Sub</h2>')
    expect(html).toContain('<p>Hello world</p>')
  })
  it('renders lists', () => {
    expect(renderNotes('- a\n- b')).toContain('<ul>')
    expect(renderNotes('1. a\n2. b')).toContain('<ol>')
  })
  it('renders bold and italic', () => {
    const html = renderNotes('**bold** and *italic*')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
  })
  it('renders safe links and adds rel to external ones', () => {
    const html = renderNotes('[x](https://example.com)')
    expect(html).toContain('<a href="https://example.com"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(renderNotes('[y](/models/stairs)')).toContain('<a href="/models/stairs">')
  })
  it('escapes raw HTML blocks and inline tags', () => {
    expect(renderNotes('<script>alert(1)</script>')).not.toContain('<script>')
    const inline = renderNotes('hi <img src=x onerror=alert(1)> there')
    expect(inline).not.toContain('<img')
    expect(inline).toContain('&lt;img')
  })
  it('neutralises unsafe link schemes, keeping the text', () => {
    const html = renderNotes('[click](javascript:alert(1))')
    expect(html).not.toContain('href')
    expect(html).toContain('click')
  })
  it('returns empty output for empty input', () => {
    expect(renderNotes('').trim()).toBe('')
  })
})
