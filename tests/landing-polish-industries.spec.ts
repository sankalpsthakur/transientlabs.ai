import { expect, test } from '@playwright/test';

test('industry card lifts and shadows on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const card = page.locator('section#industries article.group').first();
  await card.scrollIntoViewIfNeeded();
  const initial = await card.evaluate((el) => getComputedStyle(el).transform);
  await card.hover();
  await page.waitForTimeout(300);
  const hovered = await card.evaluate((el) => getComputedStyle(el).transform);
  expect(hovered).not.toBe(initial);
});
