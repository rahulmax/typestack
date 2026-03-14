import { test, expect } from '@playwright/test'
import { createStack, openBrowseDialog, switchFilter } from './helpers'

test.describe.skip('Cross-user visibility (requires auth fix)', () => {
  const STACK_NAME = `Cross User Test ${Date.now()}`

  test('stack created by user A is not visible to user B before publishing', async ({ browser }) => {
    // User A context
    const contextA = await browser.newContext()
    const pageA = await contextA.newPage()
    await pageA.goto('https://typestax.vercel.app')
    await pageA.waitForLoadState('networkidle')

    // User A creates a stack
    await createStack(pageA, STACK_NAME)

    // User A opens browse and verifies in Mine
    await openBrowseDialog(pageA)
    await switchFilter(pageA, 'Mine')
    await pageA.waitForTimeout(1500)
    const dialogA = pageA.locator('[role="dialog"]')
    await expect(dialogA.getByText(STACK_NAME)).toBeVisible({ timeout: 10000 })

    // User B context (separate localStorage = different device ID)
    const contextB = await browser.newContext()
    const pageB = await contextB.newPage()
    await pageB.goto('https://typestax.vercel.app')
    await pageB.waitForLoadState('networkidle')

    // User B opens browse > Community
    await openBrowseDialog(pageB)
    await switchFilter(pageB, 'Community')
    await pageB.waitForTimeout(1500)

    // User B should NOT see user A's unpublished stack
    const dialogB = pageB.locator('[role="dialog"]')
    await expect(dialogB.getByText(STACK_NAME)).not.toBeVisible({ timeout: 3000 })

    await contextA.close()
    await contextB.close()
  })
})
