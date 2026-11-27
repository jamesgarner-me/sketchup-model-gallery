import type { GltfJson } from './viewpoints'

/** A Catalog Layer: a top-level SketchUp group visitors can show or hide. */
export interface LayerSetting {
  /** Exact group name as exported, e.g. "01  Street, crossover and driveway" (two spaces). */
  group: string
  /** Panel label; defaults to `group`. */
  label?: string
  /** Visibility on load; defaults to true. */
  visible?: boolean
}

export interface ResolvedLayer {
  group: string
  label: string
  visible: boolean
}

export function resolveLayers(layers: LayerSetting[] | undefined): ResolvedLayer[] {
  return (layers ?? []).map((l) => ({ group: l.group, label: l.label ?? l.group, visible: l.visible ?? true }))
}

/**
 * Mirrors three.js `PropertyBinding.sanitizeNodeName`, which its glTF loader applies to node names:
 * whitespace becomes `_` and `[ ] . : /` are removed.
 */
export function sanitizeNodeName(name: string): string {
  return name.replace(/\s/g, '_').replace(/[[\].:/]/g, '')
}

/**
 * Names of a glTF's top-level groups: descend from the scene's root nodes while there is exactly one
 * node (unwrapping wrappers such as the exporter's unnamed root and `Assembly-N`); the named nodes
 * with children at the first wider level are the top-level groups. Empty leaves there are Viewpoints.
 * A lone group there (wrapping the whole Model; geometry-free siblings ignored) is unwrapped too, so its
 * sections are the groups.
 */
export function extractTopLevelGroups(gltf: GltfJson): string[] {
  const nodes = gltf.nodes ?? []
  let level = gltf.scenes?.[gltf.scene ?? 0]?.nodes ?? []
  while (level.length === 1 && nodes[level[0]]?.children?.length) level = nodes[level[0]].children!
  const hasMesh = (i: number): boolean => nodes[i]?.mesh !== undefined || (nodes[i]?.children ?? []).some(hasMesh)
  const groupsAt = (l: number[]) => l.filter((i) => nodes[i]?.name && (nodes[i].children?.length || nodes[i].mesh !== undefined))
  let groups = groupsAt(level)
  // A lone group wrapping the whole Model (e.g. "Final staircase") isn't useful as a Layer: use its sections.
  // Groups with no geometry (e.g. exported section notes) don't count when deciding it is alone.
  const solid = (l: number[]) => l.filter(hasMesh)
  while (solid(groups).length === 1 && groupsAt(nodes[solid(groups)[0]].children ?? []).length > 1) groups = groupsAt(nodes[solid(groups)[0]].children!)
  return groups.map((i) => nodes[i].name!)
}
