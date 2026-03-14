import { test, expect } from '@playwright/test'
import { signIn, openBrowseDialog, createStack, switchFilter } from './helpers'

test.describe('Stack management', () => {
  const STACK_NAME = `E2E Test Stack ${Date.now()}`

  test('create a new stack (save as)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await createStack(page, STACK_NAME)

    // Stack name should appear in the sidebar picker
    const stackPicker = page.locator('aside button:has(svg polygon)').first()
    await expect(stackPicker).toContainText(STACK_NAME, { timeout: 5000 })
  })

  test('created stack appears in Mine tab', async ({ page }) => {
    const myStackName = `Mine Tab Test ${Date.now()}`
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Create stack first
    await createStack(page, myStackName)

    // Open browse dialog
    await openBrowseDialog(page)

    // Switch to Mine
    const dialog = page.locator('[role="dialog"]')
    await dialog.locator('button', { hasText: 'Mine' }).click()
    await page.waitForTimeout(2000)

    // Our stack should be listed
    await expect(dialog.getByText(myStackName)).toBeVisible({ timeout: 10000 })
  })

  test('like a preset stack', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await openBrowseDialog(page)

    // Hover first card to reveal action bar
    const firstCard = page.locator('[role="dialog"] [role="button"]').filter({ has: page.locator('p') }).first()
    await firstCard.hover()
    await page.waitForTimeout(300)

    // Click heart icon
    const heartBtn = firstCard.locator('button:has(svg.lucide-heart)')
    await heartBtn.click()
    await page.waitForTimeout(500)

    // Heart should be filled (red)
    const heartSvg = firstCard.locator('svg.lucide-heart')
    await expect(heartSvg).toHaveClass(/fill-red-500/)
  })

  test('save (bookmark) a preset stack', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await openBrowseDialog(page)

    // Hover first card
    const firstCard = page.locator('[role="dialog"] [role="button"]').filter({ has: page.locator('p') }).first()
    await firstCard.hover()
    await page.waitForTimeout(300)

    // Click bookmark icon
    const bookmarkBtn = firstCard.locator('button:has(svg.lucide-bookmark)')
    await bookmarkBtn.click()
    await page.waitForTimeout(500)

    // Bookmark should be filled (blue)
    const bookmarkSvg = firstCard.locator('svg.lucide-bookmark')
    await expect(bookmarkSvg).toHaveClass(/fill-blue-500/)
  })

  test('saved stack appears in Saved tab', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await openBrowseDialog(page)

    // Save first preset
    const firstCard = page.locator('[role="dialog"] [role="button"]').filter({ has: page.locator('p') }).first()
    const stackName = await firstCard.locator('span.text-xs.font-medium').textContent()
    await firstCard.hover()
    await page.waitForTimeout(300)
    await firstCard.locator('button:has(svg.lucide-bookmark)').click()
    await page.waitForTimeout(500)

    // Switch to Saved tab
    await switchFilter(page, 'Saved')
    await page.waitForTimeout(1500)

    // Should see the saved stack
    const dialog = page.locator('[role="dialog"]')
    const savedCards = dialog.locator('[role="button"]').filter({ has: page.locator('p') })
    await expect(savedCards.first()).toBeVisible({ timeout: 10000 })
  })
})
