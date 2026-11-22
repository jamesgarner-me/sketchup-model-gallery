/**
 * Generates public/environments/showroom.hdr: a dark equirectangular Radiance (RGBE) image with
 * soft light panels, used as image-based lighting for the Showroom stage (see ADR 0002).
 * Tune the LIGHTS list and re-run: `npm run make:env`.
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const W = 512
const H = 256

type Vec = [number, number, number]
interface Light { name: string; dir: Vec; radiusDeg: number; intensity: number; tint?: Vec }

// Directions point from the Model towards the light. +z is towards the default camera, +x is right, +y up.
const LIGHTS: Light[] = [
  { name: 'key', dir: [-0.6, 0.6, 0.7], radiusDeg: 14, intensity: 14, tint: [1, 0.96, 0.9] },
  { name: 'fill', dir: [0.9, 0.15, 0.45], radiusDeg: 18, intensity: 3.5, tint: [0.9, 0.95, 1] },
  { name: 'rim', dir: [0.25, 0.5, -0.85], radiusDeg: 10, intensity: 10 },
  { name: 'overhead', dir: [0, 1, 0], radiusDeg: 16, intensity: 5 },
]
const BASE_UPPER = 0.012 // faint room ambience above the horizon
const BASE_LOWER = 0.004 // darker floor

const norm = (v: Vec): Vec => {
  const l = Math.hypot(...v)
  return [v[0] / l, v[1] / l, v[2] / l]
}
const lights = LIGHTS.map((l) => ({ ...l, dir: norm(l.dir), cosOuter: Math.cos((l.radiusDeg * Math.PI) / 180) }))

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

function radiance(d: Vec): Vec {
  const base = d[1] >= 0 ? BASE_UPPER : BASE_LOWER
  const out: Vec = [base, base, base]
  for (const l of lights) {
    const c = d[0] * l.dir[0] + d[1] * l.dir[1] + d[2] * l.dir[2]
    if (c <= l.cosOuter) continue
    // Soft-edged panel: full inside 60% of the radius, fading to 0 at the edge.
    const angle = Math.acos(Math.min(1, c))
    const r = (l.radiusDeg * Math.PI) / 180
    const k = l.intensity * smooth(r, r * 0.6, angle)
    const t = l.tint ?? [1, 1, 1]
    out[0] += k * t[0]
    out[1] += k * t[1]
    out[2] += k * t[2]
  }
  return out
}

function rgbe([r, g, b]: Vec): [number, number, number, number] {
  const v = Math.max(r, g, b)
  if (v < 1e-32) return [0, 0, 0, 0]
  const e = Math.ceil(Math.log2(v))
  const scale = 256 / 2 ** e
  return [Math.min(255, Math.floor(r * scale)), Math.min(255, Math.floor(g * scale)), Math.min(255, Math.floor(b * scale)), e + 128]
}

const header = Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${H} +X ${W}\n`, 'ascii')
const pixels = Buffer.alloc(W * H * 4)
for (let row = 0; row < H; row++) {
  // Row 0 is the top of the image (straight up); matches three.js equirectangular mapping.
  const lat = (0.5 - (row + 0.5) / H) * Math.PI
  for (let col = 0; col < W; col++) {
    const lon = ((col + 0.5) / W - 0.5) * 2 * Math.PI
    const d: Vec = [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]
    pixels.set(rgbe(radiance(d)), (row * W + col) * 4)
  }
}

const out = resolve(import.meta.dirname, '../public/environments/showroom.hdr')
writeFileSync(out, Buffer.concat([header, pixels]))
console.log(`Wrote ${out} (${((header.length + pixels.length) / 1024).toFixed(0)} KB)`)
