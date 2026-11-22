import type { ModelViewerElement } from '@google/model-viewer'
import { viewpointCamera, type Viewpoint } from '../viewpoints'

/** Field of view inside a Viewpoint; SketchUp does not export one. */
const VIEWPOINT_FOV = '45deg'
/** Look up/down limit: polar angle range (90° is level), widened if a Scene itself looks steeper. */
const MIN_PHI = Math.PI / 6
const MAX_PHI = (5 * Math.PI) / 6

/**
 * Camera settings we change in a Viewpoint and put back on leaving. Field of view settings are restored
 * first, in their own update: model-viewer derives the 'auto' maximum radius from the field of view
 * when the orbit limits are re-applied.
 */
const FOV_SAVED = ['fieldOfView', 'minFieldOfView', 'maxFieldOfView'] as const
const SAVED = [...FOV_SAVED, 'minCameraOrbit', 'maxCameraOrbit', 'orbitSensitivity', 'disablePan', 'disableZoom', 'disableTap', 'interactionPrompt'] as const
type Saved = Pick<ModelViewerElement, (typeof SAVED)[number]>

// model-viewer's value parser misreads numbers with many decimals (0.5235987755982988 → 7755982988),
// so every camera value is written with a fixed, short precision.
const n = (v: number, digits = 5) => (Number.isFinite(v) ? v.toFixed(digits) : String(v))

export interface ViewpointMode {
  /** Leaves the current Viewpoint, restoring free camera controls. Resolves once they are applied. */
  exit(): Promise<void>
}

/**
 * Viewpoints: a drawer listing the Model's saved Scenes; choosing one cuts the camera to the eye and
 * allows looking around only (ADR 0004: orbit a pivot just ahead of the eye at a tiny radius).
 */
export function setupViewpoints(el: ModelViewerElement, viewpoints: Viewpoint[], hooks: { onEnter(): void }): ViewpointMode {
  const btn = document.getElementById('viewpoints-btn') as HTMLButtonElement
  const drawer = document.getElementById('viewpoints') as HTMLElement
  const list = document.getElementById('viewpoints-list') as HTMLUListElement
  const closeBtn = document.getElementById('viewpoints-close') as HTMLButtonElement

  let saved: Saved | undefined
  let current: number | undefined
  let nudge = false

  const rows = viewpoints.map((vp, i) => {
    const li = document.createElement('li')
    const row = document.createElement('button')
    row.type = 'button'
    row.className = 'viewpoint-row'
    row.textContent = vp.name
    row.setAttribute('aria-pressed', 'false')
    row.addEventListener('click', () => {
      enter(i)
      close()
    })
    li.appendChild(row)
    list.appendChild(li)
    return row
  })

  const markCurrent = () => rows.forEach((r, i) => r.setAttribute('aria-pressed', String(i === current)))

  function enter(i: number) {
    if (!saved) {
      saved = {} as Saved
      for (const k of SAVED) (saved as Record<string, unknown>)[k] = el[k]
    }
    const { target, theta, phi, radius } = viewpointCamera(viewpoints[i])
    // model-viewer ignores a goal equal to the last one it was given, even if the visitor has since
    // looked around, so alternate by an imperceptible radius nudge to guarantee a new goal.
    nudge = !nudge
    const r = radius * (nudge ? 1 : 1 + 1e-6)
    const minPhi = Math.min(MIN_PHI, phi)
    const maxPhi = Math.max(MAX_PHI, phi)
    el.minCameraOrbit = `-Infinity ${n(minPhi)}rad ${n(r, 8)}m`
    el.maxCameraOrbit = `Infinity ${n(maxPhi)}rad ${n(r, 8)}m`
    // Negative: dragging moves the scene with the finger, as in Street View.
    el.minFieldOfView = VIEWPOINT_FOV
    el.maxFieldOfView = VIEWPOINT_FOV
    el.orbitSensitivity = -1
    el.disablePan = true
    el.disableZoom = true
    el.disableTap = true
    el.interactionPrompt = 'none'
    el.cameraTarget = `${n(target[0])}m ${n(target[1])}m ${n(target[2])}m`
    el.cameraOrbit = `${n(theta)}rad ${n(phi)}rad ${n(r, 8)}m`
    el.fieldOfView = VIEWPOINT_FOV
    el.jumpCameraToGoal()
    current = i
    markCurrent()
    hooks.onEnter()
  }

  async function exit() {
    if (!saved) return
    const { fieldOfView, minFieldOfView, maxFieldOfView, ...rest } = saved
    saved = undefined
    current = undefined
    markCurrent()
    Object.assign(el, { fieldOfView, minFieldOfView, maxFieldOfView })
    await el.updateComplete
    Object.assign(el, rest)
    await el.updateComplete
  }

  function open() {
    drawer.hidden = false
    // Next frame so the slide-in transition runs from the hidden position.
    requestAnimationFrame(() => drawer.classList.add('open'))
    btn.setAttribute('aria-expanded', 'true')
    ;(rows[current ?? 0] ?? closeBtn).focus()
  }
  function close() {
    drawer.classList.remove('open')
    drawer.hidden = true
    btn.setAttribute('aria-expanded', 'false')
  }

  if (viewpoints.length) {
    btn.hidden = false
    btn.addEventListener('click', () => (drawer.hidden ? open() : close()))
    closeBtn.addEventListener('click', () => {
      close()
      btn.focus()
    })
    // Non-modal, so Escape works wherever focus is (but leaves an open Info dialog to handle its own).
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || drawer.hidden || document.querySelector('dialog[open]')) return
      e.preventDefault()
      close()
      btn.focus()
    })
  }

  return { exit }
}
