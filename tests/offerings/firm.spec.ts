import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  FIRM_ICP,
  FIRM_INSIGHT,
  FIRM_PRIORS,
  PORTALS,
  SEALS,
  STRATA,
  SYSTEMS,
} from '../../src/components/offerings/firm/constants';

const root = process.cwd();
const firmDir = join(root, 'src/components/offerings/firm');
const gapDoc = join(root, 'docs/decks/gaps/05-corporate-priors.md');
const preview = pathToFileURL(join(firmDir, 'preview.html')).href;

const WEBGL_FILES = [
  'Scene.tsx',
  'ControlSlab.tsx',
  'LongExposureRings.tsx',
  'SystemChips.tsx',
  'PortalRings.tsx',
  'FirmCanvas.tsx',
];

function readFirm(file: string) {
  return readFileSync(join(firmDir, file), 'utf8');
}

test('exports ModuleExperience from the firm offering index', () => {
  const index = readFirm('index.tsx');
  expect(index).toMatch(/export \{ ModuleExperience \}/);
  expect(readFirm('ModuleExperience.tsx')).toMatch(
    /export function ModuleExperience/
  );
});

test('gap doc has slide-level holes plus ICP and Evidence of execution copy', () => {
  const doc = readFileSync(gapDoc, 'utf8');
  expect(doc).toMatch(/Slide inventory/);
  expect(doc).toMatch(/Insert 1 — ICP slide/);
  expect(doc).toMatch(/Insert 2 — Evidence of execution slide/);
  expect(doc).toMatch(/promoter-led/i);
  expect(doc).toMatch(/₹100–2,000 Cr/);
  expect(doc).toMatch(/Synapse/);
  expect(doc).toMatch(/Visusta/);
  expect(doc).toMatch(/RenewCred \/ WasteX/);
  expect(doc).toMatch(/Emtribe/);
  expect(doc).toMatch(/Multi-agent finance/);
  expect(doc).toMatch(/Long Exposure/);
});

test('WebGL sculpture stays free of faces, PII, logos, and confidential figures', () => {
  const banned = [
    /aadhaar/i,
    /\bPAN\b/,
    /avatars\.githubusercontent/,
    /team-shivam/,
    /\.svg/,
    /climitra\.svg/,
    /visusta\.png/,
    /\$\d/,
    /₹\d/,
  ];
  for (const file of WEBGL_FILES) {
    const src = readFirm(file);
    for (const pattern of banned) {
      expect(src, `${file} must not contain ${pattern}`).not.toMatch(pattern);
    }
    expect(src, `${file} must not import sibling offerings`).not.toMatch(
      /offerings\/(dmrv|workflow-layer|scada-ignition|energy-audit)/
    );
  }
});

test('priors live in HTML constants, not the WebGL scene', () => {
  const scene = readFirm('Scene.tsx');
  for (const prior of FIRM_PRIORS) {
    expect(scene).not.toContain(prior.name);
  }
  const overlay = readFirm('Overlay.tsx');
  expect(overlay).toContain('FIRM_PRIORS');
  expect(FIRM_PRIORS.map((item) => item.name)).toEqual([
    'Synapse',
    'Visusta',
    'RenewCred / WasteX',
    'Climitra',
    'Hygenco',
    'Emtribe',
    'Multi-agent finance',
  ]);
});

test('nucleus source names the slab, five systems, three rings, portals, and seals', () => {
  const all = readdirSync(firmDir)
    .filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
    .map(readFirm)
    .join('\n');
  for (const stratum of STRATA) {
    expect(all).toContain(stratum.label);
  }
  for (const sys of SYSTEMS) {
    expect(all).toContain(sys.label);
  }
  for (const portal of PORTALS) {
    expect(all).toContain(portal.label);
  }
  for (const seal of SEALS) {
    expect(all).toContain(seal.label);
  }
  expect(all).toMatch(/RING_OMEGA/);
  expect(all).toContain(FIRM_INSIGHT);
  expect(all).toContain(FIRM_ICP.range);
});

test('standalone preview exposes the interactive firm HUD', async ({ page }) => {
  await page.goto(preview);
  const stage = page.locator('[data-firm-experience]');
  await expect(stage).toBeVisible();
  await expect(page.locator('[data-firm-fallback]')).toHaveCount(1);
  await expect(page.locator('[data-firm-overlay]')).toBeVisible();

  await expect(page.locator('[data-firm-seal]')).toHaveCount(3);
  await expect(page.locator('[data-firm-system]')).toHaveCount(5);
  await expect(page.locator('[data-firm-stratum]')).toHaveCount(4);
  await expect(page.locator('[data-firm-portal]')).toHaveCount(3);
  await expect(page.locator('[data-firm-prior]')).toHaveCount(7);
  await expect(page.locator('[data-firm-ring]')).toHaveCount(3);
  await expect(page.locator('[data-firm-icp]')).toContainText('₹100–2,000 Cr');
  await expect(page.locator('[data-firm-insight]')).toContainText(
    'The gap is not another tool'
  );

  await page.locator('[data-firm-portal="plant"]').click();
  await expect(page.locator('[data-firm-portal="plant"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.locator('[data-firm-insight]')).toContainText(
    'SIS never waits'
  );
  await expect(page.locator('[data-firm-stage]')).toContainText('PLANT LOOP');

  await stage.focus();
  await page.keyboard.press('2');
  await expect(page.locator('[data-firm-portal="finance"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.locator('[data-firm-insight]')).toContainText(
    'controller posts'
  );

  await page.keyboard.press('Escape');
  await expect(page.locator('[data-firm-insight]')).toContainText(
    'The gap is not another tool'
  );
});

test('preview stays inside a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(preview);
  const overflow = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.width + 1);
});
