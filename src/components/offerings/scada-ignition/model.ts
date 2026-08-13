/** North Cell plant state — modes, SOP, clamp, SIS no-write, disposable edge. */

export type Mode = 0 | 1 | 2 | 3 | 4;

export type SopPhase =
  | 'proposed'
  | 'screened'
  | 'pending'
  | 'approved'
  | 'armed'
  | 'executing'
  | 'verified'
  | 'rejected'
  | 'reverted';

export type AlarmState = 'normal' | 'advisory' | 'alarm' | 'suppressed';

export type Quality = 'good' | 'bad' | 'uncertain';

export type WriteSource = 'operator' | 'cloud' | 'sop-token' | 'plc' | 'sis';

export type SelectedNode =
  | 'field'
  | 'plc'
  | 'clamp'
  | 'edge'
  | 'gateway'
  | 'clients'
  | 'historian'
  | 'dmz'
  | 'erp'
  | 'sis'
  | 'sop'
  | 'cloud'
  | null;

export interface ModeSpec {
  id: Mode;
  name: string;
  trigger: string;
  value: string;
  risk: string;
}

export const MODE_SPECS: readonly ModeSpec[] = [
  {
    id: 0,
    name: 'Optimised',
    trigger: 'All layers healthy',
    value: 'full',
    risk: 'baseline',
  },
  {
    id: 1,
    name: 'Cloud-degraded',
    trigger: 'Heartbeat > 90 s',
    value: 'partial',
    risk: 'unchanged',
  },
  {
    id: 2,
    name: 'Edge-autonomous',
    trigger: 'Lease expiry',
    value: 'reduced',
    risk: 'unchanged',
  },
  {
    id: 3,
    name: 'Local-only',
    trigger: 'IPC / container failure',
    value: 'none',
    risk: 'unchanged',
  },
  {
    id: 4,
    name: 'Safe state',
    trigger: 'Process deviation or SIS',
    value: 'trip',
    risk: 'process-driven',
  },
] as const;

export interface ClampFilters {
  minMax: boolean;
  rateOfChange: boolean;
  plausibility: boolean;
  lease: boolean;
}

export interface TagClamp {
  min: number;
  max: number;
  rocPerSec: number;
}

export interface PlantTag {
  path: string;
  udt: string;
  cell: string;
  label: string;
  unit: string;
  value: number | boolean | string;
  quality: Quality;
  writable: boolean;
  discrete: boolean;
  sisMirror: boolean;
  leased: boolean;
  clamp?: TagClamp;
}

export interface Alarm {
  id: string;
  tag: string;
  state: AlarmState;
  text: string;
  actionable: boolean;
}

export interface AuditEvent {
  t: number;
  kind: string;
  detail: string;
  allowed: boolean;
}

export interface SopRecord {
  id: string;
  title: string;
  phase: SopPhase;
  token: string | null;
  approver: string | null;
  rationale: string;
}

export interface PlantState {
  mode: Mode;
  rearmRequired: boolean;
  edgeAlive: boolean;
  wanAlive: boolean;
  leaseRemainingSec: number;
  sop: SopRecord;
  clamp: ClampFilters;
  tags: Record<string, PlantTag>;
  alarms: Alarm[];
  selected: SelectedNode;
  audit: AuditEvent[];
  /** Must stay 0 when the edge crate is killed (R6). */
  plantTwitch: number;
  commandArmed: boolean;
  malformedVisible: boolean;
}

export type PlantAction =
  | { type: 'REQUEST_MODE'; mode: Mode }
  | { type: 'REARM' }
  | { type: 'KILL_EDGE' }
  | { type: 'RESTORE_EDGE' }
  | { type: 'SEVER_WAN' }
  | { type: 'RESTORE_WAN' }
  | { type: 'APPROVE_SOP' }
  | { type: 'REJECT_SOP' }
  | { type: 'RESET_SOP' }
  | { type: 'SELECT'; node: SelectedNode }
  | { type: 'SIS_TRIP' }
  | { type: 'SHOW_MALFORMED' }
  | { type: 'HIDE_MALFORMED' }
  | {
      type: 'ATTEMPT_WRITE';
      path: string;
      value: number | boolean | string;
      source: WriteSource;
    };

export const NAMED_PERSON = 'A. Rao · Shift Lead';

export const PACK_SP_PATH = 'Site/NorthCell/Pack_03/RequestedSpd_pct';
export const SIS_TRIP_PATH = 'Site/NorthCell/SIS/Trip';
export const SIS_ESTOP_PATH = 'Site/NorthCell/SIS/EStop';
export const PRESS_CYCLE_PATH = 'Site/NorthCell/Press_01/CycleTime_s';
export const OVEN_Z1_PATH = 'Site/NorthCell/Oven_02/Zone1_C';

