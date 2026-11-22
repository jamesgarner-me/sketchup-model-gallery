/** Explode spike: pure maths. See openspec/changes/explode-spike/design.md. */

export type Vec3 = [number, number, number]
export type ExplodeMode = 'groups' | 'nested'

/** Models the spike is enabled on, with the `?explode` URL flag. */
export const EXPLODE_SPIKE_MODELS = ['stairs']
/** Top-level reach at full slider, as a fraction of the Model's bounding radius. */
export const GROUP_REACH = 0.75
/** Nested mode: extra reach of the groups inside each top-level group. */
export const SUB_REACH = 0.35

export const explodeSpikeEnabled = (modelId: string, search: string) =>
  EXPLODE_SPIKE_MODELS.includes(modelId) && new URLSearchParams(search).has('explode')

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
