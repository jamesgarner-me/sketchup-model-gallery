/** Explode: pure maths. See openspec/changes/archive/2026-11-23-explode-spike/design.md. */

export type Vec3 = [number, number, number]
export type ExplodeMode = 'groups' | 'nested'

/** Models that show the Explode slider. */
export const EXPLODE_MODELS = ['stairs']
/** Top-level reach at full slider, as a fraction of the Model's bounding radius. */
export const GROUP_REACH = 0.75
/** Nested mode: extra reach of the groups inside each top-level group. */
export const SUB_REACH = 0.35

export const explodeEnabled = (modelId: string) => EXPLODE_MODELS.includes(modelId)

/** Unit direction from `origin` to `point`; straight up when they coincide. */
export function directionFrom(point: Vec3, origin: Vec3): Vec3 {
  const d: Vec3 = [point[0] - origin[0], point[1] - origin[1], point[2] - origin[2]]
  const len = Math.hypot(...d)
  return len < 1e-6 ? [0, 1, 0] : [d[0] / len, d[1] / len, d[2] / len]
}

/**
 * World distances that top-level groups and their inner groups move for slider position t (0–1).
 * Nested mode separates the top-level groups over the first half, then the inner groups over the second.
 */
export function explodeDistances(t: number, mode: ExplodeMode, radius: number): { group: number; sub: number } {
  const c = Math.min(1, Math.max(0, t))
  if (mode === 'groups') return { group: c * GROUP_REACH * radius, sub: 0 }
  return {
    group: Math.min(1, 2 * c) * GROUP_REACH * radius,
    sub: Math.max(0, 2 * c - 1) * SUB_REACH * radius,
  }
}

/** rest + step × distance, where step is the node's local-space move per world unit along its direction. */
export const offsetPosition = (rest: Vec3, step: Vec3, distance: number): Vec3 => [
  rest[0] + step[0] * distance,
  rest[1] + step[1] * distance,
  rest[2] + step[2] * distance,
]

/** Axis-aligned world bounding box. */
export interface Box { min: Vec3; max: Vec3 }

export const boxCentre = (b: Box): Vec3 => [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2]
export const boxRadius = (b: Box) => Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]) / 2
export const unionBox = (boxes: Box[]): Box => ({
  min: [0, 1, 2].map((i) => Math.min(...boxes.map((b) => b.min[i]))) as Vec3,
  max: [0, 1, 2].map((i) => Math.max(...boxes.map((b) => b.max[i]))) as Vec3,
})

/** A top-level group as Explode sees it: shown or not, its bounds, and the bounds of its inner groups. */
export interface GroupInput { visible: boolean; box: Box; inner: Box[] }

/** One part to move: which group (and inner group, if any), its level and its world direction. */
export interface Move { group: number; inner?: number; level: 'group' | 'sub'; dir: Vec3 }

/**
 * Which parts move and where to, given what is visible. Only visible groups explode, around the centre
 * of the visible groups' combined bounds. With a single visible group, its inner groups explode around
 * its own centre instead (in either mode), so `single` tells the caller to use Groups-mode distances.
 * Parts not listed stay at rest. Fewer than two inner groups means nothing to spread apart.
 */
export function explodePlan(groups: GroupInput[]): { radius: number; single: boolean; moves: Move[] } {
  const visible = groups.map((g, i) => ({ ...g, i })).filter((g) => g.visible)
  if (!visible.length) return { radius: 0, single: false, moves: [] }
  const innerMoves = (g: (typeof visible)[number], level: Move['level']): Move[] => {
    if (g.inner.length < 2) return []
    const c = boxCentre(g.box)
    return g.inner.map((b, inner) => ({ group: g.i, inner, level, dir: directionFrom(boxCentre(b), c) }))
  }
  if (visible.length === 1) {
    const g = visible[0]
    return { radius: boxRadius(g.box), single: true, moves: innerMoves(g, 'group') }
  }
  const all = unionBox(visible.map((g) => g.box))
  const c = boxCentre(all)
  const moves: Move[] = []
  for (const g of visible) {
    moves.push({ group: g.i, level: 'group', dir: directionFrom(boxCentre(g.box), c) })
    moves.push(...innerMoves(g, 'sub'))
  }
  return { radius: boxRadius(all), single: false, moves }
}