export const INITIAL_FIELD_SNAPSHOT: Record<string, number | boolean | string> = {
  [PRESS_CYCLE_PATH]: 18.4,
  'Site/NorthCell/Press_01/Tonnage_kN': 1820,
  'Site/NorthCell/Press_01/MoldTemp_C': 212,
  [OVEN_Z1_PATH]: 168.2,
  'Site/NorthCell/Oven_02/Zone2_C': 174.6,
  'Site/NorthCell/Oven_02/BeltSpd_mmin': 2.4,
  'Site/NorthCell/Pack_03/Cases_hr': 640,
  'Site/NorthCell/Pack_03/Reject_pct': 0.8,
  'Site/NorthCell/Pack_03/VisionOK': true,
  [PACK_SP_PATH]: 62,
  'Site/NorthCell/Energy/kW': 186,
  'Site/NorthCell/Energy/kWh_shift': 1240,
  'Site/NorthCell/Energy/PF': 0.93,
  [SIS_TRIP_PATH]: false,
  'Site/NorthCell/SIS/LEL_pct': 0.4,
  [SIS_ESTOP_PATH]: false,
  'Site/NorthCell/SIS/ProofTestDue': false,
};

let seq = 1;
function tokenId(): string {
  seq += 1;
  return `SOP-NC-014.${seq.toString(36).toUpperCase()}`;
}

function stamp(
  kind: string,
  detail: string,
  allowed: boolean,
): AuditEvent {
  return { t: Date.now(), kind, detail, allowed };
}

export function canPromote(state: PlantState): { ok: boolean; reason: string } {
  if (state.mode === 0) return { ok: false, reason: 'Already Mode 0' };
  if (state.mode === 4) {
    return {
      ok: false,
      reason:
        'Mode 4 leaves only from the SIS engineering station. No write path from Ignition, edge, or cloud.',
    };
  }
  if (state.mode === 3 && !state.edgeAlive) {
    return {
      ok: false,
      reason: 'Restore the disposable edge crate before re-arming past local-only.',
    };
  }
  if (state.mode === 2 && !state.wanAlive) {
    return {
      ok: false,
      reason: 'WAN heartbeat required to leave edge-autonomous.',
    };
  }
  if (state.mode === 1 && !state.wanAlive) {
    return {
      ok: false,
      reason: 'WAN heartbeat required for Mode 0.',
    };
  }
  return { ok: true, reason: 'Named operator re-arm' };
}

export function sisWriteBlocked(path: string): boolean {
  return path.includes('/SIS/') || path.startsWith('SIS/') || path.endsWith('/SIS');
}

export function clampRejects(
  tag: PlantTag,
  next: number,
  hasToken: boolean,
  kind: 'instant' | 'target' = 'instant',
): { ok: boolean; filter: keyof ClampFilters | null; reason: string } {
  const band = tag.clamp;
  if (!band) return { ok: true, filter: null, reason: 'no band' };
  if (next < band.min || next > band.max) {
    return {
      ok: false,
      filter: 'minMax',
      reason: `${next} outside ${band.min}–${band.max} ${tag.unit}`,
    };
  }
  if (!hasToken) {
    return { ok: false, filter: 'lease', reason: 'No signed SOP token on the lease' };
  }
  // Approved SOP names a target; RoC/plausibility rate the path, not the destination.
  if (kind === 'target') {
    return { ok: true, filter: null, reason: 'within band' };
  }
  const current = typeof tag.value === 'number' ? tag.value : 0;
  const roc = Math.abs(next - current);
  if (roc > band.rocPerSec) {
    return {
      ok: false,
      filter: 'rateOfChange',
      reason: `Δ ${roc.toFixed(1)} ${tag.unit}/s exceeds ${band.rocPerSec}`,
    };
  }
  if (Math.abs(next - current) > 25 && current > 0) {
    return {
      ok: false,
      filter: 'plausibility',
      reason: `Implausible vs measured ${current} ${tag.unit}`,
    };
  }
  return { ok: true, filter: null, reason: 'within band' };
}

export function fieldSnapshot(state: PlantState): Record<string, number | boolean | string> {
  const out: Record<string, number | boolean | string> = {};
  for (const [path, tag] of Object.entries(state.tags)) {
    if (tag.sisMirror) continue;
    if (tag.leased) continue;
    out[path] = tag.value;
  }
  return out;
}

