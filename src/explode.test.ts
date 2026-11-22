import { describe, expect, it } from 'vitest'
import { directionFrom, explodeDistances, explodeSpikeEnabled, offsetPosition } from './explode'

describe('explodeSpikeEnabled', () => {
  it('needs the stairs and the flag', () => {
    expect(explodeSpikeEnabled('stairs', '?explode')).toBe(true)
    expect(explodeSpikeEnabled('stairs', '')).toBe(false)
    expect(explodeSpikeEnabled('bastings-garden', '?explode')).toBe(false)
  })
})

describe('directionFrom', () => {
  it('is a unit vector away from the origin', () => expect(directionFrom([3, 4, 0], [0, 0, 0])).toEqual([0.6, 0.8, 0]))
  it('points up when the part sits on the centre', () => expect(directionFrom([1, 1, 1], [1, 1, 1])).toEqual([0, 1, 0]))
})

describe('explodeDistances', () => {
  it('is zero when assembled', () => {
    expect(explodeDistances(0, 'groups', 10)).toEqual({ group: 0, sub: 0 })
    expect(explodeDistances(0, 'nested', 10)).toEqual({ group: 0, sub: 0 })
  })
  it('groups mode scales linearly and never moves inner groups', () => {
    expect(explodeDistances(0.5, 'groups', 10)).toEqual({ group: 3.75, sub: 0 })
    expect(explodeDistances(1, 'groups', 10)).toEqual({ group: 7.5, sub: 0 })
  })
  it('nested mode moves groups first, then inner groups', () => {
    expect(explodeDistances(0.25, 'nested', 10)).toEqual({ group: 3.75, sub: 0 })
    expect(explodeDistances(0.5, 'nested', 10)).toEqual({ group: 7.5, sub: 0 })
    const full = explodeDistances(1, 'nested', 10)
    expect(full.group).toBe(7.5)
    expect(full.sub).toBeCloseTo(3.5)
  })
  it('clamps t', () => expect(explodeDistances(2, 'groups', 10).group).toBe(7.5))
})

describe('offsetPosition', () => {
  it('restores the rest position at zero', () => expect(offsetPosition([1, 2, 3], [0.5, 0, -1], 0)).toEqual([1, 2, 3]))
  it('moves along the step', () => expect(offsetPosition([1, 2, 3], [0.5, 0, -1], 2)).toEqual([2, 2, 1]))
})
