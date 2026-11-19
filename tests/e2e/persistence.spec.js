import { test, expect } from '@playwright/test';

test.describe('Garden Clash — Persistence & Controls Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('persists Day/Night theme across page reloads', async ({ page }) => {
    // Starts in Day mode
    await expect(page.locator('html')).not.toHaveClass(/night/);

    // Switch to Night mode
    await page.locator('button', { hasText: 'Night' }).click();
    await expect(page.locator('html')).toHaveClass(/night/);
    await expect(page.locator('button', { hasText: 'Day' })).toBeVisible();

    // Reload page
    await page.reload();

    // Night mode should still be active
    await expect(page.locator('html')).toHaveClass(/night/);
    await expect(page.locator('button', { hasText: 'Day' })).toBeVisible();
  });

  test('persists sound mute preference across page reloads', async ({ page }) => {
    // Starts with Sound ON
    await expect(page.locator('button', { hasText: 'Sound' })).toBeVisible();

    // Mute sound
    await page.locator('button', { hasText: 'Sound' }).click();
    await expect(page.locator('button', { hasText: 'Muted' })).toBeVisible();

    // Reload page
    await page.reload();

    // Sound should remain Muted
    await expect(page.locator('button', { hasText: 'Muted' })).toBeVisible();
  });

  test('persists match history log and requires confirmation to clear', async ({
    page,
  }) => {
    // Win a quick match as Plants
    await page.locator('[data-testid="cell-0"]').click(); // P
    await page.locator('[data-testid="cell-3"]').click(); // Z
    await page.locator('[data-testid="cell-1"]').click(); // P
    await page.locator('[data-testid="cell-4"]').click(); // Z
    await page.locator('[data-testid="cell-2"]').click(); // P wins

    // Dismiss victory overlay
    await page.locator('button', { hasText: 'Review Lawn' }).click();

    // Check Match History log
    const historyToggle = page.locator('.history-toggle-btn');
    await expect(historyToggle).toContainText('MATCH LOG (1)');

    // Expand history drawer
    await historyToggle.click();
    await expect(page.locator('.history-item')).toHaveCount(1);
    await expect(page.locator('.history-badge--plant')).toContainText('PLANTS');

    // Reload page and verify history survived
    await page.reload();
    await expect(page.locator('.history-toggle-btn')).toContainText('MATCH LOG (1)');
    await page.locator('.history-toggle-btn').click();

    // Try clearing history
    await page.locator('.history-header button', { hasText: 'Clear' }).click();
    await expect(page.locator('.scoreboard-confirm-text')).toContainText('Clear?');

    // Confirm Clear
    await page.locator('.history-header button', { hasText: 'Yes' }).click();
    await expect(page.locator('.history-empty')).toBeVisible();
  });
});
