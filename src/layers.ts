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
 */
export function extractTopLevelGroups(gltf: GltfJson): string[] {
  const nodes = gltf.nodes ?? []
  let level = gltf.scenes?.[gltf.scene ?? 0]?.nodes ?? []
  while (level.length === 1 && nodes[level[0]]?.children?.length) level = nodes[level[0]].children!
  return level.map((i) => nodes[i]).filter((n) => n?.name && (n.children?.length || n.mesh !== undefined)).map((n) => n!.name!)
}
