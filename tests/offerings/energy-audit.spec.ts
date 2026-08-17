import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  DELIVERABLES,
  ENGAGEMENT,
  HANDOFF,
  HOTSPOTS,
  METHOD_WEEKS,
  OPPORTUNITIES,
  PAYBACK,
  SOPS,
  STAGES,
  hotspotById,
  opportunityFor,
  paybackChip,
  progressForStage,
  sopFor,
  stageFromProgress,
  tagCounts,
} from '../../src/components/offerings/energy-audit/playbook';

const ROOT = path.resolve(__dirname, '../..');

test.describe('energy audit playbook', () => {
  test('productizes seven stages from bills to Ignition', () => {
    expect(STAGES.map((s) => s.id)).toEqual([
      'bills',
      'hotspots',
      'opportunities',
      'tags',
      'clamps',
      'sops',
      'handoff',
    ]);
    expect(STAGES).toHaveLength(7);
    expect(METHOD_WEEKS).toHaveLength(4);
    expect(DELIVERABLES.map((d) => d.id)).toEqual(['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7']);
  });

  test('maps every hotspot to tags, clamp, owner, opportunity, and SOP', () => {
    expect(HOTSPOTS.map((h) => h.id)).toEqual(['compressor', 'kiln', 'hvac', 'line']);

    for (const hot of HOTSPOTS) {
      expect(hot.owner.length).toBeGreaterThan(4);
      expect(hot.tags.length).toBeGreaterThanOrEqual(5);
      expect(hot.tags.some((t) => t.kind === 'proposed')).toBeTruthy();
      expect(hot.tags.every((t) => t.unit && t.path.startsWith('PLB/'))).toBeTruthy();
      expect(hot.clamp.write).toBe('analogue-sp');
      expect(hot.clamp.min).toBeLessThan(hot.clamp.max);
      expect(hot.clamp.nominal).toBeGreaterThanOrEqual(hot.clamp.min);
      expect(hot.clamp.nominal).toBeLessThanOrEqual(hot.clamp.max);
      expect(opportunityFor(hot.id).hotspot).toBe(hot.id);
      expect(sopFor(hot.id).hotspot).toBe(hot.id);
      expect(sopFor(hot.id).state).toBe('proposed');
    }
  });

  test('keeps SOPs advisory and the Ignition write path empty', () => {
    expect(SOPS.every((s) => s.state === 'proposed')).toBeTruthy();
    expect(SOPS.every((s) => /sis/i.test(s.sisNote))).toBeTruthy();
    expect(HANDOFF.writePath).toBe('none');
    expect(HANDOFF.mode).toBe('observe + buffer');
    expect(HANDOFF.destination.toLowerCase()).toContain('ignition');
  });

  test('labels every payback chip illustrative', () => {
    expect(PAYBACK.label).toBe('illustrative');
    expect(PAYBACK.disclaimer.toLowerCase()).toContain('illustrative');
    expect(ENGAGEMENT.priceUsd).toBe(40000);
    expect(ENGAGEMENT.deckPriceUsd).toBe(30000);

    for (const stage of STAGES) {
      for (const hot of HOTSPOTS) {
        const chip = paybackChip(stage.id, hot.id);
        expect(chip.caption.toLowerCase()).toContain('illustrative');
      }
    }
  });

  test('covers the four opportunity bands with evidence and owners', () => {
    expect(OPPORTUNITIES).toHaveLength(4);
    const [lo, hi] = PAYBACK.opportunityBandUsdYr;
    const sumLo = OPPORTUNITIES.reduce((n, o) => n + o.bandUsdYr[0], 0);
    const sumHi = OPPORTUNITIES.reduce((n, o) => n + o.bandUsdYr[1], 0);
    expect(sumLo).toBe(lo);
    expect(sumHi).toBe(hi);
    for (const opp of OPPORTUNITIES) {
      expect(opp.evidence.length).toBeGreaterThan(20);
      expect(opp.assumption.length).toBeGreaterThan(10);
      expect(opp.dependency.length).toBeGreaterThan(8);
      expect(opp.owner).toBe(hotspotById(opp.hotspot).owner);
    }
  });

  test('counts the Sparkplug-style dictionary', () => {
    const counts = tagCounts();
    expect(counts.total).toBe(27);
    expect(counts.existing).toBe(15);
    expect(counts.proposed).toBe(9);
    expect(counts.virtual).toBe(3);
  });

  test('maps scroll progress onto the seven stages', () => {
    expect(stageFromProgress(0)).toBe('bills');
    expect(stageFromProgress(progressForStage('clamps'))).toBe('clamps');
    expect(stageFromProgress(0.99)).toBe('handoff');
    expect(stageFromProgress(2)).toBe('handoff');
    expect(stageFromProgress(-1)).toBe('bills');
  });
});

