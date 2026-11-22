import { describe, expect, it } from 'vitest'
import { parseModelId } from './path'

describe('parseModelId', () => {
  it('parses a simple id', () => expect(parseModelId('/models/stairs')).toBe('stairs'))
  it('allows a trailing slash', () => expect(parseModelId('/models/stairs/')).toBe('stairs'))
  it('decodes percent-encoding', () => expect(parseModelId('/models/a%20b')).toBe('a b'))
  it('rejects other paths', () => {
    expect(parseModelId('/')).toBeUndefined()
    expect(parseModelId('/models/')).toBeUndefined()
    expect(parseModelId('/models/a/b')).toBeUndefined()
  })
  it('rejects malformed encoding', () => expect(parseModelId('/models/%E0%A4%A')).toBeUndefined())
})
