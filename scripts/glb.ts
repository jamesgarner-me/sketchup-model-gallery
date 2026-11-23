import { closeSync, openSync, readSync } from 'node:fs'
import { readGlbJson } from '../src/viewpoints.ts'
import type { GltfJson } from '../src/viewpoints.ts'

/** Reads only a GLB's header and JSON chunk, not the binary geometry. */
export function readGlbHead(path: string): Uint8Array {
  const fd = openSync(path, 'r')
  try {
    const header = new Uint8Array(20)
    readSync(fd, header, 0, 20, 0)
    const jsonLength = new DataView(header.buffer).getUint32(12, true)
    const bytes = new Uint8Array(20 + jsonLength)
    readSync(fd, bytes, 0, bytes.length, 0)
    return bytes
  } finally {
    closeSync(fd)
  }
}

/** The glTF JSON of a GLB on disk. */
export function readGlbFileJson(path: string): GltfJson {
  return readGlbJson(readGlbHead(path))
}
