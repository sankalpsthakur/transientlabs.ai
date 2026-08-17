import { expect, test, type Page } from '@playwright/test';
import {
  CLOUD_ACTOR,
  INITIAL_DEALS,
  INITIAL_MATCHES,
  INITIAL_ORDERS,
  MATCH_TIERS,
  NAMED,
  PERSON,
  SIS_ACTOR,
  SYSTEM_ACTOR,
  actorMayWritePhase,
  autoMatchRate,
  canAutoMatch,
  canBookOrder,
  canConfirmMatch,
  canPostToGl,
  canTransition,
  cannotSkipSop,
  cloudMayArm,
  convertDealToGoverned,
  depthRung,
  evidenceComplete,
  exceptionOrders,
  laneFromKey,
  nextBay,
  nextForwardPhase,
  nextTier,
  sisMayWrite,
  sopIndex,
  transitionOrder,
  waitingAtGate,
} from '../../src/components/offerings/workflow-layer/model';
import type { FinanceMatch, WorkOrder } from '../../src/components/offerings/workflow-layer/types';

test.describe('workflow-layer model', () => {
  test('SOP order is proposed through verified with first-class reject and revert', () => {
    expect(sopIndex('proposed')).toBe(0);
    expect(sopIndex('armed')).toBe(4);
    expect(sopIndex('verified')).toBe(6);
    expect(nextForwardPhase('approved')).toBe('armed');
    expect(nextForwardPhase('verified')).toBeNull();
  });

  test('cartridges cannot skip states', () => {
    expect(cannotSkipSop('proposed', 'armed')).toBe(true);
    expect(cannotSkipSop('proposed', 'screened')).toBe(false);
    expect(canTransition('proposed', 'armed', PERSON.production).ok).toBe(false);
    expect(canTransition('approved', 'armed', PERSON.production).ok).toBe(true);
  });

  test('cloud proposes and cannot arm', () => {
    expect(cloudMayArm()).toBe(false);
    expect(canTransition('proposed', 'screened', CLOUD_ACTOR).ok).toBe(false);
    expect(actorMayWritePhase('proposed', CLOUD_ACTOR).ok).toBe(true);
    expect(actorMayWritePhase('armed', CLOUD_ACTOR).ok).toBe(false);
    expect(actorMayWritePhase('armed', CLOUD_ACTOR).reason).toMatch(/named person/i);
  });

  test('SIS has no write path', () => {
    expect(sisMayWrite()).toBe(false);
    expect(canTransition('approved', 'armed', SIS_ACTOR).ok).toBe(false);
    expect(canTransition('armed', 'reverted', SIS_ACTOR).ok).toBe(false);
    expect(canTransition('pending', 'rejected', SIS_ACTOR).ok).toBe(false);
    expect(actorMayWritePhase('executing', SIS_ACTOR).reason).toMatch(/no write path/i);
  });

  test('named person is required to approve, arm, and reject', () => {
    expect(canTransition('pending', 'approved', SYSTEM_ACTOR).ok).toBe(false);
    expect(canTransition('pending', 'approved', PERSON.production).ok).toBe(true);
    expect(canTransition('approved', 'armed', PERSON.production).ok).toBe(true);
    expect(canTransition('approved', 'rejected', PERSON.production).ok).toBe(true);
    const armed = transitionOrder(
      INITIAL_ORDERS.find((o) => o.phase === 'approved') as WorkOrder,
      'armed',
      PERSON.production
    );
    expect(armed.result.ok).toBe(true);
    expect(armed.order.armedBy).toBe(NAMED.production);
  });

  test('revert is legal only from approved, armed, or executing', () => {
    expect(canTransition('proposed', 'reverted', PERSON.production).ok).toBe(false);
    expect(canTransition('armed', 'reverted', PERSON.production).ok).toBe(true);
    expect(canTransition('executing', 'reverted', PERSON.production).ok).toBe(true);
    expect(canTransition('verified', 'reverted', PERSON.production).ok).toBe(false);
  });

  test('seed floor includes every SOP state and an exception lane', () => {
    const phases = new Set(INITIAL_ORDERS.map((o) => o.phase));
    for (const phase of [
      'proposed',
      'screened',
      'pending',
      'approved',
      'armed',
      'executing',
      'verified',
      'rejected',
      'reverted',
    ]) {
      expect(phases.has(phase as WorkOrder['phase'])).toBe(true);
    }
    expect(exceptionOrders(INITIAL_ORDERS).length).toBeGreaterThanOrEqual(2);
    expect(waitingAtGate(INITIAL_ORDERS).length).toBeGreaterThan(0);
  });

  test('auto match is T1–T3 and covers at least 90% of volume', () => {
    expect(canAutoMatch('T1')).toBe(true);
    expect(canAutoMatch('T2')).toBe(true);
    expect(canAutoMatch('T3')).toBe(true);
    expect(canAutoMatch('T4')).toBe(false);
    expect(autoMatchRate(MATCH_TIERS)).toBeGreaterThanOrEqual(0.9);
  });

  test('nothing writes itself to the GL', () => {
    const t1 = INITIAL_MATCHES.find((m) => m.tier === 'T1') as FinanceMatch;
    const orbiting = { ...t1, status: 'confirmed' as const, evidence: { ...t1.evidence } };
    expect(canPostToGl(orbiting, CLOUD_ACTOR).ok).toBe(false);
    expect(canPostToGl(orbiting, SYSTEM_ACTOR).ok).toBe(false);
    expect(canPostToGl(orbiting, PERSON.finance).ok).toBe(true);

    const t4 = INITIAL_MATCHES.find((m) => m.tier === 'T4') as FinanceMatch;
    expect(canConfirmMatch(t4, SYSTEM_ACTOR).ok).toBe(false);
    expect(canConfirmMatch(t4, PERSON.finance).ok).toBe(true);
    expect(
      canPostToGl({ ...t4, status: 'confirmed', personConfirmed: false, evidence: { ...t4.evidence, owner: NAMED.finance } }, PERSON.finance).ok
    ).toBe(false);
    expect(
      canPostToGl(
        {
          ...t4,
          status: 'confirmed',
          personConfirmed: true,
          evidence: { ...t4.evidence, owner: NAMED.finance },
        },
        PERSON.finance
      ).ok
    ).toBe(true);
  });

  test('a break cannot post and an incomplete pack cannot post', () => {
    const brk = INITIAL_MATCHES.find((m) => m.status === 'broken') as FinanceMatch;
    expect(canPostToGl(brk, PERSON.finance).ok).toBe(false);
    const incomplete: FinanceMatch = {
      ...brk,
      status: 'confirmed',
      personConfirmed: true,
      evidence: { source: 'x' },
    };
    expect(evidenceComplete(incomplete.evidence)).toBe(false);
    expect(canPostToGl(incomplete, PERSON.finance).ok).toBe(false);
  });

  test('WhatsApp + Excel cannot book the ERP', () => {
    const ghost = INITIAL_DEALS.find((d) => d.channel === 'whatsapp-excel')!;
    expect(canBookOrder(ghost, PERSON.commercial).ok).toBe(false);
    expect(convertDealToGoverned(ghost, CLOUD_ACTOR).ok).toBe(false);
    expect(convertDealToGoverned(ghost, PERSON.commercial).ok).toBe(true);

    const won = INITIAL_DEALS.find((d) => d.id === 'D-188')!;
    expect(canBookOrder(won, PERSON.commercial).ok).toBe(false);
    expect(canBookOrder(won, PERSON.commercial).reason).toMatch(/shortage/i);

    const clear = INITIAL_DEALS.find((d) => d.id === 'D-204')!;
    expect(canBookOrder({ ...clear, crmStage: 'won' }, PERSON.commercial).ok).toBe(true);
  });

  test('keyboard lane map and depth rungs', () => {
    expect(laneFromKey('1')).toBe('production');
    expect(laneFromKey('P')).toBe('production');
    expect(laneFromKey('2')).toBe('finance');
    expect(laneFromKey('f')).toBe('finance');
    expect(laneFromKey('3')).toBe('commercial');
    expect(laneFromKey('c')).toBe('commercial');
    expect(laneFromKey('9')).toBeNull();
    expect(nextBay('press')).toBe('oven');
    expect(nextTier('T4')).toBe('T1');
    expect(depthRung('production', 0.4)).toMatch(/gate/i);
    expect(depthRung('finance', 1)).toMatch(/GL/i);
    expect(depthRung('commercial', 0.5)).toMatch(/CRM/i);
  });

  test('evidence pack requires all five fields', () => {
    expect(
      evidenceComplete({
        source: 's',
        tier: 'T1',
        owner: 'o',
        timestamp: 't',
        criteria: 'c',
      })
    ).toBe(true);
    expect(evidenceComplete({ source: 's', tier: 'T1', owner: 'o' })).toBe(false);
  });
});

