import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';
import { INITIAL_ALARMS, buildTags } from '../../src/components/offerings/scada-ignition/data';
import {
  PACK_SP_PATH,
  PRESS_CYCLE_PATH,
  SIS_TRIP_PATH,
  createPlantState,
  fieldSnapshot,
  inboundSisExists,
  reducePlant,
  sisWriteBlocked,
  type PlantState,
} from '../../src/components/offerings/scada-ignition/model';

const preview = path.resolve(
  __dirname,
  '../../src/components/offerings/scada-ignition/preview.html',
);
const previewUrl = pathToFileURL(preview).href;
const offeringDir = path.resolve(
  __dirname,
  '../../src/components/offerings/scada-ignition',
);

function plant(): PlantState {
  return createPlantState(buildTags(), INITIAL_ALARMS);
}

test.describe('North Cell plant state machine', () => {
  test('modes degrade monotonically and refuse a silent climb', () => {
    let state = plant();
    expect(state.mode).toBe(0);
    state = reducePlant(state, { type: 'REQUEST_MODE', mode: 2 });
    expect(state.mode).toBe(2);

    state = reducePlant(state, { type: 'REQUEST_MODE', mode: 1 });
    expect(state.mode).toBe(2);
    expect(state.rearmRequired).toBe(true);
    expect(state.audit[0]?.kind).toBe('REARM_REQUIRED');
    expect(state.audit[0]?.allowed).toBe(false);
  });

  test('explicit re-arm climbs one mode when preconditions hold', () => {
    let state = reducePlant(plant(), { type: 'REQUEST_MODE', mode: 2 });
    state = reducePlant(state, { type: 'REARM' });
    expect(state.mode).toBe(1);
    state = reducePlant(state, { type: 'REARM' });
    expect(state.mode).toBe(0);
  });

  test('keyboard-equivalent 0–4 never auto-promotes after a fault', () => {
    let state = reducePlant(plant(), { type: 'KILL_EDGE' });
    expect(state.mode).toBe(3);
    state = reducePlant(state, { type: 'REQUEST_MODE', mode: 0 });
    expect(state.mode).toBe(3);
    state = reducePlant(state, { type: 'RESTORE_EDGE' });
    state = reducePlant(state, { type: 'REQUEST_MODE', mode: 0 });
    expect(state.mode).toBe(3);
    state = reducePlant(state, { type: 'REARM' });
    expect(state.mode).toBe(2);
  });

  test('SIS has no write path from cloud, operator, or SOP token', () => {
    expect(sisWriteBlocked(SIS_TRIP_PATH)).toBe(true);
    expect(inboundSisExists()).toBe(false);

    let state = plant();
    const before = state.tags[SIS_TRIP_PATH]?.value;
    state = reducePlant(state, {
      type: 'ATTEMPT_WRITE',
      path: SIS_TRIP_PATH,
      value: true,
      source: 'cloud',
    });
    expect(state.tags[SIS_TRIP_PATH]?.value).toBe(before);
    expect(state.audit[0]?.kind).toBe('SIS_DENY');

    state = reducePlant(state, {
      type: 'ATTEMPT_WRITE',
      path: SIS_TRIP_PATH,
      value: true,
      source: 'operator',
    });
    expect(state.tags[SIS_TRIP_PATH]?.value).toBe(before);

    state = reducePlant(state, {
      type: 'ATTEMPT_WRITE',
      path: SIS_TRIP_PATH,
      value: true,
      source: 'sop-token',
    });
    expect(state.tags[SIS_TRIP_PATH]?.value).toBe(before);
  });

  test('unsigned cloud cannot move a valve or leased setpoint', () => {
    let state = plant();
    const before = state.tags[PACK_SP_PATH]?.value;
    state = reducePlant(state, {
      type: 'ATTEMPT_WRITE',
      path: PACK_SP_PATH,
      value: 90,
      source: 'cloud',
    });
    expect(state.tags[PACK_SP_PATH]?.value).toBe(before);
    expect(state.audit[0]?.detail).toMatch(/cannot move a valve/i);
  });

  test('approve SOP creates a named token and writes only the leased analogue', () => {
    let state = plant();
    const fieldBefore = fieldSnapshot(state);
    state = reducePlant(state, { type: 'APPROVE_SOP' });
    expect(state.sop.approver).toMatch(/A\. Rao/);
    expect(state.sop.token).toBeTruthy();
    expect(state.sop.phase).toBe('executing');
    expect(state.commandArmed).toBe(true);
    expect(state.tags[PACK_SP_PATH]?.value).toBe(74);
    const fieldAfter = fieldSnapshot(state);
    expect(fieldAfter).toEqual(fieldBefore);
  });

  test('kill-edge crate does not twitch L0/L1 and steps to Mode 3', () => {
    let state = plant();
    const cycle = state.tags[PRESS_CYCLE_PATH]?.value;
    const snap = fieldSnapshot(state);
    state = reducePlant(state, { type: 'KILL_EDGE' });
    expect(state.edgeAlive).toBe(false);
    expect(state.mode).toBe(3);
    expect(state.plantTwitch).toBe(0);
    expect(state.tags[PRESS_CYCLE_PATH]?.value).toBe(cycle);
    expect(fieldSnapshot(state)).toEqual(snap);
    state = reducePlant(state, { type: 'REARM' });
    expect(state.mode).toBe(3);
  });

  test('Mode 4 does not climb from this layer', () => {
    let state = reducePlant(plant(), { type: 'SIS_TRIP' });
    expect(state.mode).toBe(4);
    expect(state.tags[SIS_TRIP_PATH]?.value).toBe(true);
    state = reducePlant(state, { type: 'REARM' });
    expect(state.mode).toBe(4);
    expect(state.audit[0]?.detail).toMatch(/SIS engineering station/i);
  });
});

