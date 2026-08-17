import type { MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';

export type Lane = 'production' | 'finance' | 'commercial';

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

export type ActorKind = 'cloud' | 'person' | 'system' | 'mes' | 'qms' | 'sis';

export interface Actor {
  kind: ActorKind;
  named: boolean;
  name: string;
}

export type BayId = 'press' | 'oven' | 'pack' | 'vision';

export type MatchTier = 'T1' | 'T2' | 'T3' | 'T4';

export type FinanceWorkflowId = 'recon' | 'ocr' | 'tax-leases' | 'mis';

export type MatchStatus = 'orbiting' | 'broken' | 'confirmed' | 'posted' | 'held';

export type SystemChip = 'erp' | 'crm' | 'mes' | 'qms' | 'email';

export type ControlStratum = 'map' | 'rules' | 'actions' | 'trace';

export type CrmStage = 'lead' | 'qualified' | 'quoted' | 'won' | 'booked';

export type MrpNode = 'demand' | 'gross' | 'net' | 'planned' | 'shortage';

export type DispatchCol = 'ready' | 'hold' | 'ship' | 'exception';

export interface EvidencePack {
  source: string;
  tier: string;
  owner: string;
  timestamp: string;
  criteria: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  bay: BayId;
  phase: SopPhase;
  sopVariant: string;
  mesId: string;
  qaStamp: string | null;
  dispatch: DispatchCol | null;
  proposedBy: 'cloud' | 'planner';
  armedBy: string | null;
  exception: string | null;
}

export interface FinanceMatch {
  id: string;
  workflow: FinanceWorkflowId;
  tier: MatchTier;
  amount: string;
  description: string;
  status: MatchStatus;
  agingDays: number;
  personConfirmed: boolean;
  controllerNamed: boolean;
  posted: boolean;
  evidence: Partial<EvidencePack>;
}

export interface CommercialDeal {
  id: string;
  title: string;
  crmStage: CrmStage;
  mrp: MrpNode;
  channel: 'whatsapp-excel' | 'governed';
  owner: string;
  quoteId: string;
  shortage: boolean;
  booked: boolean;
  evidence: Partial<EvidencePack>;
}

export interface BaySpec {
  id: BayId;
  label: string;
  cell: string;
  kind: 'cyclic' | 'continuous' | 'discrete';
  metric: string;
  utilisation: number;
  position: [number, number, number];
}

export type Selection =
  | { kind: 'gate' }
  | { kind: 'bay'; id: BayId }
  | { kind: 'break'; id: string }
  | { kind: 'cartridge'; id: string }
  | { kind: 'sis' }
  | { kind: 'mes' }
  | { kind: 'qa' }
  | { kind: 'dispatch'; id: DispatchCol }
  | { kind: 'torus'; id: BayId }
  | { kind: 'exception'; id: string }
  | { kind: 'tier'; id: MatchTier }
  | { kind: 'workflow'; id: FinanceWorkflowId }
  | { kind: 'gl' }
  | { kind: 'evidence' }
  | { kind: 'match'; id: string }
  | { kind: 'system'; id: SystemChip }
  | { kind: 'stratum'; id: ControlStratum }
  | { kind: 'crm-stage'; id: CrmStage }
  | { kind: 'mrp'; id: MrpNode }
  | { kind: 'deal'; id: string }
  | { kind: 'ghost' }
  | null;

export interface ActionResult {
  ok: boolean;
  reason: string;
}

export interface NamedPerson {
  production: string;
  finance: string;
  commercial: string;
}

export interface WorkflowExperienceProps {
  /** Optional 0–1 scrub. Camera depth only — never writes the GL or arms a gate. */
  progress?: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  className?: string;
  fullBleed?: boolean;
  initialLane?: Lane;
  onLaneChange?: (lane: Lane) => void;
}

export type ModuleExperience = (props: WorkflowExperienceProps) => ReactNode;

export interface WorkflowApi {
  lane: Lane;
  setLane: (lane: Lane) => void;
  selection: Selection;
  select: (next: Selection) => void;
  orders: WorkOrder[];
  matches: FinanceMatch[];
  deals: CommercialDeal[];
  arm: () => ActionResult;
  reject: () => ActionResult;
  revert: () => ActionResult;
  advance: () => ActionResult;
  retreat: () => ActionResult;
  cloudPropose: () => ActionResult;
  postToGl: () => ActionResult;
  confirmPerson: () => ActionResult;
  convertGoverned: () => ActionResult;
  notice: string | null;
  depth: number;
  setDepth: (n: number) => void;
  helpOpen: boolean;
  toggleHelp: () => void;
  named: NamedPerson;
  interacting: boolean;
}
