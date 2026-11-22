import { isValidAutoOrbit } from './autoOrbit'

export interface ValidatableEntry {
  id?: unknown
  title?: unknown
  description?: unknown
  glb?: unknown
  thumbnail?: unknown
  order?: unknown
  notes?: unknown
  stage?: unknown
  autoOrbit?: unknown
}

const REQUIRED_STRINGS = ['id', 'title', 'description', 'glb', 'thumbnail'] as const

/**
 * Returns a list of human-readable errors; empty means valid.
 * `fileExists` receives a public URL path (e.g. "/models/a.glb").
 * Missing Notes never produce an error.
 */
export function validateCatalog(
  entries: ValidatableEntry[],
  fileExists: (publicPath: string) => boolean,
  stageNames: readonly string[] = ['neutral'],
): string[] {
  const errors: string[] = []
  const seen = new Set<string>()

  entries.forEach((entry, i) => {
    const label = typeof entry.id === 'string' && entry.id ? `"${entry.id}"` : `entry #${i + 1}`

    for (const field of REQUIRED_STRINGS) {
      const v = entry[field]
      if (typeof v !== 'string' || v.trim() === '') errors.push(`${label}: missing required field "${field}"`)
    }
    if (typeof entry.order !== 'number') errors.push(`${label}: missing required numeric field "order"`)

    if (typeof entry.id === 'string' && entry.id) {
      if (seen.has(entry.id)) errors.push(`${label}: duplicate id "${entry.id}"`)
      seen.add(entry.id)
    }

    if (typeof entry.glb === 'string' && entry.glb && !fileExists(entry.glb)) {
      errors.push(`${label}: GLB file not found: ${entry.glb}`)
    }
    if (typeof entry.thumbnail === 'string' && entry.thumbnail && !fileExists(entry.thumbnail)) {
      errors.push(`${label}: thumbnail file not found: ${entry.thumbnail}`)
    }
    if (entry.stage !== undefined && (typeof entry.stage !== 'string' || !stageNames.includes(entry.stage))) {
      errors.push(`${label}: unknown stage "${String(entry.stage)}" (known: ${stageNames.join(', ')})`)
    }
    if (entry.autoOrbit !== undefined && !isValidAutoOrbit(entry.autoOrbit)) {
      errors.push(`${label}: invalid autoOrbit (use true, false or { "degreesPerSecond": <non-zero number> })`)
    }
  })

  return errors
}
