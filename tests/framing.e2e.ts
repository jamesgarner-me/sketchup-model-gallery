import { expect, test, type Page } from '@playwright/test'

const modelLoaded = (page: Page) =>
  page.waitForFunction(() => (document.querySelector('model-viewer') as unknown as { loaded?: boolean } | null)?.loaded === true, null, { timeout: 90_000 })

/**
 * How far the camera pivot sits below the Model's centre, as a fraction of the viewport height at the
 * pivot's distance. Lowering the pivot by 0.1 puts the Model 10% of the viewport height higher.
 */
const lift = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector('model-viewer') as unknown as {
      getCameraTarget(): { y: number }
      getBoundingBoxCenter(): { y: number }
      getCameraOrbit(): { phi: number; radius: number }
      getFieldOfView(): number
    }
    const { phi, radius } = el.getCameraOrbit()
    const worldHeight = 2 * radius * Math.tan((el.getFieldOfView() * Math.PI) / 360)
    return ((el.getBoundingBoxCenter().y - el.getCameraTarget().y) * Math.sin(phi)) / worldHeight
  })

for (const id of ['stairs', 'bastings-garden']) {
  test(`Initial framing lifts the Model 10% (${id}), also after Reset view`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.goto(`/models/${id}`)
    await modelLoaded(page)
    await page.evaluate(() => ((document.querySelector('model-viewer') as unknown as { interactionPrompt: string }).interactionPrompt = 'none'))
    await page.waitForTimeout(800)
    expect(await lift(page)).toBeCloseTo(0.1, 2)

    // Move the camera away, then Reset view returns to the same lifted position.
    await page.evaluate(() => {
      const el = document.querySelector('model-viewer') as unknown as { cameraOrbit: string; jumpCameraToGoal(): void }
      el.cameraOrbit = '120deg 40deg auto'
      el.jumpCameraToGoal()
    })
    await page.getByRole('button', { name: 'Reset view' }).click()
    await expect.poll(() => lift(page), { timeout: 5_000 }).toBeCloseTo(0.1, 2)
  })
}
