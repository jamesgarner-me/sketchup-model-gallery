import { expect, test, type Page } from '@playwright/test'

const modelLoaded = (page: Page) =>
  page.waitForFunction(() => (document.querySelector('model-viewer') as unknown as { loaded?: boolean } | null)?.loaded === true, null, { timeout: 90_000 })

/**
 * Position of a named node in its parent's space, from model-viewer's internal scene (ADR 0003).
 * Local, not world: Auto-orbit turns the whole Model, which would move world positions.
 */
const nodePos = (page: Page, name: string) =>
  page.evaluate((name) => {
    const el = document.querySelector('model-viewer') as unknown as Record<symbol, { model: { getObjectByName(n: string): { position: { x: number; y: number; z: number } } } }>
    const sym = Object.getOwnPropertySymbols(el).find((s) => s.description === 'scene')!
    const p = el[sym].model.getObjectByName(name).position
    return [p.x, p.y, p.z]
  }, name)

const cam = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector('model-viewer') as unknown as { getCameraOrbit(): { theta: number; phi: number; radius: number } }
    const o = el.getCameraOrbit()
    return [o.theta, o.phi, o.radius]
  })

test('Explode slider is hidden without the flag and on other Models', async ({ page }) => {
  await page.goto('/models/stairs')
  await modelLoaded(page)
  await expect(page.locator('#explode')).toBeHidden()
  await page.goto('/models/bastings-garden?explode')
  await modelLoaded(page)
  await expect(page.locator('#explode')).toBeHidden()
})

test('Explode spike: slider moves parts, not the camera; camera stays free', async ({ page }) => {
  await page.goto('/models/stairs?explode')
  await modelLoaded(page)
  const slider = page.locator('#explode-slider')
  await expect(slider).toBeVisible()

  const rest = await nodePos(page, 'AllStairs')
  const restWinders = await nodePos(page, 'Winders')
  const camBefore = await cam(page)

  await slider.fill('1000')
  const exploded = await nodePos(page, 'AllStairs')
  expect(Math.hypot(...exploded.map((v, i) => v - rest[i]))).toBeGreaterThan(0.1)
  expect(await cam(page)).toEqual(camBefore)

  // Nested mode at full slider also spreads the groups inside AllStairs.
  await page.locator('#explode-mode').click()
  await expect(page.locator('#explode-mode')).toHaveText('Nested')
  const nestedWinders = await nodePos(page, 'Winders')
  const nestedStairs = await nodePos(page, 'AllStairs')
  expect(Math.hypot(...nestedWinders.map((v, i) => v - restWinders[i]))).toBeGreaterThan(0.01)

  // Camera still moves at full explode: drag across the Model.
  const box = (await page.locator('model-viewer').boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 - 150, box.y + box.height / 2, { steps: 10 })
  await page.mouse.up()
  await expect.poll(async () => (await cam(page))[0]).not.toBeCloseTo(camBefore[0], 2)

  // Back to 0 reassembles exactly.
  await slider.fill('0')
  ;(await nodePos(page, 'AllStairs')).forEach((v, i) => expect(v).toBeCloseTo(rest[i], 6))
  ;(await nodePos(page, 'Winders')).forEach((v, i) => expect(v).toBeCloseTo(restWinders[i], 6))

  // Reset view returns the camera and reassembles: slider to the far left, parts at rest.
  await slider.fill('1000')
  expect(await nodePos(page, 'AllStairs')).toEqual(nestedStairs)
  await page.getByRole('button', { name: 'Reset view' }).click()
  await expect.poll(async () => (await cam(page))[0], { timeout: 5_000 }).toBeCloseTo(camBefore[0], 2)
  await expect(slider).toHaveValue('0')
  ;(await nodePos(page, 'AllStairs')).forEach((v, i) => expect(v).toBeCloseTo(rest[i], 6))
  ;(await nodePos(page, 'Winders')).forEach((v, i) => expect(v).toBeCloseTo(restWinders[i], 6))
})

const dist = (a: number[], b: number[]) => Math.hypot(...a.map((v, i) => v - b[i]))

test('Explode spike: only visible Layers explode, and Layers changes re-spread straight away', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/models/stairs?explode')
  await modelLoaded(page)
  const slider = page.locator('#explode-slider')
  const names = ['WallLeft', 'AllStairs', 'Winders', 'Baluster']
  const rest = Object.fromEntries(await Promise.all(names.map(async (n) => [n, await nodePos(page, n)] as const)))
  const moved = async (n: string) => dist(await nodePos(page, n), rest[n]) > 0.01
  const camBefore = await cam(page)

  // Wall left starts hidden (Catalog default), so it stays put; visible groups move.
  await slider.fill('1000')
  expect(await moved('WallLeft')).toBe(false)
  expect(await moved('AllStairs')).toBe(true)

  await page.getByRole('button', { name: 'Layers' }).click()
  const panel = page.getByRole('region', { name: 'Layers' })
  await expect(panel).toBeVisible()

  // Phone: the Layers sheet sits above the slider, which stays usable.
  if (page.viewportSize()!.width < 640) {
    const sheetBottom = await panel.evaluate((p) => (p as HTMLElement).offsetTop + (p as HTMLElement).offsetHeight)
    const sliderBox = (await slider.boundingBox())!
    expect(sheetBottom).toBeLessThanOrEqual(Math.ceil(sliderBox.y))
    const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.id, { x: sliderBox.x + sliderBox.width / 2, y: sliderBox.y + sliderBox.height / 2 })
    expect(hit).toBe('explode-slider')
  }

  // Showing a Layer while exploded spreads it at once; hiding one puts it back at rest.
  await panel.getByRole('checkbox', { name: 'Wall left' }).click()
  await expect.poll(() => moved('WallLeft')).toBe(true)
  await panel.getByRole('checkbox', { name: 'All stairs' }).click()
  ;(await nodePos(page, 'AllStairs')).forEach((v, i) => expect(v).toBeCloseTo(rest.AllStairs[i], 6))

  // Only All stairs visible: its own parts spread (Groups mode), the group itself stays put.
  const boxes = panel.getByRole('checkbox')
  for (let i = 0; i < (await boxes.count()); i++) {
    const box = boxes.nth(i)
    const want = (await box.locator('xpath=..').innerText()).trim() === 'All stairs'
    if ((await box.isChecked()) !== want) await box.click()
  }
  expect(await moved('AllStairs')).toBe(false)
  expect(await moved('Winders')).toBe(true)
  expect(await moved('Baluster')).toBe(false)

  // Restore defaults re-spreads for the current slider position.
  await panel.getByRole('button', { name: 'Restore defaults' }).click()
  expect(await moved('WallLeft')).toBe(false)
  expect(await moved('AllStairs')).toBe(true)

  // None of this moved the camera.
  expect(await cam(page)).toEqual(camBefore)

  // Reset view: starting Layers back (Wall left hidden again) and assembled.
  await panel.getByRole('checkbox', { name: 'Wall left' }).click()
  await expect.poll(() => moved('WallLeft')).toBe(true)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Reset view' }).click()
  await expect(slider).toHaveValue('0')
  for (const n of names) expect(await moved(n)).toBe(false)
  const wallVisible = await page.evaluate(() => {
    const el = document.querySelector('model-viewer') as unknown as Record<symbol, { model: { getObjectByName(n: string): { visible: boolean } } }>
    const sym = Object.getOwnPropertySymbols(el).find((s) => s.description === 'scene')!
    return el[sym].model.getObjectByName('WallLeft').visible
  })
  expect(wallVisible).toBe(false)
})
