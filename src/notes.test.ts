import { describe, expect, it } from 'vitest'
import { getNotesHtml } from './notes'

describe('getNotesHtml', () => {
  it('resolves Notes by model id, rendered to HTML', () => {
    const html = getNotesHtml({ id: 'stairs' })
    expect(html).toContain('<h2>')
    expect(html).not.toContain('## ')
  })
  it('returns undefined when a model has no Notes file', () => {
    expect(getNotesHtml({ id: 'no-such-model' })).toBeUndefined()
  })
  it('returns undefined when the catalog notes filename does not exist', () => {
    expect(getNotesHtml({ id: 'stairs', notes: 'missing.md' })).toBeUndefined()
  })
  it('uses the catalog notes filename when given', () => {
    expect(getNotesHtml({ id: 'other', notes: 'stairs.md' })).toContain('<h2>')
  })
})