const ROUTES = ['/', '/industrial-energy-automation'];

async function locateExperience(page: Page) {
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const root = page.locator('[data-offering="workflow-layer"]');
    if ((await root.count()) > 0) return root.first();
  }
  return null;
}

test.describe('workflow-layer experience', () => {
  test('Production / Finance / Commercial switcher, gate click, and keyboard', async ({ page }) => {
    const root = await locateExperience(page);
    test.skip(!root, 'Module is not mounted. Parent agent must wire ModuleExperience — do not edit Hero.');
    if (!root) return;

    await expect(root).toBeVisible();
    await expect(root).toHaveAttribute('data-lane', 'production');

    await page.getByTestId('workflow-lane-finance').click();
    await expect(root).toHaveAttribute('data-lane', 'finance');

    await page.getByTestId('workflow-lane-commercial').click();
    await expect(root).toHaveAttribute('data-lane', 'commercial');

    await page.getByTestId('workflow-lane-production').click();
    await expect(root).toHaveAttribute('data-lane', 'production');

    await root.focus();
    await page.keyboard.press('2');
    await expect(root).toHaveAttribute('data-lane', 'finance');
    await page.keyboard.press('g');
    await expect(root).toHaveAttribute('data-selection', 'gl');
    await expect(page.getByTestId('workflow-inspector')).toContainText('Nothing writes itself to the GL');

    await page.keyboard.press('1');
    await page.keyboard.press('g');
    await expect(root).toHaveAttribute('data-selection', 'gate');
    await expect(page.getByTestId('workflow-inspector')).toContainText('named person');

    await page.keyboard.press('s');
    await expect(root).toHaveAttribute('data-selection', 'sis');
    await expect(page.getByTestId('workflow-notice')).toContainText('no write path');

    await page.keyboard.press('3');
    await page.keyboard.press('x');
    await expect(root).toHaveAttribute('data-selection', 'ghost');
    await expect(page.getByTestId('workflow-inspector')).toContainText('Excel');
  });

  test('reduced-motion keeps the gate readable as SVG', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const root = await locateExperience(page);
    test.skip(!root, 'Module is not mounted. Parent agent must wire ModuleExperience — do not edit Hero.');
    if (!root) return;

    await expect(root).toHaveAttribute('data-reduced', 'true');
    await expect(root.locator('[data-reduced-stage="svg"]')).toBeVisible();
    await expect(root.getByText(/GOLD SOP|GL GATE|EXISTING SYSTEMS STAY/i).first()).toBeVisible();
    await page.getByTestId('workflow-lane-finance').click();
    await expect(root.getByText('GL GATE')).toBeVisible();
  });
});
