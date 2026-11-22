import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { renderNotes } from './src/markdown.ts'

// Dev-only mirror of the vercel.json rewrite: /models/:id -> /model.html
const modelsRewrite = (): Plugin => ({
  name: 'models-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && /^\/models\/[^/.]+\/?(\?.*)?$/.test(req.url)) req.url = '/model.html'
      next()
    })
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

export default defineConfig({
  plugins: [modelsRewrite(), notesMarkdown()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        model: resolve(import.meta.dirname, 'model.html'),
      },
    },
  },
})
