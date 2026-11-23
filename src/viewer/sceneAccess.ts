/**
 * The only code that reaches into <model-viewer>'s internals (ADR 0003): its three.js scene, held
 * under a private `Symbol('scene')`. Everything is shape-checked so a library upgrade that changes
 * the internals fails here with a clear error instead of breaking the page.
 */

/** The parts of a three.js Object3D we use. */
export interface SceneObject {
  name: string
  visible: boolean
  children: SceneObject[]
}

interface InternalScene extends SceneObject {
  traverse(fn: (o: SceneObject) => void): void
  queueRender(): void
  updateShadow?(): void
}

export interface SceneAccess {
  /**
   * The objects for the given (three.js-sanitised) names, found among the children of a single
   * container: the shallowest object holding every one of them. Missing names map to undefined.
   */
  findTopLevelGroups(names: string[]): Map<string, SceneObject | undefined>
  /** Redraw after visibility changes, refreshing the ground shadow too. */
  requestRender(): void
}

export function getSceneAccess(el: HTMLElement): SceneAccess {
  const sym = Object.getOwnPropertySymbols(el).find((s) => s.description === 'scene')
  if (!sym) throw new Error('model-viewer internals changed: no scene symbol')
  const scene = (el as unknown as Record<symbol, unknown>)[sym] as InternalScene | undefined
  if (!scene || !Array.isArray(scene.children) || typeof scene.traverse !== 'function' || typeof scene.queueRender !== 'function') {
    throw new Error('model-viewer internals changed: scene is not a three.js scene')
  }

  return {
    findTopLevelGroups(names) {
      const result = new Map<string, SceneObject | undefined>(names.map((n) => [n, undefined]))
      // Breadth-first so the shallowest container wins over any same-named nodes deeper down.
      const queue: SceneObject[] = [scene]
      while (queue.length) {
        const o = queue.shift()!
        const byName = new Map(o.children.map((c) => [c.name, c]))
        if (names.some((n) => byName.has(n))) {
          for (const n of names) result.set(n, byName.get(n))
          return result
        }
        queue.push(...o.children)
      }
      return result
    },
    requestRender() {
      scene.updateShadow?.()
      scene.queueRender()
    },
  }
}
