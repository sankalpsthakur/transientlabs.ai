'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * MotionProvider wraps the app with LazyMotion for better tree-shaking.
 *
 * Benefits:
 * - Reduces initial bundle size by ~17kb (gzipped)
 * - Loads only the animation features actually used (domAnimation)
 * - Components should use 'm' instead of 'motion' for full optimization
 *
 * Usage:
 * - Wrap your app/page with <MotionProvider>
 * - Use 'm.div', 'm.span', etc. instead of 'motion.div', 'motion.span'
 * - Hooks like useScroll, useTransform, useInView work unchanged
 *
 * Migration:
 * - Replace: import { motion } from 'framer-motion'
 * - With: import { m } from 'framer-motion'
 * - Or: import { m } from '@/components/providers/MotionProvider'
 */
interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

// Re-export m for convenient imports
export { m };
