import { expect, test } from '@playwright/test';

test('mobile navigation closes after choosing pricing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const toggle = page.getByRole('button', { name: 'Toggle menu' });
  await page.waitForFunction(() => {
    const button = document.querySelector<HTMLButtonElement>('button[aria-label="Toggle menu"]');
    return !!button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
  });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-navigation a[href="#services"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
});

test('industrial engagement exposes price, artifacts, inputs, and safety boundary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/industrial-energy-automation', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('heading', { level: 1 })).toContainText('See the losses');
  await expect(page.getByText('$40,000', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('What leaves the room at week four.')).toBeVisible();
  await expect(page.getByText('Automation does not erase authority.')).toBeVisible();
  await expect(page.getByText('Minimum useful inputs')).toBeVisible();

  const overflow = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.width + 1);
});

for (const route of ['/stack/satellites', '/stack/data-centers', '/stack/nuclear', '/stack/batteries', '/stack/autonomous-vehicles']) {
  test(`${route} keeps copy inside a mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const section = page.locator('[data-module]').first();
    const title = section.getByRole('heading', { level: 2 }).first();
    await expect(title).toBeVisible();
    const box = await title.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    const overflow = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.width + 1);
  });
}

for (const route of ['/stack/satellites', '/stack/data-centers', '/stack/nuclear', '/stack/batteries', '/stack/autonomous-vehicles']) {
  test(`${route} uses a full-bleed desktop stage behind translucent copy`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const section = page.locator('[data-module]').first();
    const stage = section.locator('[data-full-bleed="true"]').first();
    const copy = section.locator('[data-stack-copy-card]');
    await expect(stage).toBeVisible();
    await expect(copy).toBeVisible();
    const stageBox = await stage.boundingBox();
    const copyBox = await copy.boundingBox();
    expect(stageBox).not.toBeNull();
    expect(copyBox).not.toBeNull();
    expect(stageBox!.width).toBeGreaterThanOrEqual(1400);
    expect(stageBox!.height).toBeGreaterThanOrEqual(880);
    expect(copyBox!.x).toBeGreaterThan(stageBox!.x);
    expect(copyBox!.x + copyBox!.width).toBeLessThan(stageBox!.x + stageBox!.width);
  });
}

test('mobile keeps copy before the contained 3D stage', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/stack/satellites', { waitUntil: 'domcontentloaded' });
  const section = page.locator('[data-module]').first();
  const copy = section.locator('[data-stack-copy-card]');
  const stage = section.locator('[data-full-bleed="true"]').first();
  const copyBox = await copy.boundingBox();
  const stageBox = await stage.boundingBox();
  expect(copyBox).not.toBeNull();
  expect(stageBox).not.toBeNull();
  expect(copyBox!.y).toBeLessThan(stageBox!.y);
  expect(stageBox!.width).toBeLessThanOrEqual(350);
});

test('integrated stack keeps each module scroll runway concise', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/stack', { waitUntil: 'domcontentloaded' });
  const sections = page.locator('[data-module]');
  await expect(sections).toHaveCount(5);
  for (const section of await sections.all()) {
    const box = await section.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeLessThanOrEqual(1800);
  }
});

for (const route of ['/stack/satellites', '/stack/data-centers', '/stack/nuclear']) {
  test(`${route} exposes an enterprise decision brief without overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const brief = page.locator('[data-enterprise-brief]');
    await expect(brief.getByText('Enterprise decision brief')).toBeVisible();
    await expect(brief.getByText('Operating model')).toBeVisible();
    await expect(brief.getByText('Decision artifacts')).toBeVisible();
    await expect(brief.getByText('Diligence questions')).toBeVisible();
    const overflow = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.width + 1);
  });
}
