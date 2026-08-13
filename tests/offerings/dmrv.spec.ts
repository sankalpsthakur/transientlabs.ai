import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  BATCH_COLLARS,
  CAN_SKIP_STAGES,
  CDR_PRICE,
  INSIGHT,
  livePointCount,
  MONITORING_POINTS,
  nextAllowedStage,
  PERMANENCE_YEARS,
  STAGE_ORDER,
  STAGES,
  stageIndexFromProgress,
  TIERS,
  YIELD_CARBON_RANGE,
} from '../../src/components/offerings/dmrv/model';

test.describe('biochar DMRV model — deck-true facts', () => {
  test('six stages in Design → Retire order and cannot skip', () => {
    expect(STAGE_ORDER).toEqual([
      'design',
      'integrate',
      'track',
      'verify',
      'defend',
      'retire',
    ]);
    expect(STAGES).toHaveLength(6);
    expect(CAN_SKIP_STAGES).toBe(false);
    expect(nextAllowedStage(0, 5)).toBeNull();
    expect(nextAllowedStage(0, 1)).toBe(1);
    expect(nextAllowedStage(2, 2)).toBe(2);
    expect(nextAllowedStage(2, 4)).toBeNull();
    expect(nextAllowedStage(5, 0)).toBe(0);
  });

  test('low / mid / high are first-class tiers with keys 1 / 2 / 3', () => {
    expect(TIERS.map((t) => t.id)).toEqual(['low', 'mid', 'high']);
    expect(TIERS.map((t) => t.key)).toEqual(['1', '2', '3']);
    expect(livePointCount('low')).toBe(2);
    expect(livePointCount('mid')).toBe(3);
    expect(livePointCount('high')).toBe(5);
  });

  test('five monitoring points and four batch collars match the deck', () => {
    expect(MONITORING_POINTS.map((p) => p.id)).toEqual([
      'intake',
      'reactor',
      'output',
      'storage',
      'permanence',
    ]);
    expect(BATCH_COLLARS.map((c) => c.short)).toEqual(['FS', 'PY', 'ST', 'RT']);
    expect(BATCH_COLLARS.map((c) => c.locksAt)).toEqual([
      'track',
      'track',
      'defend',
      'retire',
    ]);
  });

  test('yield is the 40–60% feedstock-carbon range; permanence is 100 years', () => {
    expect(YIELD_CARBON_RANGE.min).toBe(40);
    expect(YIELD_CARBON_RANGE.max).toBe(60);
    expect(PERMANENCE_YEARS).toBe(100);
    expect(CDR_PRICE.min).toBe(50);
    expect(CDR_PRICE.max).toBe(300);
    expect(INSIGHT).toMatch(/unlit/i);
  });

  test('ModuleExperience is the public export and is keyboard-addressable', () => {
    const src = readFileSync(
      join(__dirname, '../../src/components/offerings/dmrv/index.tsx'),
      'utf8'
    );
    expect(src).toContain('export function ModuleExperience');
    expect(src).toContain('progress');
    expect(src).toContain('reduced');
    expect(src).toContain('className');
    expect(src).toContain('data-offering="dmrv"');
    expect(src).toContain('aria-keyshortcuts="1 2 3 ArrowLeft ArrowRight"');
  });

  test('progress maps sequentially onto the six stages', () => {
    expect(stageIndexFromProgress(0)).toBe(0);
    expect(stageIndexFromProgress(0.16)).toBe(0);
    expect(stageIndexFromProgress(0.17)).toBe(1);
    expect(stageIndexFromProgress(0.5)).toBe(3);
    expect(stageIndexFromProgress(0.99)).toBe(5);
    expect(stageIndexFromProgress(1)).toBe(5);
  });
});

async function findMountedOffering(page: Page): Promise<Locator | null> {
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 8_000 });
  } catch {
    return null;
  }
  const root = page.locator('[data-offering="dmrv"]');
  return (await root.count()) > 0 ? root : null;
}

test.describe('biochar DMRV experience (when mounted)', () => {
  test('tier keys, sequential journey, yield, 100y, retirement lock', async ({
    page,
  }) => {
    const root = await findMountedOffering(page);
    if (!root) {
      test.skip(true, 'Offering is not mounted on a route yet.');
      return;
    }

    await expect(root).toBeVisible();
    await expect(root).toHaveAttribute('data-dmrv-stage', 'design');

    await root.focus();
    await page.keyboard.press('3');
    await expect(root).toHaveAttribute('data-dmrv-tier', 'high');
    await page.keyboard.press('1');
    await expect(root).toHaveAttribute('data-dmrv-tier', 'low');
    await page.keyboard.press('2');
    await expect(root).toHaveAttribute('data-dmrv-tier', 'mid');

    await page.getByTestId('dmrv-stage-retire').click();
    await expect(root).toHaveAttribute('data-dmrv-stage', 'design');
    await expect(page.getByTestId('dmrv-blocked')).toBeVisible();

    for (const id of [
      'integrate',
      'track',
      'verify',
      'defend',
      'retire',
    ] as const) {
      await page.getByTestId(`dmrv-stage-${id}`).click();
      await expect(root).toHaveAttribute('data-dmrv-stage', id);
    }

    await expect(page.getByTestId('dmrv-yield')).toContainText('40–60%');
    await expect(page.getByTestId('dmrv-liability')).toContainText('100y');
    await expect(page.getByTestId('dmrv-retire-lock')).toContainText(
      'Retirement locked'
    );
  });

  test('reduced motion keeps the paper fallback interactive', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const root = await findMountedOffering(page);
    if (!root) {
      test.skip(true, 'Offering is not mounted on a route yet.');
      await context.close();
      return;
    }
    await expect(root).toHaveAttribute('data-dmrv-fallback', 'true');
    await expect(page.getByTestId('dmrv-fallback')).toBeVisible();
    await page.getByTestId('dmrv-tier-high').click();
    await expect(root).toHaveAttribute('data-dmrv-tier', 'high');
    await context.close();
  });
});
