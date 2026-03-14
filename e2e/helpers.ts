import { type Page, expect } from '@playwright/test'

const TEST_EMAIL = 'typestax_e2e+clerk_test@test.com'
const TEST_VERIFICATION_CODE = '424242'

/**
 * Sign in via Clerk modal using test credentials.
 * Clerk test mode accepts any +clerk_test email with code 424242.
 */
export async function signIn(page: Page) {
  // Wait for Clerk to initialize and render the Sign in button
  const signInBtn = page.locator('button', { hasText: 'Sign in' })
  await expect(signInBtn).toBeVisible({ timeout: 20000 })
  await signInBtn.click()

  // Wait for Clerk modal
  await page.waitForSelector('.cl-rootBox', { timeout: 15000 })

  // Enter email
  await page.locator('.cl-rootBox input[name="identifier"]').fill(TEST_EMAIL)
  await page.locator('.cl-rootBox button:has-text("Continue")').click()

  // Enter verification code
  await page.waitForSelector('.cl-rootBox input[name="code"]', { timeout: 10000 })
  const codeInputs = page.locator('.cl-rootBox input[name="code"]')
  const count = await codeInputs.count()
  if (count === 1) {
    await codeInputs.fill(TEST_VERIFICATION_CODE)
  } else {
    // Individual digit inputs
    for (let i = 0; i < TEST_VERIFICATION_CODE.length; i++) {
      await codeInputs.nth(i).fill(TEST_VERIFICATION_CODE[i])
    }
  }

  // Wait for auth to complete (UserButton appears)
  await page.waitForSelector('.cl-userButtonTrigger', { timeout: 15000 })
}

/**
 * Sign out via Clerk UserButton
 */
export async function signOut(page: Page) {
  await page.locator('.cl-userButtonTrigger').click()
  await page.getByText('Sign out').click()
  await page.waitForSelector('button:has-text("Sign in")', { timeout: 10000 })
}

/**
 * Open the browse stacks dialog via header button
 */
export async function openBrowseDialog(page: Page) {
  // Close any existing dialog first
  const existing = page.locator('[role="dialog"]')
  if (await existing.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
  }
  await page.locator('header button:has(svg polygon)').click()
  await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 10000 })
}

/**
 * Create a new stack with a given name.
 * Uses the sidebar stack picker (aside), not the header browse button.
 */
export async function createStack(page: Page, name: string) {
  // Target the stack picker in the sidebar (aside), not the header
  const stackPicker = page.locator('aside button:has(svg polygon)').first()
  await stackPicker.click()

  await page.getByText('Save As...').click()
  await page.locator('input[placeholder="Preset name..."]').fill(name)
  await page.locator('input[placeholder="Preset name..."]').press('Enter')
  // Wait for toast confirmation
  await page.waitForTimeout(1500)
}

/**
 * Switch to a filter tab in the browse dialog
 */
export async function switchFilter(page: Page, filter: string) {
  await page.getByRole('button', { name: filter, exact: true }).click()
  await page.waitForTimeout(500)
}
