import { expect, test } from '@playwright/test';

test('case studies section exposes selectable projects and updates the active detail panel', async ({ page }) => {
  await page.goto('/');

  const workSection = page.locator('#work');
  await expect(workSection).toBeVisible();

  await expect(workSection.getByRole('tablist', { name: /case study selector/i })).toBeVisible();
  await expect(workSection.getByRole('tab', { name: /batch evidence loop/i })).toHaveCount(1);
  await expect(workSection.getByRole('tab', { name: /energy measure loop/i })).toHaveCount(1);
  await expect(workSection.getByRole('tabpanel', { name: /batch evidence loop/i })).toBeVisible();

  await workSection.getByRole('tab', { name: /carbon assurance desk/i }).click();
  await expect(workSection.getByRole('tabpanel', { name: /carbon assurance desk/i })).toBeVisible();
  await expect(workSection.getByText('ESRS-ready', { exact: true })).toBeVisible();
});

test('desktop case studies gallery fits the active panel and selectors within one viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#work');

  const workSection = page.locator('#work');
  const panel = workSection.getByRole('tabpanel');
  const tablist = workSection.getByRole('tablist', { name: /case study selector/i });

  await panel.scrollIntoViewIfNeeded();

  const panelBox = await panel.boundingBox();
  const tablistBox = await tablist.boundingBox();
  const viewport = page.viewportSize();

  expect(panelBox).not.toBeNull();
  expect(tablistBox).not.toBeNull();
  expect(viewport).not.toBeNull();

  const lowestVisibleEdge = Math.max(
    (panelBox?.y ?? 0) + (panelBox?.height ?? 0),
    (tablistBox?.y ?? 0) + (tablistBox?.height ?? 0),
  );

  expect(panelBox?.y ?? 0).toBeGreaterThanOrEqual(0);
  expect(Math.ceil(lowestVisibleEdge)).toBeLessThanOrEqual((viewport?.height ?? 0) + 2);
});

test('desktop active case panel dedicates the hero viewport to the main screenshot only', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#work');

  const workSection = page.locator('#work');
  const panel = workSection.getByRole('tabpanel');

  await panel.scrollIntoViewIfNeeded();
  await expect(panel.locator('img')).toHaveCount(1);
});
