import { expect, test } from '@playwright/test';

test.describe('homepage offering stages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mounts #offerings on /', async ({ page }) => {
    await expect(page.locator('#offerings')).toBeVisible();
  });

  test('keeps #industries visible after offerings', async ({ page }) => {
    const offerings = page.locator('#offerings');
    const industries = page.locator('#industries');

    await expect(offerings).toBeVisible();
    await expect(industries).toBeVisible();
    await expect(industries.locator('article')).toHaveCount(4);

    const industriesFollowsOfferings = await page.evaluate(() => {
      const offeringsEl = document.getElementById('offerings');
      const industriesEl = document.getElementById('industries');
      if (!offeringsEl || !industriesEl) return false;
      return Boolean(
        offeringsEl.compareDocumentPosition(industriesEl) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });

    expect(industriesFollowsOfferings).toBe(true);
  });

  test('hero still shows engineer or client logo images', async ({ page }) => {
    const hero = page.locator('#hero');
    const logos = hero.getByRole('img', {
      name: /IIT Bombay|Stanford|WorldQuant|OpenAI|Climitra|Visusta|Alan Scott|Satwik/,
    });

    await expect(logos.first()).toBeVisible();
  });
});
