import models from './models.json'

export interface CameraSettings {
  /** model-viewer camera-orbit, e.g. "30deg 70deg auto" */
  orbit?: string
  /** model-viewer camera-target, e.g. "auto auto auto" */
  target?: string
  /** model-viewer field-of-view, e.g. "30deg" */
  fieldOfView?: string
}

export interface CatalogEntry {
  id: string
  title: string
  description: string
  /** Public URL path, e.g. /models/stairs.glb */
  glb: string
  /** Public URL path, e.g. /thumbnails/stairs.webp */
  thumbnail: string
  order: number
  /** Notes filename inside src/content (optional; defaults to `<id>.md`) */
  notes?: string
  camera?: CameraSettings
  /** Stage name from src/stages.ts (optional; defaults to neutral) */
  stage?: string
}

export const catalog: CatalogEntry[] = (models as CatalogEntry[])
  .slice()
  .sort((a, b) => a.order - b.order)

export function findModel(id: string): CatalogEntry | undefined {
  return catalog.find((m) => m.id === id)
}
