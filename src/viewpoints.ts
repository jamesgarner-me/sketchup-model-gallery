/** A saved SketchUp Scene: eye position and unit look direction, in the Model's glTF metres (Y-up). */
export interface Viewpoint {
  name: string
  eye: [number, number, number]
  forward: [number, number, number]
}

type Vec3 = [number, number, number]
type Mat4 = number[] // column-major, as glTF

interface GltfNode {
  name?: string
  mesh?: number
  children?: number[]
  matrix?: number[]
  translation?: number[]
  rotation?: number[]
  scale?: number[]
}
export interface GltfJson {
  scene?: number
  scenes?: { nodes?: number[] }[]
  nodes?: GltfNode[]
}

const ACTIVE_VIEW = 'Active View'

function nodeMatrix(n: GltfNode): Mat4 {
  if (n.matrix) return n.matrix
  const [tx, ty, tz] = n.translation ?? [0, 0, 0]
  const [x, y, z, w] = n.rotation ?? [0, 0, 0, 1]
  const [sx, sy, sz] = n.scale ?? [1, 1, 1]
  return [
    (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + z * w) * sx, 2 * (x * z - y * w) * sx, 0,
    2 * (x * y - z * w) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + x * w) * sy, 0,
    2 * (x * z + y * w) * sz, 2 * (y * z - x * w) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    tx, ty, tz, 1,
  ]
}

function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Array<number>(16)
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]
  return out
}

const IDENTITY: Mat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

function normalise(v: Vec3): Vec3 {
  const l = Math.hypot(...v)
  return l ? [v[0] / l, v[1] / l, v[2] / l] : v
}

/**
 * Viewpoints from a SketchUp GLB's JSON: empty leaf nodes (no mesh, no children) beside the
 * top-level groups, excluding `Active View`, in export (Scene) order. The top-level container is
 * found by descending while there is exactly one node, as for Layers. Wrapper transforms (the
 * exporter's Z-up to Y-up root matrix and unit scale) are applied, so results are glTF world metres.
 */
export function extractViewpoints(gltf: GltfJson): Viewpoint[] {
  const nodes = gltf.nodes ?? []
  let level = gltf.scenes?.[gltf.scene ?? 0]?.nodes ?? []
  let parent = IDENTITY
  while (level.length === 1 && nodes[level[0]]?.children?.length) {
    parent = multiply(parent, nodeMatrix(nodes[level[0]]))
    level = nodes[level[0]].children!
  }
  const out: Viewpoint[] = []
  for (const i of level) {
    const n = nodes[i]
    if (!n?.name || n.name === ACTIVE_VIEW || n.mesh !== undefined || n.children?.length) continue
    const m = multiply(parent, nodeMatrix(n))
    const back: Vec3 = [m[8], m[9], m[10]] // local +Z; the camera looks along −Z
    out.push({
      name: n.name,
      eye: [m[12], m[13], m[14]],
      forward: normalise([-back[0], -back[1], -back[2]]),
    })
  }
  return out
}

/** JSON chunk of a binary glTF (GLB). */
export function readGlbJson(bytes: Uint8Array): GltfJson {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (view.getUint32(0, true) !== 0x46546c67) throw new Error('Not a GLB file')
  const length = view.getUint32(12, true)
  return JSON.parse(new TextDecoder().decode(bytes.subarray(20, 20 + length))) as GltfJson
}

/** Distance from the eye to the orbit pivot while in a Viewpoint (ADR 0004). */
export const VIEWPOINT_RADIUS = 0.01

/**
 * model-viewer camera settings that put the camera at `eye` looking along `forward`: the pivot
 * sits just ahead of the eye and the camera orbits it at a tiny radius.
 */
export function viewpointCamera(vp: Pick<Viewpoint, 'eye' | 'forward'>, radius = VIEWPOINT_RADIUS) {
  const [fx, fy, fz] = normalise(vp.forward)
  const target: Vec3 = [vp.eye[0] + fx * radius, vp.eye[1] + fy * radius, vp.eye[2] + fz * radius]
  // model-viewer places the camera at target + r·(sinφ sinθ, cosφ, sinφ cosθ); that offset is −forward.
  const phi = Math.acos(Math.max(-1, Math.min(1, -fy)))
  const theta = Math.atan2(-fx, -fz)
  return { target, theta, phi, radius }
}
