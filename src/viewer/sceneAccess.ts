/**
 * The only code that reaches into <model-viewer>'s internals (ADR 0003): its three.js scene, held
 * under a private `Symbol('scene')`. Everything is shape-checked so a library upgrade that changes
 * the internals fails here with a clear error instead of breaking the page.
 */
import type { Box, Vec3 } from '../explode'

/** The parts of a three.js Object3D we use. */
export interface SceneObject {
  name: string
  visible: boolean
  children: SceneObject[]
}

/** three.js Object3D and Vector3/Box3 members used for Explode. Classes are borrowed from existing objects. */
interface V3 { x: number; y: number; z: number; set(x: number, y: number, z: number): V3; clone(): V3; sub(v: V3): V3 }
interface Node3D extends SceneObject {
  isMesh?: boolean
  parent: Node3D | null
  children: Node3D[]
  position: V3
  getWorldPosition(target: V3): V3
  worldToLocal(v: V3): V3
  updateMatrixWorld(force?: boolean): void
  traverse(fn: (o: Node3D) => void): void
}
interface Box3 { min: V3; max: V3; setFromObject(o: Node3D): Box3 }

interface InternalScene extends SceneObject {
  traverse(fn: (o: SceneObject) => void): void
  queueRender(): void
  updateShadow?(): void
  model?: Node3D | null
  boundingBox?: Box3
}

/** A movable part of the loaded Model, for Explode. Positions are in its parent's space. */
export interface ScenePart {
  readonly node: SceneObject
  /** Position when the Model loaded. */
  readonly rest: Vec3
  /** World-space bounding box now. */
  bounds(): Box
  /** Local-space move per world unit along a world direction. */
  localStep(dir: Vec3): Vec3
  setPosition(p: Vec3): void
  /** Children with geometry, as parts. */
  readonly inner: ScenePart[]
}

export interface SceneAccess {
  /**
   * The objects for the given (three.js-sanitised) names, found among the children of a single
   * container: the shallowest object holding every one of them. Missing names map to undefined.
   */
  findTopLevelGroups(names: string[]): Map<string, SceneObject | undefined>
  /**
   * The Model's top-level groups as movable parts: below the root, descend through single-child
   * wrappers; the children with geometry at the first wider level (empty Viewpoint nodes are skipped).
   */
  topLevelParts(): ScenePart[]
  /** Redraw after visibility changes, refreshing the ground shadow too. */
  requestRender(): void
  /** Redraw only (cheap; for continuous moves such as the Explode slider). */
  queueRender(): void
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
    topLevelParts() {
      const model = scene.model
      if (!model || typeof model.updateMatrixWorld !== 'function' || !scene.boundingBox) {
        throw new Error('model-viewer internals changed: no model or bounding box on the scene')
      }
      const Box3 = scene.boundingBox.constructor as new () => Box3
      const Vector3 = model.position.constructor as new () => V3
      const tuple = (v: V3): Vec3 => [v.x, v.y, v.z]
      const hasGeometry = (n: Node3D) => {
        let found = false
        n.traverse((c) => (found ||= !!c.isMesh))
        return found
      }
      const toPart = (node: Node3D): ScenePart => ({
        node,
        rest: tuple(node.position),
        bounds() {
          model.updateMatrixWorld(true)
          const b = new Box3().setFromObject(node)
          return { min: tuple(b.min), max: tuple(b.max) }
        },
        localStep(dir) {
          model.updateMatrixWorld(true)
          const world = node.getWorldPosition(new Vector3())
          const moved = world.clone()
          moved.set(world.x + dir[0], world.y + dir[1], world.z + dir[2])
          return tuple(node.parent!.worldToLocal(moved).sub(node.parent!.worldToLocal(world.clone())))
        },
        setPosition(p) {
          node.position.set(...p)
        },
        inner: node.children.filter(hasGeometry).map(toPart),
      })
      let node = model
      while (node.children.length === 1) node = node.children[0]
      // As for Layers: a lone group wrapping the whole Model is unwrapped, so its sections are the parts.
      let parts = node.children.filter(hasGeometry)
      while (parts.length === 1 && parts[0].children.filter(hasGeometry).length > 1) parts = parts[0].children.filter(hasGeometry)
      return parts.map(toPart)
    },
    requestRender() {
      scene.updateShadow?.()
      scene.queueRender()
    },
    queueRender() {
      scene.queueRender()
    },
  }
}
