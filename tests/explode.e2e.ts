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

  // Reset view moves the camera only; the parts stay exploded.
  await page.getByRole('button', { name: 'Reset view' }).click()
  await expect.poll(async () => (await cam(page))[0], { timeout: 5_000 }).toBeCloseTo(camBefore[0], 2)
  expect(await nodePos(page, 'AllStairs')).toEqual(nestedStairs)

  // Back to 0 reassembles exactly.
  await slider.fill('0')
  ;(await nodePos(page, 'AllStairs')).forEach((v, i) => expect(v).toBeCloseTo(rest[i], 6))
  ;(await nodePos(page, 'Winders')).forEach((v, i) => expect(v).toBeCloseTo(restWinders[i], 6))
})
