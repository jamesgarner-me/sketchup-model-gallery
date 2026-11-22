import { expect, test, type Page } from '@playwright/test'

const modelLoaded = (page: Page) =>
  page.waitForFunction(() => (document.querySelector('model-viewer') as unknown as { loaded?: boolean } | null)?.loaded === true, null, { timeout: 90_000 })

interface Cam { theta: number; phi: number; radius: number; target: number[]; fov: number; auto: boolean }
const cam = (page: Page) =>
  page.evaluate((): Cam => {
    const el = document.querySelector('model-viewer') as unknown as {
      getCameraOrbit(): { theta: number; phi: number; radius: number }
      getCameraTarget(): { x: number; y: number; z: number }
      getFieldOfView(): number
      autoRotate: boolean
    }
    const o = el.getCameraOrbit()
    const t = el.getCameraTarget()
    return { theta: o.theta, phi: o.phi, radius: o.radius, target: [t.x, t.y, t.z], fov: el.getFieldOfView(), auto: el.autoRotate }
  })

const settle = (page: Page) => page.waitForTimeout(700)

test('Viewpoints: drawer, enter, look around only, reset', async ({ page, isMobile }) => {
  await page.goto('/models/bastings-garden')
  await modelLoaded(page)
  const initial = await cam(page)

  const btn = page.getByRole('button', { name: 'Viewpoints' })
  await expect(btn).toBeVisible()
  await btn.click()
  const drawer = page.getByRole('complementary', { name: 'Viewpoints' })
  await expect(drawer).toBeVisible()
  await expect(btn).toHaveAttribute('aria-expanded', 'true')
  const rows = drawer.getByRole('button', { name: /./ }).filter({ hasNotText: 'Close' })
  await expect(rows).toHaveText([
    'Spring • through the driveway opening',
    'Middle landing',
    'Front verandah looking at drive',
    'Driveway looking at first landing',
    'First landing',
    'Hovering above car',
  ])
  // Drawer is within the viewport and at most ~85% wide.
  const box = (await drawer.boundingBox())!
  const vw = page.viewportSize()!.width
  expect(box.width).toBeLessThanOrEqual(Math.min(360, vw * 0.85) + 1)

  // Escape closes it and returns focus.
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(btn).toBeFocused()

  // Enter a Viewpoint: drawer closes, camera cut to the eye (Front verandah: about 9.4, 3.6, -9.8).
  await btn.click()
  await drawer.getByRole('button', { name: 'Front verandah looking at drive' }).click()
  await expect(drawer).toBeHidden()
  await settle(page)
  const inVp = await cam(page)
  const vb0 = (await page.locator('model-viewer').boundingBox())!
  expect(inVp.radius).toBeLessThan(0.05)
  expect(inVp.target[0]).toBeCloseTo(9.42, 1)
  expect(inVp.target[1]).toBeCloseTo(3.58, 1)
  expect(inVp.target[2]).toBeCloseTo(-9.77, 1)
  // model-viewer applies the field of view to the narrower axis (horizontal on a portrait phone).
  const aspect = vb0.width / vb0.height
  const deg = Math.PI / 180
  const narrowFov = aspect < 1 ? (2 * Math.atan(Math.tan((inVp.fov * deg) / 2) * aspect)) / deg : inVp.fov
  expect(narrowFov).toBeCloseTo(45, 0)
  await btn.click()
  await expect(drawer.getByRole('button', { name: 'Front verandah looking at drive' })).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Escape')

  const vb = (await page.locator('model-viewer').boundingBox())!
  const cx = vb.x + vb.width / 2
  const cy = vb.y + vb.height / 2

  if (!isMobile) {
    // Drag left: the view turns right ("grab the scene"), which is theta decreasing; the eye stays put.
    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(cx - 150, cy, { steps: 10 })
    await page.mouse.up()
    await settle(page)
    const dragged = await cam(page)
    expect(dragged.theta).toBeLessThan(inVp.theta - 0.05)
    dragged.target.forEach((v, i) => expect(v).toBeCloseTo(inVp.target[i], 2))

    // Arrow Left turns the view the same way as dragging left.
    await page.locator('model-viewer').focus()
    await page.keyboard.press('ArrowLeft')
    await settle(page)
    expect((await cam(page)).theta).toBeLessThan(dragged.theta)

    // Wheel and right-drag do nothing to eye or field of view.
    const before = await cam(page)
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, -600)
    await page.mouse.down({ button: 'right' })
    await page.mouse.move(cx + 100, cy + 60, { steps: 5 })
    await page.mouse.up({ button: 'right' })
    await settle(page)
    const after = await cam(page)
    expect(after.radius).toBeCloseTo(before.radius, 4)
    expect(after.fov).toBeCloseTo(before.fov, 3)
    after.target.forEach((v, i) => expect(v).toBeCloseTo(before.target[i], 2))

    // Tap does not move the pivot.
    await page.mouse.click(cx + 40, cy + 40)
    await settle(page)
    ;(await cam(page)).target.forEach((v, i) => expect(v).toBeCloseTo(before.target[i], 2))

    // Vertical look is limited to about 60° above level (phi ≥ 30°).
    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(cx, cy + 2000, { steps: 20 })
    await page.mouse.up()
    await settle(page)
    const pitched = await cam(page)
    expect(pitched.phi).toBeGreaterThan(Math.PI / 6 - 0.02)
    expect(pitched.phi).toBeLessThan((5 * Math.PI) / 6 + 0.02)
  }

  // Switch straight to another Viewpoint.
  await btn.click()
  await drawer.getByRole('button', { name: 'Middle landing' }).click()
  await settle(page)
  const second = await cam(page)
  expect(second.target[0]).toBeCloseTo(7.4, 1)
  expect(second.target[2]).toBeCloseTo(-5.0, 1)

  // Reset view leaves the Viewpoint and restores Initial framing and controls.
  await page.getByRole('button', { name: 'Reset view' }).click()
  await expect.poll(async () => (await cam(page)).radius, { timeout: 3_000 }).toBeCloseTo(initial.radius, 1)
  const reset = await cam(page)
  reset.target.forEach((v, i) => expect(v).toBeCloseTo(initial.target[i], 2))
  expect(reset.fov).toBeCloseTo(initial.fov, 1)
  const controls = await page.evaluate(() => {
    const el = document.querySelector('model-viewer') as unknown as { disablePan: boolean; disableZoom: boolean; disableTap: boolean; orbitSensitivity: number }
    return [el.disablePan, el.disableZoom, el.disableTap, el.orbitSensitivity]
  })
  expect(controls).toEqual([false, false, false, 1])
})

test('Viewpoints stop Auto-orbit and Reset restarts it', async ({ page }) => {
  await page.goto('/models/stairs')
  await modelLoaded(page)
  await expect.poll(async () => (await cam(page)).auto).toBe(true)
  await page.getByRole('button', { name: 'Viewpoints' }).click()
  await page.getByRole('button', { name: 'Scene 2' }).click()
  await settle(page)
  expect((await cam(page)).auto).toBe(false)
  await page.getByRole('button', { name: 'Reset view' }).click()
  await expect.poll(async () => (await cam(page)).auto, { timeout: 3_000 }).toBe(true)
})
