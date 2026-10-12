import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const episodes = JSON.parse(readFileSync('public/episode-visuals/episodes.json', 'utf8')) as Array<{ episode_number: number; slug: string; has_visual?: boolean }>;
const prepared = episodes.filter(episode => episode.has_visual !== false);

test('landing provides a direct podcast path and current catalogue totals', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero').getByRole('link', { name: 'Listen to The Deep End' })).toHaveAttribute('href', '/the-deep-end');
  const latest = page.locator('#latest-work');
  await expect(latest).toContainText(String(episodes.length));
  await expect(latest).toContainText(String(prepared.length));
  await latest.getByRole('link', { name: 'Explore the podcast' }).click();
  await expect(page).toHaveURL(/\/the-deep-end$/);
  await expect(page.locator('#visual-episode option')).toHaveCount(prepared.length);
  const hrefs = await page.locator('a[href^="/the-deep-end/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute('href')))]);
  expect(hrefs).toHaveLength(episodes.length);
});

test('mobile navigation exposes podcast and the project CTA opens a usable form', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Podcast', exact: true })).toHaveAttribute('href', '/the-deep-end');
  await page.keyboard.press('Escape');
  await page.locator('#hero').getByRole('button', { name: 'Scope my project' }).click();
  await expect(page.getByRole('dialog', { name: 'Project enquiry' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scope your next system' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Work email/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#hero').getByRole('button', { name: 'Scope my project' })).toBeFocused();
  // No submission: this check must never send a synthetic lead to the team.
});
