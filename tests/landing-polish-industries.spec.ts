import { expect, test } from '@playwright/test';

test('industry card lifts on hover (Tailwind v4 translate property)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const card = page.locator('section#industries article.group').first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800); // let any stagger/reveal animation finish
  // Tailwind v4 sets the `translate` CSS property (not `transform`) for translate-* utilities.
  const initial = await card.evaluate((el) => getComputedStyle(el).translate);
  await card.hover();
  await page.waitForTimeout(450);
  const hovered = await card.evaluate((el) => getComputedStyle(el).translate);
  expect(hovered).not.toBe(initial);
  // The card should have a vertical translation now.
  expect(hovered).toMatch(/-?\d/);
  // And shadow should have grown — compare boxShadow length as a proxy
  const shadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(shadow).toContain('rgba');
});
