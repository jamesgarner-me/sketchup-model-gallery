import { describe, expect, it } from 'vitest'
import { srgbToLinear } from './colour'

describe('srgbToLinear', () => {
  it('keeps the endpoints', () => {
    expect(srgbToLinear(0)).toBe(0)
    expect(srgbToLinear(1)).toBeCloseTo(1, 10)
  })

  it('is continuous at the 0.04045 knee', () => {
    expect(srgbToLinear(0.04045)).toBeCloseTo(0.04045 / 12.92, 10)
    expect(srgbToLinear(0.0405)).toBeCloseTo(0.04045 / 12.92, 5)
  })

  it('darkens SketchUp near-black #2F302D (0.184) to about 0.029', () => {
    expect(srgbToLinear(47 / 255)).toBeCloseTo(0.0284, 3)
  })

  it('maps mid-grey 0.5 to about 0.214', () => {
    expect(srgbToLinear(0.5)).toBeCloseTo(0.214, 3)
  })
})
