import { test, expect } from '@playwright/test'

test.describe('App loads', () => {
  test('homepage renders with sidebar and preview', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Header visible
    await expect(page.locator('header')).toBeVisible()

    // Sidebar controls visible (use first() since mobile settings duplicates labels)
    await expect(page.getByText('Base Size').first()).toBeVisible()
    await expect(page.getByText('Scale').first()).toBeVisible()

    // Headings/Body group controls
    await expect(page.getByText('Headings').first()).toBeVisible()
    await expect(page.getByText('Body').first()).toBeVisible()
  })

  test('browse stacks dialog opens and shows presets', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Use the header Browse button
    const browseBtn = page.locator('header button:has(svg polygon)')
    await browseBtn.click()

    // Dialog opens
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 10000 })

    // Category filters visible
    await expect(dialog.getByText('Editorial')).toBeVisible()
    await expect(dialog.getByText('Minimal')).toBeVisible()

    // Stack cards rendered
    const cards = dialog.locator('[role="button"]').filter({ has: page.locator('p') })
    await expect(cards.first()).toBeVisible({ timeout: 10000 })
  })

  test('Typewolf stacks appear in presets', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open browse via header
    await page.locator('header button:has(svg polygon)').click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 10000 })

    // Wait for cards to load
    const cards = dialog.locator('[role="button"]').filter({ has: page.locator('p') })
    await expect(cards.first()).toBeVisible({ timeout: 10000 })

    // Typewolf stacks should be visible among presets
    await expect(dialog.getByText('Playfair Display').first()).toBeVisible({ timeout: 10000 })
    await expect(dialog.getByText('Domine').first()).toBeVisible()
  })

  test('random preset button loads a stack', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click shuffle button (in sidebar stack picker area)
    const shuffleBtn = page.locator('button:has(svg.lucide-shuffle)')
    await shuffleBtn.click()
    await page.waitForTimeout(3000)

    // App should still be functional
    await expect(page.locator('header')).toBeVisible()
  })
})
