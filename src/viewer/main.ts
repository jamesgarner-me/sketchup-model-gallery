import '@google/model-viewer'
import type { ModelViewerElement } from '@google/model-viewer'
import { findModel, type CatalogEntry } from '../catalog'
import { siteName } from '../config'
import { getNotesHtml } from '../notes'
import { getStage } from '../stages'
import { resolveAutoOrbit } from '../autoOrbit'
import { parseModelId } from './path'
import '../base.css'
import './viewer.css'

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T

const stage = $('stage')
const loading = $('loading')
const loadingFill = $('loading-fill')
const errorBox = $('error')
const notFoundBox = $('notfound')
const controls = $('controls')
const titleEl = $('title')
const resetBtn = $<HTMLButtonElement>('reset')
const infoBtn = $<HTMLButtonElement>('info-btn')
const infoDialog = $<HTMLDialogElement>('info')
const infoClose = $<HTMLButtonElement>('info-close')
const retryBtn = $<HTMLButtonElement>('retry')

/** Full-model framing captured once per page load (or taken from the catalog). */
interface Framing { orbit: [number, number, number]; target: [number, number, number]; fov: number }

const RESET_FALLBACK_MS = 600

function showNotFound() {
  document.title = 'Model not found'
  titleEl.textContent = ''
  loading.hidden = true
  controls.hidden = true
  notFoundBox.hidden = false
}

function start(entry: CatalogEntry) {
  document.title = `${entry.title} · ${siteName}`
  titleEl.textContent = entry.title

  const el = document.createElement('model-viewer') as ModelViewerElement
  el.setAttribute('alt', entry.title)
  el.setAttribute('camera-controls', '')
  el.setAttribute('touch-action', 'none')

  // Stage: background, lighting and control theme for this Model.
  const preset = getStage(entry.stage)
  const viewerEl = document.querySelector<HTMLElement>('.viewer')!
  viewerEl.dataset.stage = entry.stage ?? 'neutral'
  viewerEl.dataset.theme = preset.theme
  el.setAttribute('exposure', String(preset.exposure))
  el.setAttribute('shadow-intensity', String(preset.shadowIntensity))
  el.setAttribute('shadow-softness', String(preset.shadowSoftness))
  el.setAttribute('tone-mapping', preset.toneMapping)
  if (preset.environmentImage) el.setAttribute('environment-image', preset.environmentImage)
  if (entry.camera?.orbit) el.setAttribute('camera-orbit', entry.camera.orbit)
  if (entry.camera?.target) el.setAttribute('camera-target', entry.camera.target)
  if (entry.camera?.fieldOfView) el.setAttribute('field-of-view', entry.camera.fieldOfView)

  // Auto-orbit: slow turntable rotation from load until the visitor first takes control.
  const orbitSpeed = resolveAutoOrbit(entry.autoOrbit, window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  let orbitStopped = orbitSpeed === undefined
  if (orbitSpeed !== undefined) {
    el.setAttribute('auto-rotate', '')
    el.setAttribute('rotation-per-second', `${orbitSpeed}deg`)
    // Start straight away; we switch auto-rotate off ourselves on first interaction, so the
    // library's resume-after-delay never applies.
    el.setAttribute('auto-rotate-delay', '0')
    el.setAttribute('interaction-prompt', 'none')
  }
  const stopOrbit = () => {
    orbitStopped = true
    el.autoRotate = false
  }
  el.addEventListener('camera-change', (e) => {
    if (!orbitStopped && (e as CustomEvent<{ source: string }>).detail.source === 'user-interaction') stopOrbit()
  })

  let framing: Framing | undefined
  let flip = false
  let jumpTimer: number | undefined

  const setProgress = (p: number) => {
    const pct = Math.round(p * 100)
    loadingFill.style.width = `${pct}%`
    loading.setAttribute('aria-valuenow', String(pct))
  }

  el.addEventListener('progress', (e) => setProgress((e as unknown as CustomEvent<{ totalProgress: number }>).detail.totalProgress))

  el.addEventListener('load', () => {
    const o = el.getCameraOrbit()
    const t = el.getCameraTarget()
    framing = { orbit: [o.theta, o.phi, o.radius], target: [t.x, t.y, t.z], fov: el.getFieldOfView() }
    loading.hidden = true
    errorBox.hidden = true
  })

  el.addEventListener('error', () => {
    loading.hidden = true
    errorBox.hidden = false
  })

  const load = (src: string) => {
    errorBox.hidden = true
    loading.hidden = false
    setProgress(0)
    el.setAttribute('src', src)
  }

  retryBtn.addEventListener('click', () => load(`${entry.glb}?retry=${Date.now()}`))

  resetBtn.addEventListener('click', () => {
    if (!framing) return
    if (orbitSpeed !== undefined) {
      stopOrbit()
      el.resetTurntableRotation()
    }
    const { orbit, target, fov } = framing
    // model-viewer ignores a goal equal to the last one it was given even if the user has since
    // moved the camera, so alternate by an imperceptible radius nudge to guarantee a new goal.
    flip = !flip
    const radius = orbit[2] * (flip ? 1 : 1 + 1e-6)
    el.cameraOrbit = `${orbit[0]}rad ${orbit[1]}rad ${radius}m`
    el.cameraTarget = `${target[0]}m ${target[1]}m ${target[2]}m`
    el.fieldOfView = `${fov}deg`
    window.clearTimeout(jumpTimer)
    jumpTimer = window.setTimeout(() => el.jumpCameraToGoal(), RESET_FALLBACK_MS)
  })

  stage.appendChild(el)
  load(entry.glb)
  setupInfo(entry, {
    onOpen: () => {
      if (!orbitStopped) el.autoRotate = false
    },
    onClose: () => {
      if (!orbitStopped) el.autoRotate = true
    },
  })
}

/**
 * Info overlay: a native modal <dialog> (focus trap, inert background, focus restore, Escape).
 * The viewer stays mounted underneath, so camera state is preserved. Opening pushes a history
 * entry so Back closes the overlay first; every close path goes through history.back().
 */
function setupInfo(entry: CatalogEntry, hooks: { onOpen(): void; onClose(): void }) {
  $('info-title').textContent = entry.title
  $('info-desc').textContent = entry.description
  const notesEl = $('info-notes')
  const notes = getNotesHtml(entry)
  if (notes) {
    notesEl.innerHTML = notes
    notesEl.hidden = false
  }

  let owned = false // true while the top history entry belongs to the open overlay

  const open = () => {
    if (!infoDialog.open) {
      infoDialog.showModal()
      hooks.onOpen()
    }
    infoDialog.querySelector('.info-scroll')!.scrollTop = 0
  }
  infoBtn.addEventListener('click', () => {
    open()
    history.pushState({ info: true }, '')
    owned = true
  })
  const requestClose = () => {
    if (owned) history.back()
    else infoDialog.close()
  }
  infoDialog.addEventListener('close', () => hooks.onClose())
  infoClose.addEventListener('click', requestClose)
  infoDialog.addEventListener('cancel', (e) => {
    e.preventDefault()
    requestClose()
  })
  window.addEventListener('popstate', (e) => {
    if ((e.state as { info?: boolean } | null)?.info) {
      open()
      owned = true
    } else if (infoDialog.open) {
      owned = false
      infoDialog.close()
    }
  })
}

const id = parseModelId(location.pathname)
const entry = id ? findModel(id) : undefined
if (entry) start(entry)
else showNotFound()
