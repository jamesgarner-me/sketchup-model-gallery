import { describe, expect, it } from 'vitest'
import { extractViewpoints, readGlbJson, viewpointCamera, type GltfJson } from './viewpoints'

// Shape of a SimLab SketchUp export: unnamed root with a Z-up → Y-up matrix, an Assembly node
// scaling inches to metres, then top-level groups and Scene nodes side by side.
const Z_UP_TO_Y_UP = [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]
// Camera at SketchUp (100, 0, 50) in, looking along SketchUp +Y (horizontal): local −Z = +Y,
// local +Y = +Z, i.e. a 90° rotation about X.
const s = Math.SQRT1_2
const scene = (name: string) => ({ name, translation: [100, 0, 50], rotation: [s, 0, 0, s] })

function fixture(sceneNodes: object[]): GltfJson {
  const top = [{ name: '01 Group', mesh: 0 }, { name: '02 Group', children: [4] }, ...sceneNodes]
  return {
    scenes: [{ nodes: [0] }],
    nodes: [
      { matrix: Z_UP_TO_Y_UP, children: [1] },
      { name: 'Assembly-1', scale: [0.0254, 0.0254, 0.0254], children: top.map((_, i) => 5 + i) },
      {},
      {},
      { name: 'Nested empty' },
      ...top,
    ],
  }
}

const close = (a: number[], b: number[]) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 4))

describe('extractViewpoints', () => {
  it('applies wrapper transforms and returns glTF metres, looking along −Z', () => {
    const [vp] = extractViewpoints(fixture([scene('Street')]))
    expect(vp.name).toBe('Street')
    // SketchUp (x, y, z) → glTF (x, z, −y), inches → metres.
    close(vp.eye, [2.54, 1.27, 0])
    close(vp.forward, [0, 0, -1])
  })

  it('excludes Active View, groups and nested empties, and keeps export order', () => {
    const names = extractViewpoints(fixture([scene('B'), { ...scene('Active View') }, scene('A')])).map((v) => v.name)
    expect(names).toEqual(['B', 'A'])
  })

  it('returns nothing when there are no saved Scenes', () => {
    expect(extractViewpoints(fixture([scene('Active View')]))).toEqual([])
    expect(extractViewpoints({})).toEqual([])
  })
})

describe('readGlbJson', () => {
  it('reads the JSON chunk', () => {
    const json = new TextEncoder().encode(JSON.stringify({ asset: { version: '2.0' } }) + '  ')
    const bytes = new Uint8Array(20 + json.length)
    const v = new DataView(bytes.buffer)
    v.setUint32(0, 0x46546c67, true)
    v.setUint32(12, json.length, true)
    bytes.set(json, 20)
    expect(readGlbJson(bytes)).toEqual({ asset: { version: '2.0' } })
  })

  it('rejects non-GLB data', () => {
    expect(() => readGlbJson(new Uint8Array(20))).toThrow('Not a GLB')
  })
})

describe('viewpointCamera', () => {
  // model-viewer's camera offset from the target for given theta/phi/radius.
  const offset = (theta: number, phi: number, r: number) => [r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.cos(theta)]

  it.each([
    [[0, 0, -1]],
    [[1, 0, 0]],
    [[0.42, 0.04, -0.91]],
    [[-0.34, -0.19, 0.92]],
  ])('puts the camera at the eye looking along %j', (forward) => {
    const eye = [3, 1.6, -2] as [number, number, number]
    const cam = viewpointCamera({ eye, forward: forward as [number, number, number] })
    const o = offset(cam.theta, cam.phi, cam.radius)
    close([cam.target[0] + o[0], cam.target[1] + o[1], cam.target[2] + o[2]], eye)
    const l = Math.hypot(...forward)
    close([(cam.target[0] - eye[0]) / cam.radius, (cam.target[1] - eye[1]) / cam.radius, (cam.target[2] - eye[2]) / cam.radius], forward.map((v) => v / l))
  })

  it('gives a level view phi of 90°', () => {
    expect(viewpointCamera({ eye: [0, 0, 0], forward: [0, 0, -1] }).phi).toBeCloseTo(Math.PI / 2)
  })
})
