import { expect, test } from '@playwright/test';

test.describe('hero conversion copy', () => {
  test('leads with a stable outcome and explicit industrial path', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section#hero h1')).toContainText(/AI.*Agents/i);
    await expect(page.locator('section#hero h1')).toContainText(/boost.*margins/i);
    await expect(page.getByRole('link', { name: /explore industrial automation/i })).toBeVisible();
    await expect(page.getByTestId('industry-rotator')).toHaveCount(0);
  });

  test('keeps the complete business proposition under reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('section#hero')).toContainText('Every engagement starts as a bounded Sprint.');
    await expect(
      page.locator('section#hero').getByRole('button', { name: /book a working session/i }),
    ).toBeVisible();
    await context.close();
  });

  test('merchandises no prices on the landing hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section#hero')).not.toContainText('$');
  });
});

test.describe('hero typography', () => {
  test('headline scales monotonically without spikes', async ({ page }) => {
    const widths = [640, 768, 1024, 1280];
    const sizes: number[] = [];
    await page.goto('/');
    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 900 });
      const h1 = page.locator('section#hero h1').first();
      const size = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      sizes.push(size);
    }
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i]).toBeGreaterThanOrEqual(sizes[i - 1] - 4);
      const ratio = sizes[i] / sizes[i - 1];
      expect(ratio).toBeLessThan(1.30);
      expect(ratio).toBeGreaterThan(0.93);
    }
  });
});
