import { expect, test } from '@playwright/test';

test.describe('hero industry rotator', () => {
  test('cycles through industry names with a blinking cursor', async ({ page }) => {
    await page.goto('/');
    const rotator = page.getByTestId('industry-rotator');
    await expect(rotator).toBeVisible();
    const industries = ['Biochar', 'Submersible pumps', 'Retail', 'Hardware programs', 'Industrial teams', 'AI-native SaaS'];
    await expect.poll(async () => (await rotator.innerText()).trim(), { timeout: 6000, intervals: [150] })
      .toMatch(new RegExp(industries.join('|')));
    await expect(rotator.getByTestId('industry-cursor')).toBeVisible();
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const text = (await rotator.innerText()).trim();
      for (const ind of industries) if (text.includes(ind)) seen.add(ind);
      if (seen.size >= 2) break;
      await page.waitForTimeout(150);
    }
    expect(seen.size).toBeGreaterThanOrEqual(2);
  });

  test('respects prefers-reduced-motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const rotator = page.getByTestId('industry-rotator');
    await expect(rotator).toBeVisible();
    await page.waitForTimeout(800);
    const text = (await rotator.innerText()).trim();
    expect(text.length).toBeGreaterThan(20);
    await expect(rotator.getByTestId('industry-cursor')).toHaveCount(0);
    await context.close();
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
