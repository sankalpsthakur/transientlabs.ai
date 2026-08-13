import type { ModuleExperienceProps } from '@/components/stack/webgl';

export type FirmPortal = 'plant' | 'finance' | 'evidence';
export type FirmStratum = 'map' | 'rules' | 'actions' | 'trace';
export type FirmSystem = 'erp' | 'crm' | 'mes' | 'qms' | 'email';
export type FirmPriorId =
  | 'synapse'
  | 'visusta'
  | 'renewcred'
  | 'climitra'
  | 'hygenco'
  | 'emtribe'
  | 'finance';

export interface FirmExperienceProps extends ModuleExperienceProps {
  /** Visual handoff only — parent may dolly; do not import other offerings. */
  onPortal?: (id: FirmPortal | null) => void;
  initialPortal?: FirmPortal | null;
}

export interface FirmInteraction {
  portal: FirmPortal | null;
  stratum: FirmStratum | null;
  system: FirmSystem | null;
  prior: FirmPriorId | null;
  markArmed: boolean;
  selectPortal: (id: FirmPortal | null) => void;
  selectStratum: (id: FirmStratum | null) => void;
  selectSystem: (id: FirmSystem | null) => void;
  selectPrior: (id: FirmPriorId | null) => void;
  armMark: (armed?: boolean) => void;
  reset: () => void;
}
