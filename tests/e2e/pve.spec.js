import { test, expect } from '@playwright/test';

test.describe('Garden Clash — PvE vs Computer Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('switches to vs AI mode and automatically receives computer response', async ({
    page,
  }) => {
    // Switch to vs AI
    await page.locator('button', { hasText: 'vs AI' }).click();

    // Verify difficulty selector is visible
    await expect(page.locator('.settings-row', { hasText: 'AI LEVEL:' })).toBeVisible();
    await expect(page.locator('.settings-row', { hasText: 'PLAY AS:' })).toBeVisible();

    // Human (Plants) clicks center (cell 4)
    await page.locator('[data-testid="cell-4"]').click();

    // Verify computer thinking banner appears or cell gets placed
    // Wait for AI to respond (takes ~420ms)
    await page.waitForTimeout(700);

    // Board should now have 2 occupied cells (Human's Plant + AI's Zombie)
    const occupiedCells = page.locator('.cell--occupied');
    await expect(occupiedCells).toHaveCount(2);

    // Turn should be back to Plants
    await expect(page.locator('.turn-indicator-text')).toContainText("PLANTS' TURN");
  });

  test('PvE Undo rolls back both human and computer moves together', async ({
    page,
  }) => {
    // Switch to vs AI
    await page.locator('button', { hasText: 'vs AI' }).click();

    // Human places move
    await page.locator('[data-testid="cell-0"]').click();

    // Wait for AI response
    await page.waitForTimeout(700);
    await expect(page.locator('.cell--occupied')).toHaveCount(2);

    // Click Undo
    await page.locator('button', { hasText: 'Undo' }).click();

    // Both moves should be rolled back (0 occupied cells)
    await expect(page.locator('.cell--occupied')).toHaveCount(0);
    await expect(page.locator('.turn-indicator-text')).toContainText("PLANTS' TURN");
  });

  test('allows playing as Zombies with AI making the first move', async ({
    page,
  }) => {
    await page.locator('button', { hasText: 'vs AI' }).click();

    // Select Play As Zombies
    await page.locator('button', { hasText: 'Zombies' }).click();

    // Start New Game so AI gets the first turn as Plants
    await page.locator('button', { hasText: 'New Game' }).click();

    // Wait for AI opening move
    await page.waitForTimeout(700);

    // AI should have placed 1 Plant
    await expect(page.locator('.cell--occupied')).toHaveCount(1);
    await expect(page.locator('.turn-indicator-text')).toContainText("ZOMBIES' TURN");
  });
});
