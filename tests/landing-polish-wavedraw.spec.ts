import { expect, test } from '@playwright/test';

test('wave divider draws via stroke-dashoffset, not fade', async ({ page }) => {
  await page.goto('/');
  const path = page.locator('svg[viewBox="0 0 1200 24"] path').first();
  await path.scrollIntoViewIfNeeded();
  const offset0 = await path.evaluate((el) => getComputedStyle(el).strokeDashoffset);
  await page.waitForTimeout(900);
  const offset1 = await path.evaluate((el) => getComputedStyle(el).strokeDashoffset);
  expect(offset0).not.toBe(offset1);
});
