import { describe, expect, it } from 'vitest'
import { directionFrom, explodeDistances, explodePlan, explodeSpikeEnabled, offsetPosition, type Box, type Vec3 } from './explode'

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

const box = (min: Vec3, max: Vec3): Box => ({ min, max })

describe('explodePlan', () => {
  const left = { visible: true, box: box([-3, 0, 0], [-1, 2, 0]), inner: [box([-3, 0, 0], [-2, 1, 0]), box([-2, 1, 0], [-1, 2, 0])] }
  const right = { visible: true, box: box([1, 0, 0], [3, 2, 0]), inner: [box([1, 0, 0], [3, 2, 0])] }
  const far = { visible: false, box: box([100, 0, 0], [102, 2, 0]), inner: [] }

  it('moves only visible groups, around the centre of what is visible', () => {
    const plan = explodePlan([left, right, far])
    expect(plan.single).toBe(false)
    expect(plan.radius).toBeCloseTo(Math.hypot(6, 2) / 2)
    const groups = plan.moves.filter((m) => m.level === 'group')
    expect(groups.map((m) => m.group)).toEqual([0, 1])
    expect(groups[0].dir).toEqual([-1, 0, 0])
    expect(groups[1].dir).toEqual([1, 0, 0])
    expect(plan.moves.some((m) => m.group === 2)).toBe(false)
  })
  it('spreads inner groups only where there are at least two', () => {
    const subs = explodePlan([left, right]).moves.filter((m) => m.level === 'sub')
    expect(subs.map((m) => [m.group, m.inner])).toEqual([[0, 0], [0, 1]])
  })
  it('a hidden group changes the centre the others spread from', () => {
    const third = { visible: true, box: box([7, 0, 0], [9, 2, 0]), inner: [] }
    const withThird = explodePlan([left, right, third]).moves.find((m) => m.group === 1)!
    expect(withThird.dir[0]).toBeLessThan(0)
    const hidden = explodePlan([left, right, { ...third, visible: false }]).moves.find((m) => m.group === 1)!
    expect(hidden.dir[0]).toBeGreaterThan(0)
  })
  it('a single visible group spreads its inner groups around its own centre', () => {
    const plan = explodePlan([left, { ...right, visible: false }])
    expect(plan.single).toBe(true)
    expect(plan.radius).toBeCloseTo(Math.hypot(2, 2) / 2)
    expect(plan.moves.map((m) => [m.group, m.inner, m.level])).toEqual([[0, 0, 'group'], [0, 1, 'group']])
  })
  it('nothing moves when nothing is visible, or a lone group has one inner group', () => {
    expect(explodePlan([{ ...left, visible: false }]).moves).toEqual([])
    expect(explodePlan([right]).moves).toEqual([])
  })
})
