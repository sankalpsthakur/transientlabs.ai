import { expect, test } from '@playwright/test';

test('home keeps one intentional wave divider before the closing FAQ', async ({ page }) => {
  await page.goto('/');
  const count = await page.evaluate(() => document.querySelectorAll('svg[viewBox="0 0 1200 24"]').length);
  expect(count).toBe(1);
});
