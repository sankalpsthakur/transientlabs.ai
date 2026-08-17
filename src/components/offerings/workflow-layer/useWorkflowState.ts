'use client';

import { motionValue, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  actorForAdvance,
  brokenMatches,
  canBookOrder,
  canConfirmMatch,
  canPostToGl,
  canTransition,
  CLOUD_ACTOR,
  convertDealToGoverned,
  exceptionOrders,
  INITIAL_DEALS,
  INITIAL_MATCHES,
  INITIAL_ORDERS,
  laneFromKey,
  NAMED,
  nextBay,
  nextCrm,
  nextForwardPhase,
  nextMrp,
  nextStratum,
  nextSystem,
  nextTier,
  nextWorkflow,
  PERSON,
  prevForwardPhase,
  SYSTEM_ACTOR,
  transitionOrder,
  waitingAtGate,
} from './model';
import type {
  ActionResult,
  BayId,
  CommercialDeal,
  FinanceMatch,
  Lane,
  Selection,
  WorkOrder,
  WorkflowApi,
} from './types';

const IDLE = motionValue(0.36);

function cloneOrders(): WorkOrder[] {
  return INITIAL_ORDERS.map((o) => ({ ...o }));
}
function cloneMatches(): FinanceMatch[] {
  return INITIAL_MATCHES.map((m) => ({ ...m, evidence: { ...m.evidence } }));
}
function cloneDeals(): CommercialDeal[] {
  return INITIAL_DEALS.map((d) => ({ ...d, evidence: { ...d.evidence } }));
}

