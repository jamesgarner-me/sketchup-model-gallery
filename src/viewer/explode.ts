import type { ModelViewerElement } from '@google/model-viewer'
import { directionFrom, explodeDistances, offsetPosition, type ExplodeMode, type Vec3 } from '../explode'

/*
 * Explode spike: moves groups in <model-viewer>'s internal three.js scene (ADR 0003: library internals,
 * isolated here). three.js classes are borrowed from existing objects so a second copy of three.js is
 * never bundled; these minimal types describe only what is used.
 */
interface V3 { x: number; y: number; z: number; set(x: number, y: number, z: number): V3; clone(): V3; add(v: V3): V3; sub(v: V3): V3; multiplyScalar(s: number): V3 }
interface Node3D {
  name: string
  isMesh?: boolean
  parent: Node3D | null
  children: Node3D[]
  position: V3
  getWorldPosition(target: V3): V3
  worldToLocal(v: V3): V3
  updateMatrixWorld(force?: boolean): void
  traverse(cb: (n: Node3D) => void): void
}
interface Box { setFromObject(o: Node3D): Box; getCenter(t: V3): V3; getSize(t: V3): V3; isEmpty(): boolean }
interface ModelScene { model: Node3D | null; boundingBox: Box; queueRender(): void }

/** One movable group: where it rests (parent space) and how far it moves per world unit outwards. */
interface Part { node: Node3D; rest: Vec3; step: Vec3; level: 'group' | 'sub' }

const tuple = (v: V3): Vec3 => [v.x, v.y, v.z]
const hasGeometry = (n: Node3D) => {
  let found = false
  n.traverse((c) => (found ||= !!c.isMesh))
  return found
}

function internalScene(el: ModelViewerElement): ModelScene {
  const sym = Object.getOwnPropertySymbols(el).find((s) => s.description === 'scene')
  const scene = sym && (el as unknown as Record<symbol, ModelScene>)[sym]
  if (!scene?.model) throw new Error('Explode spike: <model-viewer> internal scene not found (library internals changed?)')
  return scene
}

/** Top-level groups: children of the first node below the root that branches, keeping only those with geometry. */
function topLevelGroups(model: Node3D): Node3D[] {
  let node = model
  while (node.children.length === 1) node = node.children[0]
  return node.children.filter(hasGeometry)
}

function collectParts(scene: ModelScene): { parts: Part[]; radius: number } {
  const model = scene.model!
  model.updateMatrixWorld(true)
  const Box3 = scene.boundingBox.constructor as new () => Box
  const Vector3 = model.position.constructor as new () => V3
  const centreOf = (n: Node3D) => new Box3().setFromObject(n).getCenter(new Vector3())

  const modelBox = new Box3().setFromObject(model)
  const modelCentre = modelBox.getCenter(new Vector3())
  const size = modelBox.getSize(new Vector3())
  const boundingRadius = Math.hypot(size.x, size.y, size.z) / 2

  const part = (node: Node3D, origin: V3, level: Part['level']): Part => {
    const dir = directionFrom(tuple(centreOf(node)), tuple(origin))
    const world = node.getWorldPosition(new Vector3())
    const moved = world.clone().add(new Vector3().set(...dir))
    // Local-space move per world unit: rotation and scale of the parent are fixed (parents only translate).
    const step = node.parent!.worldToLocal(moved).sub(node.parent!.worldToLocal(world.clone()))
    return { node, rest: tuple(node.position), step: tuple(step), level }
  }

  const parts: Part[] = []
  for (const group of topLevelGroups(model)) {
    parts.push(part(group, modelCentre, 'group'))
    const inner = group.children.filter(hasGeometry)
    // A group holding a single inner group has nothing to spread apart.
    if (inner.length < 2) continue
    const groupCentre = centreOf(group)
    for (const sub of inner) parts.push(part(sub, groupCentre, 'sub'))
  }
  return { parts, radius: boundingRadius }
}

/** Shows the Explode slider and mode toggle, and moves the Model's groups as the slider moves. */
export function setupExplode(el: ModelViewerElement) {
  const row = document.getElementById('explode') as HTMLElement
  const slider = document.getElementById('explode-slider') as HTMLInputElement
  const modeBtn = document.getElementById('explode-mode') as HTMLButtonElement

  let mode: ExplodeMode = 'groups'
  let state: { scene: ModelScene; parts: Part[]; radius: number } | undefined

  const apply = () => {
    if (!state) return
    const t = Number(slider.value) / Number(slider.max)
    const { group, sub } = explodeDistances(t, mode, state.radius)
    for (const p of state.parts) p.node.position.set(...offsetPosition(p.rest, p.step, p.level === 'group' ? group : sub))
    state.scene.queueRender()
  }

  el.addEventListener('load', () => {
    const scene = internalScene(el)
    state = { scene, ...collectParts(scene) }
    row.hidden = false
    apply()
  })
  slider.addEventListener('input', apply)
  modeBtn.addEventListener('click', () => {
    mode = mode === 'groups' ? 'nested' : 'groups'
    modeBtn.textContent = mode === 'groups' ? 'Groups' : 'Nested'
    modeBtn.setAttribute('aria-label', `Explode mode: ${modeBtn.textContent}. Switch mode`)
    apply()
  })
}
