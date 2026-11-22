import { describe, expect, it } from 'vitest'
import { DEFAULT_AUTO_ORBIT_DEG_PER_SEC, isValidAutoOrbit, resolveAutoOrbit } from './autoOrbit'

describe('resolveAutoOrbit', () => {
  it('uses the default speed for true', () => expect(resolveAutoOrbit(true, false)).toBe(DEFAULT_AUTO_ORBIT_DEG_PER_SEC))
  it('uses a custom speed', () => expect(resolveAutoOrbit({ degreesPerSecond: 30 }, false)).toBe(30))
  it('allows negative speed to reverse', () => expect(resolveAutoOrbit({ degreesPerSecond: -10 }, false)).toBe(-10))
  it('is off when absent or false', () => {
    expect(resolveAutoOrbit(undefined, false)).toBeUndefined()
    expect(resolveAutoOrbit(false, false)).toBeUndefined()
  })
  it('is off when reduced motion is requested', () => expect(resolveAutoOrbit(true, true)).toBeUndefined())
})

describe('isValidAutoOrbit', () => {
  it('accepts booleans and non-zero numeric speeds', () => {
    expect(isValidAutoOrbit(true)).toBe(true)
    expect(isValidAutoOrbit(false)).toBe(true)
    expect(isValidAutoOrbit({ degreesPerSecond: -5 })).toBe(true)
  })
  it('rejects other values', () => {
    for (const v of ['yes', 1, null, {}, { degreesPerSecond: 0 }, { degreesPerSecond: '18' }, { degreesPerSecond: Infinity }]) {
      expect(isValidAutoOrbit(v)).toBe(false)
    }
  })
})
