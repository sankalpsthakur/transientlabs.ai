import { expect, test } from '@playwright/test';

test('case-study proof metrics remain explicit and readable', async ({ page }) => {
  await page.goto('/#work');
  const work = page.locator('section#work');
  await expect(work.getByText('$20k', { exact: true })).toBeVisible();
  await expect(work.getByText('67+', { exact: true })).toBeVisible();
  await expect(work.getByText('4+', { exact: true })).toBeVisible();
});
