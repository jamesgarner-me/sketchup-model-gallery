declare module 'virtual:viewpoints' {
  import type { Viewpoint } from './viewpoints'
  /** Viewpoints per Model ID, extracted from each GLB at build time. */
  const viewpoints: Record<string, Viewpoint[]>
  export default viewpoints
}
