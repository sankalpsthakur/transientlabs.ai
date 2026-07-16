import { expect, test } from '@playwright/test';

const indexNowKey = '55fddc4df7b4e4a17bc833eb0b25b030';

test('robots advertises the canonical sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBeTruthy();
  await expect(response.text()).resolves.toContain('Sitemap: https://transientlabs.ai/sitemap.xml');
});

test('sitemap contains only canonical, implemented routes', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  expect(urls.length).toBeGreaterThan(150);
  expect(urls).not.toContain('https://transientlabs.ai/solutions');
  expect(urls.every((url) => new URL(url).host === 'transientlabs.ai')).toBeTruthy();
});

test('IndexNow verification key is publicly readable', async ({ request }) => {
  const response = await request.get(`/${indexNowKey}.txt`);
  expect(response.ok()).toBeTruthy();
  expect((await response.text()).trim()).toBe(indexNowKey);
});
