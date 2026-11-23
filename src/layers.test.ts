import { describe, expect, it } from 'vitest'
import { extractTopLevelGroups, resolveLayers, sanitizeNodeName } from './layers'

describe('extractTopLevelGroups', () => {
  it('unwraps single-node wrappers and lists named groups, skipping empty leaves', () => {
    const gltf = {
      scenes: [{ nodes: [0] }],
      nodes: [
        { children: [1] }, // unnamed root
        { name: 'Assembly-776', children: [2, 3, 4, 5] },
        { name: '01  Street', children: [6] },
        { name: '10  Comparison • toggle', mesh: 0 },
        { name: 'Active View' },
        { name: 'Middle landing' },
        { name: 'part', mesh: 1 },
      ],
    }
    expect(extractTopLevelGroups(gltf)).toEqual(['01  Street', '10  Comparison • toggle'])
  })
  it('handles a scene with several root nodes', () => {
    const gltf = { scenes: [{ nodes: [0, 1] }], nodes: [{ name: 'A', mesh: 0 }, { name: 'B', children: [2] }, { mesh: 1 }] }
    expect(extractTopLevelGroups(gltf)).toEqual(['A', 'B'])
  })
  it('returns nothing for an empty glTF', () => {
    expect(extractTopLevelGroups({})).toEqual([])
  })
})

describe('sanitizeNodeName', () => {
  it('matches three.js: whitespace to _, removes [ ] . : /', () => {
    expect(sanitizeNodeName('01  Street, crossover and driveway')).toBe('01__Street,_crossover_and_driveway')
    expect(sanitizeNodeName('a.b:c/d[e]')).toBe('abcde')
    expect(sanitizeNodeName('11  Roof-loaded 4×4 clearance • toggle')).toBe('11__Roof-loaded_4×4_clearance_•_toggle')
  })
})

describe('resolveLayers', () => {
  it('defaults label to group and visible to true, keeping order', () => {
    expect(resolveLayers([{ group: 'B', visible: false }, { group: 'A', label: 'Alpha' }])).toEqual([
      { group: 'B', label: 'B', visible: false },
      { group: 'A', label: 'Alpha', visible: true },
    ])
  })
  it('treats missing layers as none', () => {
    expect(resolveLayers(undefined)).toEqual([])
  })
})
