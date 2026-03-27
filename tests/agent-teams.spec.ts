import { expect, test } from '@playwright/test';

test('agent teams section exposes a readable architecture diagram on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#agent-teams', { waitUntil: 'domcontentloaded' });

  const section = page.locator('#agent-teams');
  const diagram = section.getByLabel(/architecture diagram/i);

  await expect(diagram).toBeVisible();
  await expect(diagram.getByText(/orchestrator factory/i)).toBeVisible();
  await expect(diagram.getByText(/universal data plane/i)).toBeVisible();
  await expect(diagram.getByText(/ai engineering/i)).toBeVisible();
  await expect(diagram.getByText(/systems architecture/i)).toBeVisible();

  const bounds = await diagram.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.width).toBeGreaterThan(480);
  expect(bounds!.height).toBeGreaterThan(420);
});

test('agent teams core layout fits within one desktop viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#agent-teams', { waitUntil: 'domcontentloaded' });

  const layout = page.getByTestId('agent-teams-layout');
  const box = await layout.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.height).toBeLessThanOrEqual(900);
});

test('agent teams diagram layers remain vertically separated', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#agent-teams', { waitUntil: 'domcontentloaded' });

  const diagram = page.locator('#agent-teams').getByLabel(/architecture diagram/i);
  const topLayer = diagram.locator('[data-testid=\"diagram-top-layer\"]');
  const middleLayer = diagram.locator('[data-testid=\"diagram-middle-layer\"]');
  const bottomLayer = diagram.locator('[data-testid=\"diagram-bottom-layer\"]');

  const topBox = await topLayer.boundingBox();
  const middleBox = await middleLayer.boundingBox();
  const bottomBox = await bottomLayer.boundingBox();

  expect(topBox).not.toBeNull();
  expect(middleBox).not.toBeNull();
  expect(bottomBox).not.toBeNull();
  expect(middleBox!.y).toBeGreaterThan(topBox!.y + 20);
  expect(bottomBox!.y).toBeGreaterThan(middleBox!.y + 40);
});
