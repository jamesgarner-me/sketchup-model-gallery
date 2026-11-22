/** Stage presets: background-and-lighting a Model is displayed in. Pure data, no DOM. */
export interface Stage {
  theme: 'light' | 'dark'
  /** Lighting-only environment image; omitted means model-viewer's default neutral lighting. */
  environmentImage?: string
  exposure: number
  shadowIntensity: number
  shadowSoftness: number
  toneMapping: 'neutral' | 'aces' | 'agx' | 'reinhard' | 'cineon' | 'linear'
}

export const STAGES = {
  neutral: { theme: 'light', exposure: 1, shadowIntensity: 0.6, shadowSoftness: 1, toneMapping: 'neutral' },
  showroom: {
    theme: 'dark',
    environmentImage: '/environments/showroom.hdr',
    exposure: 1,
    shadowIntensity: 1,
    shadowSoftness: 0.5,
    toneMapping: 'aces',
  },
} as const satisfies Record<string, Stage>

export type StageName = keyof typeof STAGES
export const STAGE_NAMES = Object.keys(STAGES) as StageName[]
export const DEFAULT_STAGE: StageName = 'neutral'

export function getStage(name: string | undefined): Stage {
  return STAGES[(name ?? DEFAULT_STAGE) as StageName] ?? STAGES[DEFAULT_STAGE]
}
