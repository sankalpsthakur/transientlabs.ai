import type { MotionValue } from 'framer-motion';

export type DmrvTier = 'low' | 'mid' | 'high';

export type DmrvStageId =
  | 'design'
  | 'integrate'
  | 'track'
  | 'verify'
  | 'defend'
  | 'retire';

export type SensorCadence = 'periodic' | 'logged' | 'continuous' | 'absent';

export interface ModuleExperienceProps {
  /** Optional 0–1 scrub. Sequential only — never unlocks a skipped stage. */
  progress?: MotionValue<number>;
  reduced?: boolean;
  className?: string;
}

export interface MonitoringPoint {
  id: 'intake' | 'reactor' | 'output' | 'storage' | 'permanence';
  index: 1 | 2 | 3 | 4 | 5;
  label: string;
  measures: string;
  deck: string;
  /** Local kiln-space position */
  position: [number, number, number];
  cadence: Record<DmrvTier, SensorCadence>;
}

export interface BatchCollar {
  id: 'feedstock' | 'pyrolysis' | 'storage' | 'retirement';
  short: string;
  label: string;
  locksAt: DmrvStageId;
  sampleId: string;
  fields: string[];
}

export interface StageDefinition {
  id: DmrvStageId;
  index: number;
  numeral: string;
  title: string;
  deckTitle: string;
  kicker: string;
  body: string;
  key: string;
}

export interface TierDefinition {
  id: DmrvTier;
  key: '1' | '2' | '3';
  title: string;
  subtitle: string;
  plantChange: string;
  agentLayer: string;
  evidence: string;
  rejection: string;
  cost: string;
  bom: readonly string[];
}
