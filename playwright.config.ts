import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  testMatch: '*.e2e.ts',
  timeout: 90_000,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4173',
    launchOptions: { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  // Against a hosted site (BASE_URL set), skip the local server.
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'npm run build && npx vite preview --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 120_000 },
})
