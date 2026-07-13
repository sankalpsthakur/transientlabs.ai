'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section progress 0–1 via GSAP ScrollTrigger, exposed as Framer MotionValue
 * so existing R3F scenes (progress.get() in useFrame) keep working.
 */
export function useGsapSectionProgress(
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {}
): {
  ref: React.RefObject<HTMLElement | null>;
  progress: MotionValue<number>;
} {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useMotionValue(0);
  const { start = 'top bottom', end = 'bottom top', scrub = 0.6 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub,
      onUpdate: (self) => {
        progress.set(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [progress, start, end, scrub]);

  return { ref, progress };
}
