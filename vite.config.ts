import { closeSync, openSync, readFileSync, readSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { renderNotes } from './src/markdown.ts'
import { extractViewpoints, readGlbJson, type Viewpoint } from './src/viewpoints.ts'

// Dev/preview mirror of the vercel.json rewrite: /models/:id -> /model.html
const rewriteModels = (req: { url?: string }, _res: unknown, next: () => void) => {
  if (req.url && /^\/models\/[^/.]+\/?(\?.*)?$/.test(req.url)) req.url = '/model.html'
  next()
}
const modelsRewrite = (): Plugin => ({
  name: 'models-rewrite',
  configureServer(server) {
    server.middlewares.use(rewriteModels)
  },
  configurePreviewServer(server) {
    server.middlewares.use(rewriteModels)
  },
})

// Renders Notes Markdown to an HTML string at build time (no parser ships to the browser).
const notesMarkdown = (): Plugin => ({
  name: 'notes-markdown',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('.md')) return null
    return { code: `export default ${JSON.stringify(renderNotes(code))}`, map: null }
  },
})

// Reads only the GLB header and JSON chunk, not the binary geometry.
function readGlbHead(path: string): Uint8Array {
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

// Viewpoints (saved SketchUp Scenes) for every Catalog Model, extracted from the GLBs at build time.
const VIEWPOINTS_ID = 'virtual:viewpoints'
const viewpoints = (): Plugin => ({
  name: 'viewpoints',
  resolveId: (id) => (id === VIEWPOINTS_ID ? '\0' + VIEWPOINTS_ID : null),
  load(id) {
    if (id !== '\0' + VIEWPOINTS_ID) return null
    const root = import.meta.dirname
    const modelsPath = resolve(root, 'src/models.json')
    this.addWatchFile(modelsPath)
    const entries = JSON.parse(readFileSync(modelsPath, 'utf8')) as { id: string; glb: string }[]
    const byId: Record<string, Viewpoint[]> = {}
    for (const e of entries) {
      const glbPath = resolve(root, 'public', e.glb.replace(/^\//, ''))
      this.addWatchFile(glbPath)
      byId[e.id] = extractViewpoints(readGlbJson(readGlbHead(glbPath)))
      const names = byId[e.id].map((v) => v.name)
      this.info(`${e.id}: ${names.length} Viewpoint${names.length === 1 ? '' : 's'}${names.length ? ` (${names.join(', ')})` : ''}`)
    }
    return `export default ${JSON.stringify(byId)}`
  },
})

export default defineConfig({
  plugins: [modelsRewrite(), notesMarkdown(), viewpoints()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        model: resolve(import.meta.dirname, 'model.html'),
      },
    },
  },
})
