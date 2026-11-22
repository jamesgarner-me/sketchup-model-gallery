import { expect, test, type Page } from '@playwright/test'

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
  await expect(page.locator('#loading')).toBeHidden({ timeout: 60_000 })
  await page.waitForTimeout(1_000)
  const initial = await orbit(page)

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
  await dialog.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).toBeHidden()
  expect(await orbit(page)).toBe(moved)

  // Reset view returns to the initial framing.
  await page.getByRole('button', { name: 'Reset view' }).click()
  await expect.poll(() => orbit(page), { timeout: 3_000 }).toBe(initial)

  // Back to the Gallery.
  await page.getByRole('link', { name: '← Gallery' }).click()
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
  await expect(page.locator('#loading')).toBeHidden({ timeout: 60_000 })
  await expect(page).toHaveTitle(/Stairs design/)
})
