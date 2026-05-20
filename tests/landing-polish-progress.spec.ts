import { expect, test } from '@playwright/test';

test('scroll progress bar reflects scroll position via inline style', async ({ page }) => {
  await page.goto('/');
  const bar = page.getByTestId('scroll-progress-bar');
  await expect(bar).toBeVisible();
  const before = await bar.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--progress'));
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
  await page.waitForTimeout(300);
  const after = await bar.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--progress'));
  expect(after).not.toBe(before);
  expect(parseFloat(after)).toBeGreaterThan(0.05);
});
