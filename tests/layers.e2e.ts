import { expect, test, type Page } from '@playwright/test'

const modelLoaded = (page: Page) =>
  page.waitForFunction(() => (document.querySelector('model-viewer') as unknown as { loaded?: boolean } | null)?.loaded === true, null, { timeout: 90_000 })

/** Visibility of the named top-level groups, read from model-viewer's internal three.js scene (ADR 0003). */
const groupVisibility = (page: Page, sanitisedNames: string[]) =>
  page.evaluate((names) => {
    type O = { name: string; visible: boolean; children: O[]; traverse(f: (o: O) => void): void }
    const el = document.querySelector('model-viewer')!
    const sym = Object.getOwnPropertySymbols(el).find((s) => s.description === 'scene')!
    const scene = (el as unknown as Record<symbol, O>)[sym]
    const out: Record<string, boolean | null> = Object.fromEntries(names.map((n) => [n, null]))
    scene.traverse((o) => {
      if (names.includes(o.name) && out[o.name] === null) out[o.name] = o.visible
    })
    return out
  }, sanitisedNames)

const orbit = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector('model-viewer') as unknown as { getCameraOrbit(): { theta: number; phi: number; radius: number } }
    const o = el.getCameraOrbit()
    return [o.theta, o.phi, o.radius]
  })

const STREET = '01__Street,_crossover_and_driveway'
const PLANTING = '09__Proposed_spring_planting'
const LANDING = '10__Existing_landing_comparison_•_toggle'
const CLEARANCE = '11__Roof-loaded_4×4_clearance_•_toggle'

