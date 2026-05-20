import { expect, test } from '@playwright/test';

test.describe('container width', () => {
  test('reading variant clamps content width to ~768px at lg+', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const readingNodes = page.locator('[data-container="reading"]');
    const count = await readingNodes.count();
    expect(count).toBeGreaterThan(0);
    const first = readingNodes.first();
    const box = await first.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(820);
    expect(box!.width).toBeGreaterThanOrEqual(640);
  });
});
