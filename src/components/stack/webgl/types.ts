import type { MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';

/** Contract every production module experience must export */
export interface ModuleExperienceProps {
  /** 0–1 scroll progress through the module stage */
  progress: MotionValue<number>;
  accent?: string;
  /** Prefer static / low-motion presentation */
  reduced?: boolean;
  className?: string;
  /** Expand the 3D stage to the desktop viewport while retaining the contained mobile stage. */
  fullBleed?: boolean;
}

export type ModuleExperience = (props: ModuleExperienceProps) => ReactNode;
