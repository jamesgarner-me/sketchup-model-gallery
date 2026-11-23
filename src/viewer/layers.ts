import type { ModelViewerElement } from '@google/model-viewer'
import { resolveLayers, sanitizeNodeName, type LayerSetting } from '../layers'
import { getSceneAccess, type SceneObject } from './sceneAccess'

/** Fired on document when a side panel opens, so the other one closes (one at a time). */
export const PANEL_OPEN_EVENT = 'viewer-panel-open'
/** Fired on the <model-viewer> element after Layers change what is visible (including on load). */
export const LAYERS_CHANGE_EVENT = 'layers-change'

/**
 * Layers: a non-modal panel of checkboxes showing and hiding the Model's top-level SketchUp groups
 * (ADR 0003). Visibility starts at the Catalog defaults on every load and is never kept in the URL;
 * it does not touch the camera or Auto-orbit.
 */
export function setupLayers(el: ModelViewerElement, settings: LayerSetting[] | undefined): { restoreDefaults(): void } {
  const layers = resolveLayers(settings)
  if (!layers.length) return { restoreDefaults() {} }

  const btn = document.getElementById('layers-btn') as HTMLButtonElement
  const panel = document.getElementById('layers') as HTMLElement
  const list = document.getElementById('layers-list') as HTMLUListElement
  const closeBtn = document.getElementById('layers-close') as HTMLButtonElement
  const restoreBtn = document.getElementById('layers-restore') as HTMLButtonElement

  let groups: (SceneObject | undefined)[] = []
  let render = () => {}

  const boxes = layers.map((layer, i) => {
    const li = document.createElement('li')
    const label = document.createElement('label')
    label.className = 'layer-row'
    const box = document.createElement('input')
    box.type = 'checkbox'
    box.checked = layer.visible
    box.addEventListener('change', () => setVisible(i, box.checked))
    const text = document.createElement('span')
    text.textContent = layer.label
    label.append(box, text)
    li.appendChild(label)
    list.appendChild(li)
    return box
  })

  function setVisible(i: number, visible: boolean) {
    boxes[i].checked = visible
    const g = groups[i]
    if (g) g.visible = visible
  }
  const changed = () => {
    render()
    el.dispatchEvent(new CustomEvent(LAYERS_CHANGE_EVENT))
  }
  function applyDefaults() {
    layers.forEach((l, i) => setVisible(i, l.visible))
    changed()
  }

  el.addEventListener('load', () => {
    try {
      const access = getSceneAccess(el)
      const names = layers.map((l) => sanitizeNodeName(l.group))
      const found = access.findTopLevelGroups(names)
      const missing = layers.filter((_, i) => !found.get(names[i])).map((l) => l.group)
      if (missing.length) throw new Error(`Layer groups not found in the loaded Model: ${missing.join(', ')}`)
      groups = names.map((n) => found.get(n))
      render = () => access.requestRender()
      applyDefaults()
      btn.hidden = false
    } catch (err) {
      // The Model still works; only the Layers control is withdrawn.
      console.error('[Layers]', err)
      groups = []
      close()
      btn.hidden = true
    }
  })

  list.addEventListener('change', changed)
  restoreBtn.addEventListener('click', applyDefaults)

  // On narrow screens the panel is a bottom sheet: shrink the 3D view to the area above it so the
  // Model is framed where it can be seen (model-viewer re-fits to its new size; the orbit is unchanged).
  const stage = document.getElementById('stage') as HTMLElement
  const narrow = window.matchMedia('(max-width: 639px)')
  function fitStage() {
    // offsetTop ignores the slide-in transform, so this is the sheet's resting position.
    if (panel.hidden || !narrow.matches) stage.style.removeProperty('height')
    else stage.style.height = `${panel.offsetTop}px`
  }
  // The sheet sits above the whole controls area (which can include more than one row), measured live.
  const controls = document.getElementById('controls') as HTMLElement
  new ResizeObserver(() => {
    panel.style.setProperty('--controls-h', `${controls.offsetHeight}px`)
    fitStage()
  }).observe(controls)
  new ResizeObserver(fitStage).observe(panel)
  narrow.addEventListener('change', fitStage)
  window.addEventListener('resize', fitStage)

  function open() {
    document.dispatchEvent(new CustomEvent(PANEL_OPEN_EVENT, { detail: 'layers' }))
    panel.hidden = false
    fitStage()
    // Next frame so the slide-in transition runs from the hidden position.
    requestAnimationFrame(() => panel.classList.add('open'))
    btn.setAttribute('aria-expanded', 'true')
    boxes[0]?.focus()
  }
  function close() {
    panel.classList.remove('open')
    panel.hidden = true
    btn.setAttribute('aria-expanded', 'false')
    fitStage()
  }

  btn.addEventListener('click', () => (panel.hidden ? open() : close()))
  closeBtn.addEventListener('click', () => {
    close()
    btn.focus()
  })
  document.addEventListener(PANEL_OPEN_EVENT, (e) => {
    if ((e as CustomEvent<string>).detail !== 'layers') close()
  })
  // Non-modal, so Escape works wherever focus is (but leaves an open Info dialog to handle its own).
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || panel.hidden || document.querySelector('dialog[open]')) return
    e.preventDefault()
    close()
    btn.focus()
  })
  // Reset view restores the starting Layers (no-op until the Model has loaded).
  return { restoreDefaults: () => groups.length && applyDefaults() }
}