function pushAudit(state: PlantState, event: AuditEvent): PlantState {
  return { ...state, audit: [event, ...state.audit].slice(0, 24) };
}

function setMode(state: PlantState, mode: Mode, reason: string): PlantState {
  if (mode === state.mode) return state;
  const next: PlantState = {
    ...state,
    mode,
    rearmRequired: mode > 0,
    commandArmed: mode <= 1 ? state.commandArmed : false,
  };
  if (mode >= 2 && state.sop.phase !== 'rejected') {
    next.sop = { ...state.sop, phase: 'reverted', token: null };
    next.commandArmed = false;
  }
  return pushAudit(next, stamp('MODE', `Mode ${mode} · ${reason}`, true));
}

function applyWrite(
  state: PlantState,
  path: string,
  value: number | boolean | string,
  source: WriteSource,
): PlantState {
  if (sisWriteBlocked(path) && source !== 'sis') {
    return pushAudit(
      state,
      stamp(
        'SIS_DENY',
        `NO WRITE PATH · ${source} → ${path}`,
        false,
      ),
    );
  }

  const tag = state.tags[path];
  if (!tag) {
    return pushAudit(state, stamp('WRITE_DENY', `Unknown tag ${path}`, false));
  }

  if (source === 'cloud') {
    return pushAudit(
      state,
      stamp(
        'CLOUD_DENY',
        'Cloud is advisory. Unsigned cloud write cannot move a valve or setpoint.',
        false,
      ),
    );
  }

  if (source === 'sop-token') {
    if (state.mode > 1 || !state.edgeAlive) {
      return pushAudit(
        state,
        stamp('SOP_DENY', 'Token cannot arm outside Mode 0–1 with a live edge.', false),
      );
    }
    if (tag.discrete) {
      return pushAudit(
        state,
        stamp('SOP_DENY', 'R3 · SOP token cannot write discrete outputs or valves.', false),
      );
    }
    if (!tag.leased) {
      return pushAudit(
        state,
        stamp('SOP_DENY', 'Only leased analogue request tags accept SOP writes.', false),
      );
    }
    if (typeof value === 'number') {
      const gate = clampRejects(tag, value, Boolean(state.sop.token), 'target');
      if (!gate.ok) {
        return pushAudit(
          state,
          stamp('CLAMP', `Rejected by ${gate.filter}: ${gate.reason}`, false),
        );
      }
    }
  }

  if (source === 'operator' && tag.sisMirror) {
    return pushAudit(
      state,
      stamp('SIS_DENY', `NO WRITE PATH · operator → ${path}`, false),
    );
  }

  const tags = {
    ...state.tags,
    [path]: { ...tag, value, quality: 'good' as const },
  };
  return pushAudit(
    { ...state, tags },
    stamp('WRITE', `${source} wrote ${path} = ${String(value)}`, true),
  );
}

