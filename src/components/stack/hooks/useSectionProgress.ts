'use client';

import { useRef } from 'react';
import { useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';

export interface SectionProgress {
  ref: React.RefObject<HTMLElement | null>;
  progress: MotionValue<number>;
  smooth: MotionValue<number>;
}

/**
 * Maps section scroll through viewport to a 0–1 progress value
 * suitable for scrubbing diagrams (scroll = camera).
 */
export function useSectionProgress(
  offset: [`${number} ${number}`, `${number} ${number}`] | ['start end', 'end start'] = [
    'start end',
    'end start',
  ]
): SectionProgress {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { ref, progress: scrollYProgress, smooth };
}

export function useProgressRange(
  progress: MotionValue<number>,
  start: number,
  end: number
) {
  return useTransform(progress, [start, end], [0, 1], { clamp: true });
}
