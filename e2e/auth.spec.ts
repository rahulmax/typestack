import { test, expect } from '@playwright/test'
import { signIn, signOut } from './helpers'

test.describe.skip('Authentication (requires @clerk/testing setup)', () => {
  test('sign in with Clerk test credentials', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for Clerk to load and show Sign in button
    const signInBtn = page.locator('button', { hasText: 'Sign in' })
    await expect(signInBtn).toBeVisible({ timeout: 20000 })

    await signIn(page)

    // Sign in button should be gone, UserButton should appear
    await expect(page.locator('.cl-userButtonTrigger')).toBeVisible({ timeout: 15000 })
    await expect(signInBtn).not.toBeVisible()
  })

  test('sign out returns to unauthenticated state', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await signIn(page)
    await expect(page.locator('.cl-userButtonTrigger')).toBeVisible()

    await signOut(page)

    // Sign in button should reappear
    await expect(page.locator('button', { hasText: 'Sign in' })).toBeVisible({ timeout: 15000 })
  })
})
