'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface DrawLineProps {
  className?: string;
  color?: string;
  strokeWidth?: number;
  direction?: 'horizontal' | 'vertical';
  length?: string | number;
  delay?: number;
  duration?: number;
}

// SVG path animation for border draw effects
export function DrawLine({
  className = '',
  color = 'currentColor',
  strokeWidth = 1,
  direction = 'horizontal',
  length = '100%',
  delay = 0,
  duration = 0.8,
}: DrawLineProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  const isHorizontal = direction === 'horizontal';
  const _numericLength = typeof length === 'number' ? length : 100;

  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          isHorizontal ? 'w-full h-px' : 'w-px h-full',
          className
        )}
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <svg
      ref={ref}
      className={cn(
        isHorizontal ? 'w-full h-px overflow-visible' : 'w-px h-full overflow-visible',
        className
      )}
      preserveAspectRatio="none"
    >
      <m.line
        x1="0"
        y1="0"
        x2={isHorizontal ? '100%' : '0'}
        y2={isHorizontal ? '0' : '100%'}
        stroke={color}
        strokeWidth={strokeWidth}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: {
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
          opacity: {
            duration: 0.1,
            delay,
          },
        }}
      />
    </svg>
  );
}

// Animated border draw for containers
interface DrawBorderProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  delay?: number;
  duration?: number;
}

export function DrawBorder({
  children,
  className = '',
  borderColor = 'currentColor',
  borderWidth = 1,
  delay = 0,
  duration = 1,
}: DrawBorderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={cn('border', className)} style={{ borderColor }}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Animated border overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <m.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke={borderColor}
          strokeWidth={borderWidth}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{
            pathLength: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: {
              duration: 0.1,
              delay,
            },
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </svg>
    </div>
  );
}

// Check icon with draw animation
interface DrawCheckProps {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
  duration?: number;
}

export function DrawCheck({
  className = '',
  color = 'currentColor',
  size = 16,
  delay = 0,
  duration = 0.3,
}: DrawCheckProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3 8L6.5 11.5L13 5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      ref={ref}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
    >
      <m.path
        d="M3 8L6.5 11.5L13 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: {
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
          opacity: {
            duration: 0.1,
            delay,
          },
        }}
      />
    </svg>
  );
}

// Animated underline that draws in from left
interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
  underlineHeight?: number;
  delay?: number;
}

export function AnimatedUnderline({
  children,
  className = '',
  underlineColor = 'currentColor',
  underlineHeight = 1,
  delay = 0,
}: AnimatedUnderlineProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const _prefersReducedMotion = useReducedMotion();

  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      {children}
      <m.span
        className="absolute bottom-0 left-0"
        style={{
          height: underlineHeight,
          backgroundColor: underlineColor,
        }}
        initial={{ width: 0 }}
        animate={isInView ? { width: '100%' } : { width: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </span>
  );
}
