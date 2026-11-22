/** sRGB-encoded channel (0–1) to linear, using the standard piecewise sRGB transfer function. */
export function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