export function useWorkflowState({
  progress,
  initialLane = 'production',
  freeze = false,
  onLaneChange,
}: {
  progress?: MotionValue<number>;
  initialLane?: Lane;
  freeze?: boolean;
  onLaneChange?: (lane: Lane) => void;
}): WorkflowApi {
  const [lane, setLaneState] = useState<Lane>(initialLane);
  const [selection, setSelection] = useState<Selection>(null);
  const [orders, setOrders] = useState<WorkOrder[]>(cloneOrders);
  const [matches, setMatches] = useState<FinanceMatch[]>(cloneMatches);
  const [deals, setDeals] = useState<CommercialDeal[]>(cloneDeals);
  const [notice, setNotice] = useState<string | null>(null);
  const [depth, setDepthState] = useState(() =>
    freeze ? 0.42 : progress ? progress.get() : 0.18
  );
  const [helpOpen, setHelpOpen] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const userDepth = useRef(false);
  const proposeSeq = useRef(4830);

  const flash = useCallback((result: ActionResult) => {
    setNotice(result.reason);
    return result;
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 3600);
    return () => window.clearTimeout(id);
  }, [notice]);

  const setLane = useCallback(
    (next: Lane) => {
      setLaneState(next);
      setSelection(null);
      onLaneChange?.(next);
      setInteracting(true);
    },
    [onLaneChange]
  );

  const select = useCallback((next: Selection) => {
    setSelection(next);
    setInteracting(true);
  }, []);

  const setDepth = useCallback((n: number) => {
    userDepth.current = true;
    setDepthState(n < 0 ? 0 : n > 1 ? 1 : n);
    setInteracting(true);
  }, []);

  useMotionValueEvent(progress ?? IDLE, 'change', (value) => {
    if (!progress || userDepth.current) return;
    setDepthState(value);
  });

  const selectedOrder = useCallback((): WorkOrder | undefined => {
    if (selection?.kind === 'cartridge') {
      return orders.find((o) => o.id === selection.id);
    }
    if (selection?.kind === 'exception') {
      return orders.find((o) => o.id === selection.id);
    }
    if (selection?.kind === 'bay' || selection?.kind === 'torus') {
      return (
        orders.find((o) => o.bay === selection.id && o.phase === 'executing') ??
        orders.find((o) => o.bay === selection.id && o.phase === 'armed') ??
        orders.find((o) => o.bay === selection.id)
      );
    }
    if (selection?.kind === 'gate') {
      return waitingAtGate(orders)[0] ?? orders.find((o) => o.phase === 'approved');
    }
    return undefined;
  }, [orders, selection]);

  const selectedMatch = useCallback((): FinanceMatch | undefined => {
    if (selection?.kind === 'match' || selection?.kind === 'break') {
      return matches.find((m) => m.id === selection.id);
    }
    if (selection?.kind === 'tier') {
      return (
        matches.find((m) => m.tier === selection.id && m.status === 'broken') ??
        matches.find((m) => m.tier === selection.id)
      );
    }
    if (selection?.kind === 'workflow') {
      return matches.find((m) => m.workflow === selection.id);
    }
    if (selection?.kind === 'gl' || selection?.kind === 'evidence') {
      return matches.find((m) => m.status === 'confirmed') ?? matches[0];
    }
    return undefined;
  }, [matches, selection]);

  const selectedDeal = useCallback((): CommercialDeal | undefined => {
    if (selection?.kind === 'deal') return deals.find((d) => d.id === selection.id);
    if (selection?.kind === 'ghost') return deals.find((d) => d.channel === 'whatsapp-excel');
    if (selection?.kind === 'crm-stage') {
      return deals.find((d) => d.crmStage === selection.id) ?? deals[0];
    }
    return deals.find((d) => d.channel === 'governed');
  }, [deals, selection]);

  const patchOrder = useCallback((id: string, to: Parameters<typeof transitionOrder>[1], actor: Parameters<typeof transitionOrder>[2]) => {
    let result: ActionResult = { ok: false, reason: 'Cartridge not found.' };
    setOrders((cur) =>
      cur.map((o) => {
        if (o.id !== id) return o;
        const next = transitionOrder(o, to, actor);
        result = next.result;
        return next.order;
      })
    );
    return result;
  }, []);

  const confirmInternal = useCallback(
    (id: string): ActionResult => {
      const match = matches.find((m) => m.id === id);
      if (!match) return { ok: false, reason: 'Match not found.' };
      const person = PERSON.finance;
      const check = canConfirmMatch(match, match.tier === 'T4' ? person : SYSTEM_ACTOR);
      if (!check.ok) return check;
      setMatches((cur) =>
        cur.map((m) =>
          m.id === id
            ? {
                ...m,
                status: 'confirmed',
                personConfirmed: m.tier === 'T4' ? true : m.personConfirmed,
                evidence: {
                  ...m.evidence,
                  owner: m.tier === 'T4' ? person.name : m.evidence.owner || 'Rules',
                },
              }
            : m
        )
      );
      return check;
    },
    [matches]
  );

  const postToGlInternal = useCallback(
    (id: string): ActionResult => {
      const match = matches.find((m) => m.id === id);
      if (!match) return { ok: false, reason: 'Match not found.' };
      const person = PERSON.finance;
      const prepared: FinanceMatch = {
        ...match,
        status: match.status === 'orbiting' && match.tier !== 'T4' ? 'confirmed' : match.status,
        personConfirmed: match.tier === 'T4' ? match.personConfirmed : true,
        evidence: {
          ...match.evidence,
          owner: match.evidence.owner || person.name,
        },
      };
      const check = canPostToGl(
        {
          ...prepared,
          controllerNamed: true,
        },
        person
      );
      if (!check.ok) return check;
      setMatches((cur) =>
        cur.map((m) =>
          m.id === id
            ? {
                ...prepared,
                controllerNamed: true,
                posted: true,
                status: 'posted',
                evidence: { ...prepared.evidence, owner: person.name },
              }
            : m
        )
      );
      return check;
    },
    [matches]
  );

  const convertInternal = useCallback((id: string): ActionResult => {
    const deal = deals.find((d) => d.id === id);
    if (!deal) return { ok: false, reason: 'Deal not found.' };
    const person = PERSON.commercial;
    const check = convertDealToGoverned(deal, person);
    if (!check.ok) return check;
    setDeals((cur) =>
      cur.map((d) =>
        d.id === id
          ? {
              ...d,
              channel: 'governed',
              owner: person.name,
              quoteId: d.quoteId.startsWith('Q-') ? d.quoteId : 'Q-1049',
              evidence: {
                source: `CRM Q-1049 · lifted from ${d.quoteId}`,
                tier: 'RULES',
                owner: person.name,
                timestamp: new Date().toISOString(),
                criteria: 'Named owner mapped WhatsApp + sheet onto CRM/MRP.',
              },
            }
          : d
      )
    );
    return check;
  }, [deals]);

  const bookInternal = useCallback((id: string): ActionResult => {
    const deal = deals.find((d) => d.id === id);
    if (!deal) return { ok: false, reason: 'Deal not found.' };
    const person = PERSON.commercial;
    const check = canBookOrder(deal, person);
    if (!check.ok) return check;
    setDeals((cur) =>
      cur.map((d) => (d.id === id ? { ...d, booked: true, crmStage: 'booked' } : d))
    );
    return check;
  }, [deals]);

  const arm = useCallback((): ActionResult => {
    if (lane === 'finance') {
      const match = selectedMatch();
      if (!match) return flash({ ok: false, reason: 'Select a match, break, or the GL gate.' });
      if (match.status === 'confirmed' || selection?.kind === 'gl') {
        return flash(postToGlInternal(match.id));
      }
      return flash(confirmInternal(match.id));
    }
    if (lane === 'commercial') {
      const deal = selectedDeal();
      if (!deal) return flash({ ok: false, reason: 'Select a deal, stage, or the WhatsApp ghost.' });
      if (deal.channel === 'whatsapp-excel') {
        return flash(convertInternal(deal.id));
      }
      if (deal.crmStage === 'won') {
        return flash(bookInternal(deal.id));
      }
      const next = nextCrm(deal.crmStage);
      if (next === 'booked') {
        return flash(bookInternal(deal.id));
      }
      setDeals((cur) =>
        cur.map((d) => (d.id === deal.id ? { ...d, crmStage: next } : d))
      );
      return flash({ ok: true, reason: `${PERSON.commercial.name} advanced ${deal.id} to ${next}.` });
    }
    const order = selectedOrder();
    if (!order) return flash({ ok: false, reason: 'Select the gold gate or a cartridge to arm.' });
    const person = PERSON.production;
    if (order.phase === 'pending') {
      return flash(patchOrder(order.id, 'approved', person));
    }
    return flash(patchOrder(order.id, 'armed', person));
  }, [
    bookInternal,
    confirmInternal,
    convertInternal,
    flash,
    lane,
    patchOrder,
    postToGlInternal,
    selectedDeal,
    selectedMatch,
    selectedOrder,
    selection,
  ]);

  const reject = useCallback((): ActionResult => {
    if (lane === 'finance') {
      const match = selectedMatch();
      if (!match) return flash({ ok: false, reason: 'Select a match to hold.' });
      setMatches((cur) =>
        cur.map((m) => (m.id === match.id ? { ...m, status: 'held' } : m))
      );
      return flash({ ok: true, reason: `${PERSON.finance.name} held ${match.id}. Nothing posted.` });
    }
    const order = selectedOrder();
    if (!order) return flash({ ok: false, reason: 'Select a cartridge to reject.' });
    return flash(patchOrder(order.id, 'rejected', PERSON.production));
  }, [lane, selectedMatch, selectedOrder, flash, patchOrder]);

  const revert = useCallback((): ActionResult => {
    const order = selectedOrder();
    if (!order) return flash({ ok: false, reason: 'Select a live cartridge to revert.' });
    return flash(patchOrder(order.id, 'reverted', PERSON.production));
  }, [selectedOrder, flash, patchOrder]);

  const advance = useCallback((): ActionResult => {
    if (lane === 'finance') {
      const match = selectedMatch();
      if (!match) return flash({ ok: false, reason: 'Select a match or break.' });
      if (match.status === 'broken' || match.status === 'orbiting') {
        return flash(confirmInternal(match.id));
      }
      return flash(postToGlInternal(match.id));
    }
    if (lane === 'commercial') {
      return arm();
    }
    const order = selectedOrder();
    if (!order) return flash({ ok: false, reason: 'Select a cartridge, bay, or the gate.' });
    const next = nextForwardPhase(order.phase);
    if (!next) return flash({ ok: false, reason: `Cartridge is ${order.phase}.` });
    const actor = actorForAdvance(next, PERSON.production);
    return flash(patchOrder(order.id, next, actor));
  }, [lane, selectedMatch, selectedOrder, arm, confirmInternal, postToGlInternal, flash, patchOrder]);

  const retreat = useCallback((): ActionResult => {
    const order = selectedOrder();
    if (!order) return flash({ ok: false, reason: 'Select a cartridge.' });
    const prev = prevForwardPhase(order.phase);
    if (!prev) return flash({ ok: false, reason: 'Already at proposed.' });
    const check = canTransition(order.phase, prev, PERSON.production);
    if (check.ok) return flash(patchOrder(order.id, prev, PERSON.production));
    return flash({
      ok: false,
      reason: 'States do not walk backwards. Reject or revert instead.',
    });
  }, [selectedOrder, flash, patchOrder]);

  const cloudPropose = useCallback((): ActionResult => {
    const id = `WO-${proposeSeq.current++}`;
    const bay: BayId = BAY_CYCLE[(proposeSeq.current - 1) % BAY_CYCLE.length]!;
    const drafted: WorkOrder = {
      id,
      title: 'Cloud proposal · North Cell',
      bay,
      phase: 'proposed',
      sopVariant: 'CLOUD/propose/v1',
      mesId: `MES-NC-${id.slice(3)}`,
      qaStamp: null,
      dispatch: null,
      proposedBy: 'cloud',
      armedBy: null,
      exception: null,
    };
    const gate = canTransition('proposed', 'armed', CLOUD_ACTOR);
    setOrders((cur) => [...cur, drafted]);
    setSelection({ kind: 'cartridge', id });
    return flash({
      ok: true,
      reason: gate.ok
        ? 'Cloud armed — this must never happen.'
        : `Cloud proposed ${id}. ${gate.reason}`,
    });
  }, [flash]);

  const postToGl = useCallback((): ActionResult => {
    const match = selectedMatch();
    if (!match) return flash({ ok: false, reason: 'Select a match or the GL gate.' });
    return flash(postToGlInternal(match.id));
  }, [selectedMatch, postToGlInternal, flash]);

  const confirmPerson = useCallback((): ActionResult => {
    return arm();
  }, [arm]);

  const convertGoverned = useCallback((): ActionResult => {
    const deal = selectedDeal();
    if (!deal) return flash({ ok: false, reason: 'Select the WhatsApp / Excel ghost.' });
    return flash(convertInternal(deal.id));
  }, [selectedDeal, convertInternal, flash]);

  const toggleHelp = useCallback(() => setHelpOpen((v) => !v), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      const key = event.key;
      const lower = key.toLowerCase();

      const mapped = laneFromKey(lower);
      if (mapped) {
        event.preventDefault();
        setLane(mapped);
        return;
      }

      if (key === '?' || (event.shiftKey && key === '/')) {
        event.preventDefault();
        toggleHelp();
        return;
      }
      if (key === 'Escape') {
        event.preventDefault();
        setSelection(null);
        setHelpOpen(false);
        return;
      }
      if (key === '[' ) {
        event.preventDefault();
        setDepth(depth - 0.08);
        return;
      }
      if (key === ']') {
        event.preventDefault();
        setDepth(depth + 0.08);
        return;
      }
      if (key === 'Enter' || lower === 'a') {
        event.preventDefault();
        arm();
        return;
      }
      if (lower === 'r') {
        event.preventDefault();
        reject();
        return;
      }
      if (lower === 'v') {
        event.preventDefault();
        revert();
        return;
      }
      if (key === ' ' || key === 'ArrowRight') {
        event.preventDefault();
        advance();
        return;
      }
      if (key === 'ArrowLeft') {
        event.preventDefault();
        retreat();
        return;
      }
      if (lower === 'g') {
        event.preventDefault();
        if (lane === 'finance') select({ kind: 'gl' });
        else if (lane === 'commercial') select({ kind: 'stratum', id: 'actions' });
        else select({ kind: 'gate' });
        return;
      }
      if (lower === 's') {
        event.preventDefault();
        select({ kind: 'sis' });
        setNotice('SIS has no write path. Dashed mirror only.');
        return;
      }
      if (lower === 'e') {
        event.preventDefault();
        select({ kind: 'evidence' });
        return;
      }
      if (lower === 'b') {
        event.preventDefault();
        if (lane === 'production') {
          const current = selection?.kind === 'bay' ? selection.id : 'press';
          select({ kind: 'bay', id: selection?.kind === 'bay' ? nextBay(current) : 'press' });
        } else if (lane === 'finance') {
          const current = selection?.kind === 'break' ? selection.id : '';
          const breaks = brokenMatches(matches);
          if (breaks.length === 0) return;
          const i = Math.max(0, breaks.findIndex((b) => b.id === current));
          const next = breaks[(i + (selection?.kind === 'break' ? 1 : 0)) % breaks.length]!;
          select({ kind: 'break', id: next.id });
        }
        return;
      }
      if (lower === 'x') {
        event.preventDefault();
        if (lane === 'finance') {
          const breaks = brokenMatches(matches);
          if (breaks.length === 0) return;
          const current = selection?.kind === 'break' ? selection.id : '';
          const i = breaks.findIndex((b) => b.id === current);
          const next = breaks[(i + 1 + breaks.length) % breaks.length]!;
          select({ kind: 'break', id: next.id });
        } else if (lane === 'production') {
          const ex = exceptionOrders(orders);
          if (ex.length === 0) return;
          const current = selection?.kind === 'exception' ? selection.id : '';
          const i = ex.findIndex((b) => b.id === current);
          const next = ex[(i + 1 + ex.length) % ex.length]!;
          select({ kind: 'exception', id: next.id });
        } else {
          select({ kind: 'ghost' });
        }
        return;
      }
      if (lower === 't') {
        event.preventDefault();
        if (lane === 'finance') {
          const current = selection?.kind === 'tier' ? selection.id : 'T1';
          select({ kind: 'tier', id: selection?.kind === 'tier' ? nextTier(current) : 'T1' });
        }
        return;
      }
      if (lower === 'm') {
        event.preventDefault();
        if (lane === 'production') select({ kind: 'mes' });
        else if (lane === 'finance') {
          const current = selection?.kind === 'workflow' ? selection.id : 'recon';
          select({
            kind: 'workflow',
            id: selection?.kind === 'workflow' ? nextWorkflow(current) : 'recon',
          });
        } else {
          const current = selection?.kind === 'mrp' ? selection.id : 'demand';
          select({ kind: 'mrp', id: selection?.kind === 'mrp' ? nextMrp(current) : 'demand' });
        }
        return;
      }
      if (lower === 'q') {
        event.preventDefault();
        if (lane === 'production') select({ kind: 'qa' });
        else if (lane === 'commercial') {
          const current = selection?.kind === 'crm-stage' ? selection.id : 'lead';
          select({
            kind: 'crm-stage',
            id: selection?.kind === 'crm-stage' ? nextCrm(current) : 'lead',
          });
        }
        return;
      }
      if (lower === 'w') {
        event.preventDefault();
        if (lane === 'commercial') {
          const current = selection?.kind === 'system' ? selection.id : 'erp';
          select({
            kind: 'system',
            id: selection?.kind === 'system' ? nextSystem(current) : 'erp',
          });
        } else if (lane === 'finance') {
          const current = selection?.kind === 'workflow' ? selection.id : 'recon';
          select({
            kind: 'workflow',
            id: selection?.kind === 'workflow' ? nextWorkflow(current) : 'recon',
          });
        }
        return;
      }
      if (lower === 'k') {
        event.preventDefault();
        if (lane === 'commercial') {
          const current = selection?.kind === 'stratum' ? selection.id : 'map';
          select({
            kind: 'stratum',
            id: selection?.kind === 'stratum' ? nextStratum(current) : 'map',
          });
        }
        return;
      }
      if (lower === 'n') {
        event.preventDefault();
        cloudPropose();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    advance,
    arm,
    cloudPropose,
    depth,
    lane,
    matches,
    orders,
    reject,
    retreat,
    revert,
    select,
    selection,
    setDepth,
    setLane,
    toggleHelp,
  ]);

  return useMemo(
    () => ({
      lane,
      setLane,
      selection,
      select,
      orders,
      matches,
      deals,
      arm,
      reject,
      revert,
      advance,
      retreat,
      cloudPropose,
      postToGl,
      confirmPerson,
      convertGoverned,
      notice,
      depth,
      setDepth,
      helpOpen,
      toggleHelp,
      named: NAMED,
      interacting,
    }),
    [
      lane,
      setLane,
      selection,
      select,
      orders,
      matches,
      deals,
      arm,
      reject,
      revert,
      advance,
      retreat,
      cloudPropose,
      postToGl,
      confirmPerson,
      convertGoverned,
      notice,
      depth,
      setDepth,
      helpOpen,
      toggleHelp,
      interacting,
    ]
  );
}

const BAY_CYCLE: BayId[] = ['press', 'oven', 'pack', 'vision'];