test.describe('energy audit module contract', () => {
  test('exports ModuleExperience and a standalone preview', () => {
    const src = readFileSync(
      path.join(ROOT, 'src/components/offerings/energy-audit/index.tsx'),
      'utf8'
    );
    expect(src).toMatch(/export function ModuleExperience/);
    expect(src).toMatch(/export function EnergyAuditPreview/);
    expect(src).toMatch(/data-offering="energy-audit"/);
    expect(src).toContain("from './Overlay'");
    expect(src).toContain("from './MicroZoom'");
    expect(src).toContain("from './Scene'");
  });

  test('gap doc productizes method, mapping, payback, and the Ignition packet', () => {
    const doc = readFileSync(path.join(ROOT, 'docs/decks/gaps/04-energy-audit.md'), 'utf8');
    expect(doc).toMatch(/\$40,000/);
    expect(doc).toMatch(/tag dictionary/i);
    expect(doc).toMatch(/Clamp/);
    expect(doc).toMatch(/SOP-EA-014/);
    expect(doc).toMatch(/illustrative/i);
    expect(doc).toMatch(/observe-only/);
    expect(doc).toMatch(/PLB\/UTIL\/CA\/HDR\/SP/);
  });
});

test.describe('energy audit folio interaction contract', () => {
  test('wires hotspot extract, payback chip, reduced-motion, and keyboard', () => {
    const index = readFileSync(path.join(ROOT, 'src/components/offerings/energy-audit/index.tsx'), 'utf8');
    const plant = readFileSync(
      path.join(ROOT, 'src/components/offerings/energy-audit/PlantDrawing.tsx'),
      'utf8'
    );
    const zoom = readFileSync(
      path.join(ROOT, 'src/components/offerings/energy-audit/MicroZoom.tsx'),
      'utf8'
    );
    const overlay = readFileSync(
      path.join(ROOT, 'src/components/offerings/energy-audit/Overlay.tsx'),
      'utf8'
    );

    expect(index).toMatch(/data-offering="energy-audit"/);
    expect(index).toMatch(/data-reduced/);
    expect(index).toMatch(/ArrowRight/);
    expect(index).toMatch(/useReducedMotion/);
    expect(plant).toMatch(/data-hotspot=\{h\.id\}/);
    expect(overlay).toMatch(/data-payback/);
    expect(overlay).toMatch(/role="tablist"/);
    expect(zoom).toMatch(/data-microzoom/);
    expect(zoom).toMatch(/data-ea-plate/);
    expect(zoom).toMatch(/proposed tags, clamp band, and owner/);
    expect(zoom).toMatch(/analogue SP only/);
  });
});

if (process.env.EA_FOLIO_E2E === '1') {
  test.describe('energy audit folio (mounted host)', () => {
    test('stage rail, hotspot extract, and illustrative payback are interactive', async ({
      page,
    }) => {
      await page.goto(process.env.EA_FOLIO_PATH || '/industrial-energy-automation', {
        waitUntil: 'domcontentloaded',
      });
      const folio = page.locator('[data-offering="energy-audit"]');
      await expect(folio).toBeVisible();
      await expect(folio.getByRole('tab', { name: /map/i })).toBeVisible();
      await expect(folio.locator('[data-payback]')).toContainText(/illustrative/i);

      await folio.getByRole('button', { name: /compressor hall/i }).click();
      await expect(folio.locator('[data-microzoom]')).toContainText(/PLB\/UTIL\/CA/i);
      await expect(folio.locator('[data-ea-plate]')).toContainText(/6\.6–7\.8/);

      await folio.getByRole('tab', { name: /clamps/i }).click();
      await expect(folio).toHaveAttribute('data-stage', 'clamps');
      await expect(folio.locator('[data-microzoom]')).toContainText(/analogue SP only/i);

      await folio.getByRole('tab', { name: /ignition/i }).click();
      await expect(folio.locator('[data-microzoom]')).toContainText(/observe only/i);
    });
  });
}
