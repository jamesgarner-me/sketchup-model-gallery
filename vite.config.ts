import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

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

export default defineConfig({
  plugins: [modelsRewrite()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        model: resolve(import.meta.dirname, 'model.html'),
      },
    },
  },
})
