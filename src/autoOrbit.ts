/** Auto-orbit setting as written in the Catalog. */
export type AutoOrbitSetting = boolean | { degreesPerSecond: number }

export const DEFAULT_AUTO_ORBIT_DEG_PER_SEC = 18

/** Degrees per second to orbit at, or undefined when the Model should stay still. */
export function resolveAutoOrbit(setting: AutoOrbitSetting | undefined, prefersReducedMotion: boolean): number | undefined {
  if (prefersReducedMotion || !setting) return undefined
  if (setting === true) return DEFAULT_AUTO_ORBIT_DEG_PER_SEC
  const n = setting.degreesPerSecond
  return Number.isFinite(n) && n !== 0 ? n : undefined
}

/** True when a raw Catalog value is a valid Auto-orbit setting. */
export function isValidAutoOrbit(value: unknown): boolean {
  if (typeof value === 'boolean') return true
  if (value === null || typeof value !== 'object') return false
  const n = (value as { degreesPerSecond?: unknown }).degreesPerSecond
  return typeof n === 'number' && Number.isFinite(n) && n !== 0
}
