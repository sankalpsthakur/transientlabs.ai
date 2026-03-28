'use client';

import { m, useInView, useReducedMotion, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  trigger?: 'inView' | 'mount';
}

// Word-level cascade animation for headlines
export function SplitText({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.02,
  as: Component = 'span',
  trigger = 'inView',
}: SplitTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  const words = children.split(' ');

  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <Component ref={ref} className={className}>
      <m.span
        variants={containerVariants}
        initial="hidden"
        animate={trigger === 'mount' || isInView ? 'visible' : 'hidden'}
        className="inline-flex flex-wrap"
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] pr-[0.06em] -mr-[0.06em]">
            <m.span variants={wordVariants} className="inline-block">
              {word}
            </m.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </m.span>
    </Component>
  );
}

// Character-level animation for more dramatic effect
interface SplitTextCharsProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function SplitTextChars({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.01,
}: SplitTextCharsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  const chars = children.split('');

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <m.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`inline-flex flex-wrap ${className}`}
    >
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <m.span variants={charVariants} className="inline-block">
            {char === ' ' ? '\u00A0' : char}
          </m.span>
        </span>
      ))}
    </m.span>
  );
}

// Line reveal for multi-line text blocks
interface LineRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function LineReveal({
  children,
  className = '',
  delay = 0,
  staggerDelay: _staggerDelay = 0.1,
}: LineRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
