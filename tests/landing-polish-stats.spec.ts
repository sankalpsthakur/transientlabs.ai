import { expect, test } from '@playwright/test';

test('case-study stats animate from a lower value to the final value', async ({ page }) => {
  await page.goto('/#work');
  const stats = page.locator('section#work').getByText(/\$20k|67\+|4\+/);
  await stats.first().scrollIntoViewIfNeeded();
  const sample = await stats.first().innerText();
  await page.waitForTimeout(1400);
  const final = await stats.first().innerText();
  expect(final).toMatch(/\$20k|67\+|4\+/);
  expect(sample).not.toBe(final);
});
