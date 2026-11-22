import { describe, expect, it } from 'vitest'
import { validateCatalog } from './validateCatalog'

const good = {
  id: 'a', title: 'A', description: 'd', glb: '/models/a.glb', thumbnail: '/thumbnails/a.webp', order: 1,
}
const all = () => true

describe('validateCatalog', () => {
  it('accepts a valid entry with no notes', () => {
    expect(validateCatalog([good], all)).toEqual([])
  })
  it('fails on missing GLB, naming entry and file', () => {
    const errs = validateCatalog([good], (p) => p !== '/models/a.glb')
    expect(errs).toHaveLength(1)
    expect(errs[0]).toContain('"a"')
    expect(errs[0]).toContain('/models/a.glb')
  })
  it('fails on missing thumbnail', () => {
    const errs = validateCatalog([good], (p) => p !== '/thumbnails/a.webp')
    expect(errs[0]).toContain('thumbnail')
  })
  it('fails on duplicate id, naming it', () => {
    const errs = validateCatalog([good, { ...good }], all)
    expect(errs.some((e) => e.includes('duplicate id "a"'))).toBe(true)
  })
  it('fails on missing required field', () => {
    const { title: _t, ...noTitle } = good
    expect(validateCatalog([noTitle], all)[0]).toContain('"title"')
  })
  it('accepts a known stage', () => {
    expect(validateCatalog([{ ...good, stage: 'showroom' }], all, ['neutral', 'showroom'])).toEqual([])
  })
  it('fails on an unknown stage, naming entry and stage', () => {
    const errs = validateCatalog([{ ...good, stage: 'showrom' }], all, ['neutral', 'showroom'])
    expect(errs).toHaveLength(1)
    expect(errs[0]).toContain('"a"')
    expect(errs[0]).toContain('showrom')
  })
  it('accepts valid autoOrbit values', () => {
    expect(validateCatalog([{ ...good, autoOrbit: true }], all)).toEqual([])
    expect(validateCatalog([{ ...good, autoOrbit: { degreesPerSecond: 12 } }], all)).toEqual([])
  })
  it('fails on an invalid autoOrbit, naming the entry', () => {
    const errs = validateCatalog([{ ...good, autoOrbit: { degreesPerSecond: 0 } }], all)
    expect(errs).toHaveLength(1)
    expect(errs[0]).toContain('"a"')
    expect(errs[0]).toContain('autoOrbit')
  })
  it('does not fail when notes path points at a missing file', () => {
    expect(validateCatalog([{ ...good, notes: '/content/a.md' }], (p) => p !== '/content/a.md')).toEqual([])
  })
})
