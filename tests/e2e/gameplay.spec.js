import { test, expect } from '@playwright/test';

test.describe('Garden Clash — Gameplay Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('completes a PvP match with Plant victory, victory overlay, and scoreboard update', async ({
    page,
  }) => {
    await expect(page.locator('.game-title')).toContainText('Garden');
    await expect(page.locator('.turn-indicator-text')).toContainText("PLANTS' TURN");

    // Plant places at 0
    await page.locator('[data-testid="cell-0"]').click();
    await expect(page.locator('.turn-indicator-text')).toContainText("ZOMBIES' TURN");

    // Zombie places at 3
    await page.locator('[data-testid="cell-3"]').click();
    await expect(page.locator('.turn-indicator-text')).toContainText("PLANTS' TURN");

    // Plant places at 1
    await page.locator('[data-testid="cell-1"]').click();
    await expect(page.locator('.turn-indicator-text')).toContainText("ZOMBIES' TURN");

    // Zombie places at 4
    await page.locator('[data-testid="cell-4"]').click();
    await expect(page.locator('.turn-indicator-text')).toContainText("PLANTS' TURN");

    // Plant places at 2 (Wins top row [0, 1, 2]!)
    await page.locator('[data-testid="cell-2"]').click();

    // Check Victory Banner & Overlay
    await expect(page.locator('.turn-indicator-text')).toContainText('PLANTS WIN!');
    await expect(page.locator('.result-title')).toContainText('VICTORY!');
    await expect(page.locator('.result-message')).toContainText('defended');

    // Scoreboard should show 1 win for Plants
    const plantScore = page.locator('.score-card--plant .score-number');
    await expect(plantScore).toHaveText('1');

    // Dismiss overlay to review lawn
    await page.locator('button', { hasText: 'Review Lawn' }).click();
    await expect(page.locator('.result-overlay-backdrop')).not.toBeVisible();

    // Winning cells should have cell--winning class
    await expect(page.locator('[data-testid="cell-0"]')).toHaveClass(/cell--winning/);
    await expect(page.locator('[data-testid="cell-1"]')).toHaveClass(/cell--winning/);
    await expect(page.locator('[data-testid="cell-2"]')).toHaveClass(/cell--winning/);

    // Click New Game to reset
    await page.locator('button', { hasText: 'New Game' }).click();
    await expect(page.locator('.turn-indicator-text')).toContainText("PLANTS' TURN");
    await expect(page.locator('[data-testid="cell-0"]')).toBeEmpty();
  });

  test('detects a draw (cat game) when board is filled without 3 in a row', async ({
    page,
  }) => {
    // Moves to force draw:
    // P: 0, 2, 3, 7, 8
    // Z: 1, 4, 5, 6
    const moves = [
      { cell: 0, expectedTurn: "ZOMBIES' TURN" },
      { cell: 1, expectedTurn: "PLANTS' TURN" },
      { cell: 2, expectedTurn: "ZOMBIES' TURN" },
      { cell: 4, expectedTurn: "PLANTS' TURN" },
      { cell: 3, expectedTurn: "ZOMBIES' TURN" },
      { cell: 5, expectedTurn: "PLANTS' TURN" },
      { cell: 7, expectedTurn: "ZOMBIES' TURN" },
      { cell: 6, expectedTurn: "PLANTS' TURN" },
      { cell: 8, expectedTurn: "IT'S A DRAW!" },
    ];

    for (const step of moves) {
      await page.locator(`[data-testid="cell-${step.cell}"]`).click();
    }

    await expect(page.locator('.turn-indicator-text')).toContainText("IT'S A DRAW!");
    await expect(page.locator('.result-title')).toContainText('STALEMATE!');

    const drawScore = page.locator('.score-card--draw .score-number');
    await expect(drawScore).toHaveText('1');
  });

  test('supports single-move undo in PvP mode', async ({ page }) => {
    await page.locator('[data-testid="cell-4"]').click(); // Plant
    await expect(page.locator('[data-testid="cell-4"]')).toHaveClass(/cell--occupied/);
    await expect(page.locator('.turn-indicator-text')).toContainText("ZOMBIES' TURN");

    // Click Undo
    await page.locator('button', { hasText: 'Undo' }).click();
    await expect(page.locator('[data-testid="cell-4"]')).not.toHaveClass(/cell--occupied/);
    await expect(page.locator('.turn-indicator-text')).toContainText("PLANTS' TURN");
  });
});