test('Layers: defaults, toggle, restore, reset keeps Layers, panel behaviour', async ({ page }) => {
  // Loads the large Bastings Garden Model twice (the reload check) under software rendering.
  test.setTimeout(240_000)
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/models/bastings-garden')
  await modelLoaded(page)
  await page.waitForTimeout(500)

  // Defaults on load: 01–09 visible, 10 and 11 hidden.
  expect(await groupVisibility(page, [STREET, PLANTING, LANDING, CLEARANCE])).toEqual({
    [STREET]: true, [PLANTING]: true, [LANDING]: false, [CLEARANCE]: false,
  })

  const btn = page.getByRole('button', { name: 'Layers' })
  await expect(btn).toBeVisible()
  await btn.click()
  const panel = page.getByRole('region', { name: 'Layers' })
  await expect(panel).toBeVisible()
  await expect(btn).toHaveAttribute('aria-expanded', 'true')
  const boxes = panel.getByRole('checkbox')
  await expect(boxes).toHaveCount(11)
  await expect(panel.getByRole('checkbox', { name: 'Street, crossover and driveway' })).toBeChecked()
  await expect(panel.getByRole('checkbox', { name: 'Existing landing comparison' })).not.toBeChecked()
  await expect(panel.getByRole('checkbox', { name: 'Roof-loaded 4×4 clearance' })).not.toBeChecked()
  // Panel stays within the viewport and leaves the Model visible (bottom sheet ≤ half height on phones).
  const box = (await panel.boundingBox())!
  const vp = page.viewportSize()!
  const mv = page.locator('model-viewer')
  if (vp.width < 640) {
    expect(box.height).toBeLessThanOrEqual(vp.height / 2 + 1)
    // The 3D view shrinks to the area above the sheet so the Model is framed there.
    const sheetTop = await panel.evaluate((p) => (p as HTMLElement).offsetTop) // resting position, ignoring the slide-in
    await expect.poll(async () => Math.round((await mv.boundingBox())!.height)).toBe(sheetTop)
  } else {
    expect(box.width).toBeLessThanOrEqual(361)
    expect((await mv.boundingBox())!.height).toBe(vp.height)
  }

  // Toggle: hides/shows without moving the camera. (The idle interaction-prompt wiggle would turn it.)
  await page.evaluate(() => ((document.querySelector('model-viewer') as unknown as { interactionPrompt: string }).interactionPrompt = 'none'))
  await page.waitForTimeout(500)
  const before = await orbit(page)
  await panel.getByRole('checkbox', { name: 'Street, crossover and driveway' }).click()
  await panel.getByRole('checkbox', { name: 'Existing landing comparison' }).click()
  expect(await groupVisibility(page, [STREET, LANDING])).toEqual({ [STREET]: false, [LANDING]: true })
  await page.waitForTimeout(300)
  // A Layer-driven re-frame would be a large jump; allow for a wiggle still settling.
  const after = await orbit(page)
  after.forEach((v, i) => expect(Math.abs(v - before[i])).toBeLessThan(0.01))

  // Restore defaults.
  await panel.getByRole('button', { name: 'Restore defaults' }).click()
  expect(await groupVisibility(page, [STREET, LANDING])).toEqual({ [STREET]: true, [LANDING]: false })
  await expect(panel.getByRole('checkbox', { name: 'Street, crossover and driveway' })).toBeChecked()

  // Escape closes and returns focus.
  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await expect(btn).toBeFocused()
  await expect(btn).toHaveAttribute('aria-expanded', 'false')
  expect((await mv.boundingBox())!.height).toBe(vp.height)

  // Layers button toggles closed; close button closes and returns focus.
  await btn.click()
  await expect(panel).toBeVisible()
  await btn.click()
  await expect(panel).toBeHidden()
  await btn.click()
  await panel.getByRole('button', { name: 'Close' }).click()
  await expect(panel).toBeHidden()
  await expect(btn).toBeFocused()

  // Only one side panel at a time: opening Viewpoints closes Layers and vice versa.
  await btn.click()
  await page.getByRole('button', { name: 'Viewpoints' }).click()
  await expect(panel).toBeHidden()
  await expect(page.getByRole('complementary', { name: 'Viewpoints' })).toBeVisible()
  // On phones the Viewpoints drawer covers the controls, so close it first there.
  if (vp.width < 640) await page.keyboard.press('Escape')
  await btn.click()
  await expect(page.getByRole('complementary', { name: 'Viewpoints' })).toBeHidden()
  await expect(panel).toBeVisible()

  // Reset view keeps Layers.
  await panel.getByRole('checkbox', { name: 'Proposed spring planting' }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Reset view' }).click()
  await page.waitForTimeout(800)
  expect(await groupVisibility(page, [PLANTING])).toEqual({ [PLANTING]: false })

  // Orbit unaffected: with auto-rotate running, toggling a Layer leaves it running.
  await page.evaluate(() => {
    const el = document.querySelector('model-viewer') as unknown as { autoRotate: boolean; autoRotateDelay: number }
    el.autoRotateDelay = 0
    el.autoRotate = true
  })
  await btn.click()
  await panel.getByRole('checkbox', { name: 'Proposed spring planting' }).click()
  const turn = () => page.evaluate(() => (document.querySelector('model-viewer') as unknown as { turntableRotation: number }).turntableRotation)
  const t0 = await turn()
  await expect.poll(turn, { timeout: 10_000 }).not.toBe(t0)
  expect(await page.evaluate(() => (document.querySelector('model-viewer') as unknown as { autoRotate: boolean }).autoRotate)).toBe(true)

  // Reload returns to defaults (nothing kept in the URL).
  expect(page.url()).toMatch(/\/models\/bastings-garden$/)
  await page.reload()
  await modelLoaded(page)
  await page.waitForTimeout(500)
  expect(await groupVisibility(page, [STREET, PLANTING, LANDING])).toEqual({ [STREET]: true, [PLANTING]: true, [LANDING]: false })

  expect(errors.filter((e) => e.includes('[Layers]'))).toEqual([])
})

test('Stairs: toggling a Layer leaves Auto-orbit running', async ({ page }) => {
  await page.goto('/models/stairs')
  await modelLoaded(page)
  const auto = () => page.evaluate(() => (document.querySelector('model-viewer') as unknown as { autoRotate: boolean }).autoRotate)
  await expect.poll(auto).toBe(true)
  await page.getByRole('button', { name: 'Layers' }).click()
  const panel = page.getByRole('region', { name: 'Layers' })
  await expect(panel.getByRole('checkbox')).toHaveCount(11)
  // Walls and plaster start hidden; showing one reveals it.
  expect(await groupVisibility(page, ['Walls', 'PlasterSheeting'])).toEqual({ Walls: false, PlasterSheeting: false })
  await panel.getByRole('checkbox', { name: 'Walls' }).click()
  expect(await groupVisibility(page, ['Walls'])).toEqual({ Walls: true })
  expect(await auto()).toBe(true)
})
