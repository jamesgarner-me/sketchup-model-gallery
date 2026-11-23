import { expect, test, type Page } from '@playwright/test'

// Wait for the Model itself to finish loading. Checking that the loading bar is hidden is not
// enough: right after navigation the bar may not exist yet, which counts as hidden.
const modelLoaded = (page: Page, timeout = 90_000) =>
  page.waitForFunction(() => (document.querySelector('model-viewer') as unknown as { loaded?: boolean } | null)?.loaded === true, null, { timeout })

const orbit = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector('model-viewer') as unknown as { getCameraOrbit(): { theta: number; phi: number; radius: number } }
    const o = el.getCameraOrbit()
    return [o.theta, o.phi, o.radius].map((n) => n.toFixed(3)).join(',')
  })

test('gallery → viewer → info → reset', async ({ page, isMobile }) => {
  const glbRequests: string[] = []
  page.on('request', (r) => r.url().includes('.glb') && glbRequests.push(r.url()))

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Model Gallery')
  const card = page.getByRole('link', { name: 'Stairs design' })
  await expect(card).toBeVisible()
  await expect(page.getByAltText('Stairs design')).toBeVisible()
  expect(glbRequests, 'no GLB fetched on the Gallery').toHaveLength(0)

  await card.click()
  await expect(page).toHaveURL(/\/models\/stairs$/)
  await modelLoaded(page)
  await expect(page.locator('#loading')).toBeHidden()
  await page.waitForTimeout(1_000)
  const initial = await orbit(page)
  // On a cold load the Stage lighting can finish after 'load', and rotation starts on first render,
  // so wait for the orbit to begin rather than checking after a fixed pause.
  await expect
    .poll(() => page.evaluate(() => (document.querySelector('model-viewer') as unknown as { turntableRotation: number }).turntableRotation), {
      timeout: 10_000,
      message: 'auto-orbit running',
    })
    .not.toBe(0)

  // Move the camera (desktop drag; on touch emulation use a programmatic goal).
  if (isMobile) {
    // A programmatic move isn't a touch, so model-viewer's idle "hand" prompt would still play and
    // rotate the camera mid-test. Disable it here only; the product keeps its default prompt.
    await page.evaluate(() => {
      const el = document.querySelector('model-viewer') as unknown as { cameraOrbit: string; interactionPrompt: string; jumpCameraToGoal(): void }
      el.interactionPrompt = 'none'
      el.cameraOrbit = '120deg 40deg auto'
      el.jumpCameraToGoal()
    })
  } else {
    const box = (await page.locator('model-viewer').boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + 60, box.y + 80, { steps: 10 })
    await page.mouse.up()
  }
  await page.waitForTimeout(800)
  const moved = await orbit(page)
  expect(moved).not.toBe(initial)

  // Info opens, shows notes, closes, camera preserved.
  await page.getByRole('button', { name: 'Info' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Stairs design' })).toBeVisible()
  // Stairs is on the dark Showroom stage, but the Info overlay keeps the light reading style.
  await expect(page.locator('.viewer')).toHaveAttribute('data-theme', 'dark')
  expect(await dialog.evaluate((d) => getComputedStyle(d).backgroundColor)).toBe('rgb(255, 255, 255)')
  await dialog.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).toBeHidden()
  expect(await orbit(page)).toBe(moved)

  // Reset view returns to the initial framing.
  await page.getByRole('button', { name: 'Reset view' }).click()
  await expect.poll(() => orbit(page), { timeout: 3_000 }).toBe(initial)
  // Stairs has Auto-orbit; Reset returns to Initial framing, then restarts the orbit.
  const turntable = () => page.evaluate(() => (document.querySelector('model-viewer') as unknown as { turntableRotation: number }).turntableRotation)
  await expect.poll(turntable, { timeout: 3_000, message: 'auto-orbit restarts after Reset' }).not.toBe(0)

  // Back to the Gallery.
  await page.getByRole('link', { name: 'Gallery', exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('unknown model shows not found', async ({ page }) => {
  await page.goto('/models/does-not-exist')
  await expect(page.getByRole('heading', { name: 'Model not found' })).toBeVisible()
  await expect(page.locator('model-viewer')).toHaveCount(0)
})

test('direct link survives refresh', async ({ page }) => {
  await page.goto('/models/stairs')
  await page.reload()
  await modelLoaded(page)
  await expect(page.locator('#loading')).toBeHidden()
  await expect(page).toHaveTitle(/Stairs design/)
})

test('close zoom, non-metallic materials and sRGB colours', async ({ page }) => {
  await page.goto('/models/bastings-garden')
  await modelLoaded(page)
  await expect(page.locator('#loading')).toBeHidden()
  const result = await page.evaluate(async () => {
    const el = document.querySelector('model-viewer') as unknown as {
      cameraOrbit: string
      jumpCameraToGoal(): void
      getCameraOrbit(): { radius: number }
      model: { materials: { name: string; pbrMetallicRoughness: { metallicFactor: number; baseColorFactor: number[] } }[] }
    }
    // Ask for a very close camera; the library clamps to its minimum radius.
    el.cameraOrbit = 'auto auto 0.05m'
    el.jumpCameraToGoal()
    await new Promise((r) => setTimeout(r, 500))
    const colour = (name: string) => el.model.materials.find((m) => m.name === name)!.pbrMetallicRoughness.baseColorFactor
    return {
      radius: el.getCameraOrbit().radius,
      allNonMetallic: el.model.materials.every((m) => m.pbrMetallicRoughness.metallicFactor === 0),
      battens: colour('07 • Black stained battens'),
      textured: colour('02 • Sawn bluestone | ashlar'),
    }
  })
  expect(result.radius, 'camera can get within 1 m of the pivot').toBeLessThan(1)
  expect(result.allNonMetallic).toBe(true)
  // Exported sRGB colours are converted to linear: battens 0.184 (#2F302D) → about 0.029.
  expect(result.battens[0]).toBeCloseTo(0.029, 2)
  expect(result.battens[3]).toBe(1)
  // Textured materials (factor 1) are unchanged.
  expect(result.textured.slice(0, 3)).toEqual([1, 1, 1])
})

// Layers reach model-viewer's internal three.js scene (ADR 0003); this fails loudly if a library
// upgrade changes those internals or three.js's node-name sanitising.
test('Layers toggle a Bastings Garden group', async ({ page }) => {
  await page.goto('/models/bastings-garden')
  await modelLoaded(page)
  const carVisible = () =>
    page.evaluate(() => {
      type O = { name: string; visible: boolean; traverse(f: (o: O) => void): void }
      const el = document.querySelector('model-viewer')!
      const sym = Object.getOwnPropertySymbols(el).find((s) => s.description === 'scene')
      if (!sym) return 'no scene symbol'
      let v: boolean | string = 'group not found'
      ;(el as unknown as Record<symbol, O>)[sym].traverse((o) => {
        if (o.name === '07__White_Audi_Q3' && typeof v === 'string') v = o.visible
      })
      return v
    })
  await expect(page.getByRole('button', { name: 'Layers' })).toBeVisible()
  expect(await carVisible()).toBe(true)
  await page.getByRole('button', { name: 'Layers' }).click()
  await page.getByRole('checkbox', { name: 'White Audi Q3' }).click()
  expect(await carVisible()).toBe(false)
})
