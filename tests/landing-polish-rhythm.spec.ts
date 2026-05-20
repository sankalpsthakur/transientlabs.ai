import { expect, test } from '@playwright/test';

test.describe('section rhythm', () => {
  test('default Section produces tighter vertical padding ladder', async ({ page }) => {
    await page.goto('/');
    const ind = page.locator('section#industries');
    const widthsToPaddings: Record<number, number> = {};
    for (const w of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      const pt = await ind.evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
      widthsToPaddings[w] = pt;
    }
    expect(widthsToPaddings[375]).toBeLessThan(96);
    expect(widthsToPaddings[768]).toBeLessThan(112);
    expect(widthsToPaddings[1024]).toBeLessThanOrEqual(112);
    expect(widthsToPaddings[1440]).toBeLessThanOrEqual(128);
    expect(widthsToPaddings[375]).toBeLessThanOrEqual(widthsToPaddings[768]);
    expect(widthsToPaddings[768]).toBeLessThanOrEqual(widthsToPaddings[1024]);
  });
});