export function reducePlant(state: PlantState, action: PlantAction): PlantState {
  switch (action.type) {
    case 'SELECT':
      return { ...state, selected: action.node };

    case 'REQUEST_MODE': {
      if (action.mode === state.mode) return state;
      // Higher index = less autonomy. Down the ladder is allowed; up is not.
      if (action.mode > state.mode) {
        return setMode(
          state,
          action.mode,
          MODE_SPECS[action.mode].trigger,
        );
      }
      return pushAudit(
        { ...state, rearmRequired: true },
        stamp(
          'REARM_REQUIRED',
          `Mode ${action.mode} refused. Degradation is monotonic; climb only by explicit re-arm.`,
          false,
        ),
      );
    }

    case 'REARM': {
      const gate = canPromote(state);
      if (!gate.ok) {
        return pushAudit(state, stamp('REARM_DENY', gate.reason, false));
      }
      const nextMode = (state.mode - 1) as Mode;
      const next = setMode(state, nextMode, gate.reason);
      return {
        ...next,
        rearmRequired: nextMode > 0,
      };
    }

    case 'KILL_EDGE': {
      if (!state.edgeAlive) return state;
      const nextMode: Mode = state.mode < 3 ? 3 : state.mode;
      const next = setMode(
        {
          ...state,
          edgeAlive: false,
          plantTwitch: 0,
          commandArmed: false,
          sop: {
            ...state.sop,
            phase: state.sop.phase === 'pending' ? 'pending' : 'reverted',
            token: null,
          },
        },
        nextMode,
        'IPC / container failure · R6 kill-crate',
      );
      return pushAudit(
        next,
        stamp('EDGE_KILL', 'Edge crate gone. L0/L1 unchanged. Plant did not twitch.', true),
      );
    }

    case 'RESTORE_EDGE': {
      if (state.edgeAlive) return state;
      return pushAudit(
        { ...state, edgeAlive: true, rearmRequired: true },
        stamp('EDGE_RESTORE', 'Crate restored. Explicit re-arm still required.', true),
      );
    }

    case 'SEVER_WAN': {
      if (!state.wanAlive) return state;
      const nextMode: Mode = state.mode < 1 ? 1 : state.mode;
      return setMode(
        { ...state, wanAlive: false, leaseRemainingSec: 0 },
        nextMode,
        'Heartbeat > 90 s',
      );
    }

    case 'RESTORE_WAN': {
      if (state.wanAlive) return state;
      return pushAudit(
        { ...state, wanAlive: true, rearmRequired: true },
        stamp('WAN_RESTORE', 'Heartbeat restored. Explicit re-arm still required.', true),
      );
    }

    case 'APPROVE_SOP': {
      if (state.sop.phase !== 'pending' && state.sop.phase !== 'screened' && state.sop.phase !== 'proposed') {
        return pushAudit(state, stamp('SOP_DENY', `SOP is ${state.sop.phase}`, false));
      }
      if (state.mode > 1) {
        return pushAudit(
          state,
          stamp('SOP_DENY', 'Approve is live in Mode 0; Mode 1 holds last lease only.', false),
        );
      }
      if (!state.edgeAlive) {
        return pushAudit(state, stamp('SOP_DENY', 'Edge crate is gone. Nothing to arm.', false));
      }
      const token = tokenId();
      const armed: PlantState = {
        ...state,
        sop: {
          ...state.sop,
          phase: 'armed',
          token,
          approver: NAMED_PERSON,
        },
        commandArmed: true,
        leaseRemainingSec: 18 * 60,
        selected: 'sop',
      };
      const written = applyWrite(armed, PACK_SP_PATH, 74, 'sop-token');
      return {
        ...written,
        sop: { ...written.sop, phase: 'executing' },
      };
    }

    case 'REJECT_SOP': {
      return pushAudit(
        {
          ...state,
          sop: { ...state.sop, phase: 'rejected', token: null, approver: NAMED_PERSON },
          commandArmed: false,
        },
        stamp('SOP_REJECT', 'Rejection is a first-class outcome, not an error.', true),
      );
    }

    case 'RESET_SOP': {
      return {
        ...state,
        sop: {
          ...state.sop,
          phase: 'pending',
          token: null,
          approver: null,
        },
        commandArmed: false,
      };
    }

    case 'SIS_TRIP': {
      const tripped = applyWrite(
        { ...state, commandArmed: false },
        SIS_TRIP_PATH,
        true,
        'sis',
      );
      return setMode(
        {
          ...tripped,
          sop: { ...tripped.sop, phase: 'reverted', token: null },
        },
        4,
        'SIS trip · independent veto',
      );
    }

    case 'SHOW_MALFORMED':
      return { ...state, malformedVisible: true, selected: 'clamp' };

    case 'HIDE_MALFORMED':
      return { ...state, malformedVisible: false };

    case 'ATTEMPT_WRITE':
      return applyWrite(state, action.path, action.value, action.source);

    default:
      return state;
  }
}

export function createPlantState(tags: Record<string, PlantTag>, alarms: Alarm[]): PlantState {
  return {
    mode: 0,
    rearmRequired: false,
    edgeAlive: true,
    wanAlive: true,
    leaseRemainingSec: 18 * 60,
    sop: {
      id: 'SOP-NC-014',
      title: 'Ramp Pack_03 to 74% after second-cell commissioning',
      phase: 'pending',
      token: null,
      approver: null,
      rationale: 'Capacity expansion · matched energy baseline · in-domain twin',
    },
    clamp: {
      minMax: true,
      rateOfChange: true,
      plausibility: true,
      lease: true,
    },
    tags,
    alarms,
    selected: null,
    audit: [
      stamp('BOOT', 'North Cell · Ignition Gateway live · SIS mirror read-only', true),
    ],
    plantTwitch: 0,
    commandArmed: false,
    malformedVisible: false,
  };
}

export function modeLabel(mode: Mode): string {
  return `MODE ${mode} · ${MODE_SPECS[mode].name.toUpperCase()}`;
}

export function conduitAuthoritySolid(state: PlantState): boolean {
  return state.commandArmed && Boolean(state.sop.token) && state.mode <= 1 && state.edgeAlive;
}

export function inboundSisExists(): false {
  return false;
}
