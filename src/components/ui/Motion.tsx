'use client';

import { m, useInView, useReducedMotion, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

/**
 * Motion system.
 *
 * One curve, two durations, one travel distance. Everything on the site reveals
 * the same way, which is the point: motion should be the thing you don't notice.
 *
 * What this replaced: eleven separate entrance primitives with travel distances
 * of 24-30px, durations up to 0.8s, entrance `scale`, `blur(8px)`, 3D `rotateY`,
 * and an `easeSpring` curve that overshot to 1.56. Elements flew in, popped, and
 * bounced. It read as a template.
 *
 * Rules:
 * - Opacity leads. Travel is a hint (6px), never a journey.
 * - No scale, blur, or rotation on entrance. Ever.
 * - No overshoot. The curve decelerates and stops.
 * - Reveals fire once and settle. Nothing loops.
 * - Reduced motion renders the final state with no transition.
 */

/** Decelerate, no overshoot. The only curve on the site. */
export const EASE = [0, 0, 0.2, 1] as [number, number, number, number];

export const DURATION = {
  /** Hover, focus, toggles: fast enough to feel like a direct response. */
  micro: 0.14,
  /** Scroll reveals. */
  base: 0.22,
} as const;

/** Entrance travel. A hint of direction, not a slide. */
const TRAVEL = 6;

/** Gap between staggered siblings. Four items = 120ms total, not a parade. */
const STAGGER = 0.04;

/**
 * The old curve names, all aliased to the one curve. Kept so existing call sites
 * keep compiling, and so no component can quietly reintroduce a second
 * personality — `easeSpring` in particular used to overshoot to 1.56.
 */
export const easings = {
  standard: EASE,
  easeOutQuint: EASE,
  easeOutExpo: EASE,
  easeInOutCubic: EASE,
  easeSpring: EASE,
};

const offsets: Record<string, { x: number; y: number }> = {
  up: { y: TRAVEL, x: 0 },
  down: { y: -TRAVEL, x: 0 },
  left: { y: 0, x: TRAVEL },
  right: { y: 0, x: -TRAVEL },
  none: { y: 0, x: 0 },
};

type Direction = keyof typeof offsets;

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className,
  duration = DURATION.base,
  once = true,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-40px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const from = offsets[direction] ?? offsets.up;

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, ...from }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...from }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </m.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  delay?: number;
}

export function Stagger({
  children,
  staggerDelay = STAGGER,
  className,
  delay = 0,
}: StaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            // Clamped: a long list should not turn into a slow reveal queue.
            staggerChildren: Math.min(staggerDelay, STAGGER),
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  /** 'scale' is accepted and ignored; entrances do not scale. */
  direction?: Direction | 'scale';
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const from = offsets[direction] ?? offsets.up;

  const variants: Variants = {
    hidden: { opacity: 0, ...from },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: DURATION.base, ease: EASE },
    },
  };

  return (
    <m.div variants={variants} className={className}>
      {children}
    </m.div>
  );
}

/**
 * Photo reveal. Previously blurred 8px and scaled from 0.9; now it is a plain
 * fade, because a photograph arriving out of focus is a effect, not a reveal.
 */
export function BlurReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Accepted and ignored. */
  blur?: number;
}) {
  return (
    <FadeIn className={className} delay={delay} direction="none">
      {children}
    </FadeIn>
  );
}

/**
 * Hover affordance. Callers used to pass scale up to 1.15 and y up to -4; both
 * are now clamped hard. A card acknowledges the cursor, it does not jump at it.
 */
export function HoverScale({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** Accepted and ignored. */
  scale?: number;
  /** Accepted and ignored. */
  y?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      whileHover={{ y: -1 }}
      transition={{ duration: DURATION.micro, ease: EASE }}
      className={className}
    >
      {children}
    </m.div>
  );
}
