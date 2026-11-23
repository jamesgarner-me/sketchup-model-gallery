import type { ModelViewerElement } from '@google/model-viewer'
import { explodeDistances, explodePlan, offsetPosition, type ExplodeMode, type Vec3 } from '../explode'
import { LAYERS_CHANGE_EVENT } from './layers'
import { getSceneAccess, type SceneAccess, type ScenePart } from './sceneAccess'

/** A part placed by the current plan: how far it moves per world unit along its direction, and at which level. */
interface Placed { part: ScenePart; step: Vec3; level: 'group' | 'sub' }

/**
 * Explode: shows the slider and moves the Model's visible top-level groups apart.
 * Scene access goes through sceneAccess (ADR 0003). The plan (which parts move, which way) is rebuilt
 * whenever Layers change visibility; the slider only scales it.
 */
export function setupExplode(el: ModelViewerElement): { reset(): void } {
  const row = document.getElementById('explode') as HTMLElement
  const slider = document.getElementById('explode-slider') as HTMLInputElement

  // Nested only: the Groups/Nested toggle is switched off (see model.html). Groups mode stays in the maths.
  const mode: ExplodeMode = 'nested'
  let access: SceneAccess | undefined
  let groups: ScenePart[] = []
  let all: ScenePart[] = []
  let placed: Placed[] = []
  let radius = 0
  let single = false

  /** Put everything back at rest, then work out which visible parts move which way. */
  const replan = () => {
    for (const p of all) p.setPosition(p.rest)
    const plan = explodePlan(groups.map((g) => ({ visible: g.node.visible, box: g.bounds(), inner: g.inner.map((i) => i.bounds()) })))
    radius = plan.radius
    single = plan.single
    placed = plan.moves.map((m) => {
      const part = m.inner === undefined ? groups[m.group] : groups[m.group].inner[m.inner]
      return { part, step: part.localStep(m.dir), level: m.level }
    })
  }

  const apply = () => {
    if (!access) return
    const t = Number(slider.value) / Number(slider.max)
    // A single visible group has no further level, so Nested behaves like Groups.
    const { group, sub } = explodeDistances(t, single ? 'groups' : mode, radius)
    for (const p of placed) p.part.setPosition(offsetPosition(p.part.rest, p.step, p.level === 'group' ? group : sub))
    access.queueRender()
  }

  el.addEventListener('load', () => {
    try {
      access = getSceneAccess(el)
      groups = access.topLevelParts()
      all = groups.flatMap((g) => [g, ...g.inner])
      replan()
      row.hidden = false
      apply()
    } catch (err) {
      console.error('[Explode]', err)
      access = undefined
      row.hidden = true
    }
  })
  el.addEventListener(LAYERS_CHANGE_EVENT, () => {
    if (!access) return
    replan()
    apply()
    access.requestRender()
  })
  slider.addEventListener('input', apply)
  // Mode toggle switched off (Nested only):
  // const modeBtn = document.getElementById('explode-mode') as HTMLButtonElement
  // modeBtn.addEventListener('click', () => {
  //   mode = mode === 'groups' ? 'nested' : 'groups'
  //   modeBtn.textContent = mode === 'groups' ? 'Groups' : 'Nested'
  //   modeBtn.setAttribute('aria-label', `Explode mode: ${modeBtn.textContent}. Switch mode`)
  //   apply()
  // })
  return {
    /** Reset view: reassemble (slider back to the far left). */
    reset() {
      slider.value = '0'
      apply()
    },
  }
}