test.describe('standalone preview', () => {
  test('renders topology, tags, alarms, clamp, and modes', async ({ page }) => {
    await page.goto(previewUrl);
    await expect(page.getByTestId('scada-module')).toBeVisible();
    await expect(page.getByTestId('topology-svg')).toBeVisible();
    await expect(page.getByTestId('tag-browser')).toContainText('PressCell');
    await expect(page.getByTestId('alarm-panel').locator('[data-alarm-state]')).toHaveCount(4);
    await expect(page.getByTestId('clamp-filters')).toContainText('min/max');
    await expect(page.getByTestId('mode-value')).toHaveAttribute('data-mode', '0');
    await expect(page.getByTestId('topology-svg')).toHaveAttribute('data-inbound-sis', 'false');
    await expect(page.getByTestId('sis-island')).toHaveAttribute('data-write-path-sis', 'false');
  });

  test('clicking SIS shows NO WRITE PATH and no inbound conduit', async ({ page }) => {
    await page.goto(previewUrl);
    await page.getByTestId('sis-select').click();
    await expect(page.getByTestId('sis-inspector')).toContainText('NO WRITE PATH');
    await expect(page.getByTestId('sis-inspector')).toHaveAttribute('data-write-path-sis', 'false');
  });

  test('kill edge leaves plant tags still and lands in Mode 3', async ({ page }) => {
    await page.goto(previewUrl);
    await expect(page.getByTestId('tag-browser')).toContainText('18.4 s');
    await page.getByTestId('kill-edge').click();
    await expect(page.getByTestId('scada-module')).toHaveAttribute('data-mode', '3');
    await expect(page.getByTestId('scada-module')).toHaveAttribute('data-plant-twitch', '0');
    await expect(page.getByTestId('tag-browser')).toContainText('18.4 s');
    await expect(page.getByTestId('mode-value')).toContainText('LOCAL-ONLY');
  });

  test('approve SOP signs a token and moves only the leased speed', async ({ page }) => {
    await page.goto(previewUrl);
    await page.getByTestId('approve-sop').click();
    await expect(page.getByTestId('sop-gate')).toContainText('SOP-NC-014');
    await expect(page.getByTestId('sop-gate')).toContainText('A. Rao');
    await expect(page.getByTestId('sop-gate')).toContainText('74 %');
    await expect(page.getByTestId('tag-browser')).toContainText('18.4 s');
  });

  test('keyboard 0–4 degrades and refuses to climb without re-arm', async ({ page }) => {
    await page.goto(previewUrl);
    await page.locator('body').click();
    await page.keyboard.press('3');
    await expect(page.getByTestId('mode-value')).toHaveAttribute('data-mode', '3');
    await page.keyboard.press('0');
    await expect(page.getByTestId('mode-value')).toHaveAttribute('data-mode', '3');
    await page.keyboard.press('s');
    await expect(page.getByTestId('sis-inspector')).toBeVisible();
  });

  test('reduced motion still exposes the labeled topology and gates', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(previewUrl);
    await expect(page.getByTestId('topology-svg')).toBeVisible();
    await expect(page.getByTestId('reduced-fallback')).toHaveCount(1);
    await expect(page.getByTestId('approve-sop')).toBeVisible();
    await expect(page.getByTestId('sis-island')).toContainText('No write path');
    await context.close();
  });
});

test.describe('source contracts', () => {
  test('exports ModuleExperience and never draws an inbound SIS write', () => {
    const indexSrc = readFileSync(path.join(offeringDir, 'index.tsx'), 'utf8');
    const sceneSrc = readFileSync(path.join(offeringDir, 'Scene.tsx'), 'utf8');
    const svgSrc = readFileSync(path.join(offeringDir, 'TopologySvg.tsx'), 'utf8');
    expect(indexSrc).toMatch(/export function ModuleExperience/);
    expect(sceneSrc).toMatch(/NO WRITE/);
    expect(sceneSrc).toMatch(/mirror OUT only/);
    expect(svgSrc).toMatch(/data-inbound-sis="false"/);
    expect(svgSrc).toMatch(/data-write-path-sis="false"/);
    expect(sceneSrc + svgSrc).not.toMatch(/inbound write to SIS/i);
  });

  test('gap doc includes the Ignition one-pager outline', () => {
    const gap = readFileSync(
      path.resolve(__dirname, '../../docs/decks/gaps/03-scada-ignition.md'),
      'utf8',
    );
    expect(gap).toMatch(/Ignition reference one-pager/);
    expect(gap).toMatch(/Ignition Edge/);
    expect(gap).toMatch(/Perspective/);
    expect(gap).toMatch(/North Cell/);
    expect(gap).toMatch(/No inbound arrow to SIS/);
  });
});
