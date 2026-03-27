'use client';

import { m, useInView, useReducedMotion, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Easing Standards
// ============================================================================

export const easings = {
  easeOutQuint: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easeOutExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeInOutCubic: [0.65, 0, 0.35, 1] as [number, number, number, number],
  easeSpring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
};

// ============================================================================
// Fade In Component
// ============================================================================

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className,
  duration = 0.6,
  once = true,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    none: { y: 0, x: 0 },
  };

  // Reduced motion: just show content without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration, delay, ease: easings.easeOutQuint }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ============================================================================
// Stagger Components
// ============================================================================

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  delay?: number;
}

export function Stagger({
  children,
  staggerDelay = 0.08,
  className,
  delay = 0,
}: StaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  // Reduced motion: just show children without animation wrapper
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
            staggerChildren: staggerDelay,
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
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';
}) {
  const prefersReducedMotion = useReducedMotion();

  // Reduced motion: just show content
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const directions: Record<string, object> = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
    none: { y: 0, x: 0 },
    scale: { scale: 0.98 },
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easings.easeOutQuint,
      },
    },
  };

  return (
    <m.div variants={variants} className={className}>
      {children}
    </m.div>
  );
}

// ============================================================================
// Scale In Component
// ============================================================================

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  scale?: number;
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  scale = 0.95,
}: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, scale }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale }}
      transition={{
        duration: 0.8,
        delay,
        ease: easings.easeOutQuint,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ============================================================================
// Blur Reveal Component (for photos)
// ============================================================================

interface BlurRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  blur?: number;
}

export function BlurReveal({
  children,
  className,
  delay = 0,
  blur = 8,
}: BlurRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, filter: `blur(${blur}px)`, scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, filter: 'blur(0px)', scale: 1 }
          : { opacity: 0, filter: `blur(${blur}px)`, scale: 0.9 }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: easings.easeOutQuint,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ============================================================================
// 3D Perspective Card
// ============================================================================

interface PerspectiveCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  rotateY?: number;
}

export function PerspectiveCard({
  children,
  className,
  delay = 0,
  rotateY = -5,
}: PerspectiveCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className="perspective-container">
      <m.div
        initial={{ opacity: 0, rotateY, transformPerspective: 1000 }}
        animate={
          isInView
            ? { opacity: 1, rotateY: 0 }
            : { opacity: 0, rotateY }
        }
        transition={{
          duration: 0.8,
          delay,
          ease: easings.easeOutQuint,
        }}
        className={cn('perspective-card', className)}
      >
        {children}
      </m.div>
    </div>
  );
}

// ============================================================================
// Border Draw Container
// ============================================================================

interface BorderDrawProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BorderDraw({ children, className, delay = 0 }: BorderDrawProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      {children}
      <m.div
        className="absolute inset-0 pointer-events-none border-2 border-ink/10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{
          duration: 0.5,
          delay,
          ease: easings.easeOutQuint,
        }}
      />
    </div>
  );
}

// ============================================================================
// Reveal Text Line by Line
// ============================================================================

interface RevealLinesProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function RevealLines({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
}: RevealLinesProps) {
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
            staggerChildren: staggerDelay,
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

export function RevealLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: easings.easeOutQuint,
          },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ============================================================================
// Hover Scale Effect
// ============================================================================

interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  y?: number;
}

export function HoverScale({
  children,
  className,
  scale = 1.02,
  y = -4,
}: HoverScaleProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      whileHover={{ scale, y }}
      transition={{
        duration: 0.3,
        ease: easings.easeOutQuint,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ============================================================================
// Animated Container (for scroll-triggered reveals)
// ============================================================================

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedContainer({
  children,
  className,
  delay = 0,
}: AnimatedContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay,
        ease: easings.easeOutQuint,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
