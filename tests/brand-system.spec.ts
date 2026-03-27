import { expect, test } from '@playwright/test';
import { siteBrand } from '../src/lib/site-brand';

const brandLockupPath = siteBrand.assets.lockup.light;
const appleTouchIconPath = siteBrand.assets.favicon.appleTouchIcon;
const faviconPath = siteBrand.assets.favicon.ico;
const manifestPath = '/site.webmanifest';
const ogImagePath = siteBrand.assets.social.ogDefault;
const twitterImagePath = siteBrand.assets.social.twitterDefault;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pathAttributeRegex(assetPath: string) {
  return new RegExp(`${escapeRegex(assetPath)}(?:\\?.*)?$`);
}

test('header uses a compact brand lockup without wrapping', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const headerLogo = page.locator('header').getByRole('img', { name: /transient labs logo/i });
  await expect(headerLogo).toBeVisible();
});

test('footer uses the approved brand lockup and tagline', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const footer = page.locator('footer');
  await expect(footer.getByRole('img', { name: /transient labs logo/i })).toBeVisible();
  await expect(footer).toContainText(siteBrand.tagline);
});

test('manifest and metadata point to production brand assets', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', pathAttributeRegex(manifestPath));
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    pathAttributeRegex(appleTouchIconPath),
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    pathAttributeRegex(ogImagePath),
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    pathAttributeRegex(twitterImagePath),
  );

  const iconHrefs = await page
    .locator('link[rel="icon"]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href') ?? ''));
  expect(iconHrefs.some((href) => pathAttributeRegex(faviconPath).test(href))).toBeTruthy();

  const manifestResponse = await page.request.get(manifestPath);
  expect(manifestResponse.ok()).toBeTruthy();

  const manifest = await manifestResponse.json();
  expect(manifest).toMatchObject({
    name: siteBrand.name,
    short_name: 'Transient',
    description: `${siteBrand.descriptor}. ${siteBrand.tagline}.`,
    icons: [
      { src: siteBrand.assets.favicon.icon192, sizes: '192x192', type: 'image/png' },
      { src: siteBrand.assets.favicon.icon512, sizes: '512x512', type: 'image/png' },
    ],
  });

  for (const assetPath of [brandLockupPath, appleTouchIconPath, faviconPath, ogImagePath, twitterImagePath]) {
    const response = await page.request.get(assetPath);
    expect(response.ok(), `${assetPath} should be served successfully`).toBeTruthy();
  }
});

test('header brand lockup stays within the desktop header bounds', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const header = page.locator('header');
  const logo = header.getByRole('img', { name: /transient labs logo/i });

  const headerBox = await header.boundingBox();
  const logoBox = await logo.boundingBox();

  expect(headerBox).not.toBeNull();
  expect(logoBox).not.toBeNull();
  expect(logoBox!.width).toBeLessThan(headerBox!.width / 2);
});

test('mobile header still exposes the brand clearly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('header').getByRole('img', { name: /transient labs logo/i })).toBeVisible();
});
