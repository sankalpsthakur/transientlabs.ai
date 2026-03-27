'use client';

import React, { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// ParallaxWrapper - Core parallax scroll effect component
// ============================================================================

export interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function ParallaxWrapper({
  children,
  speed = 0.5,
  direction = 'up',
  className,
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"] as const,
  });

  // Calculate transform values based on direction
  const distance = 100 * speed;

  const xRange: [number, number] =
    direction === 'left'
      ? [distance, -distance]
      : direction === 'right'
        ? [-distance, distance]
        : [0, 0];
  const yRange: [number, number] =
    direction === 'up'
      ? [distance, -distance]
      : direction === 'down'
        ? [-distance, distance]
        : [0, 0];

  const x = useTransform(scrollYProgress, [0, 1], xRange);
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className="relative overflow-visible">
      <m.div
        style={{
          x,
          y,
          willChange: 'transform',
        }}
        className={cn('will-change-transform', className)}
      >
        {children}
      </m.div>
    </div>
  );
}

// ============================================================================
// ParallaxImage - Image with parallax effect and optional scale
// ============================================================================

export interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  containerClassName?: string;
  scale?: number;
  priority?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  direction = 'up',
  className,
  containerClassName,
  scale = 1.2,
  priority = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"] as const,
  });

  const distance = 100 * speed;

  const xRange: [number, number] =
    direction === 'left'
      ? [distance, -distance]
      : direction === 'right'
        ? [-distance, distance]
        : [0, 0];
  const yRange: [number, number] =
    direction === 'up'
      ? [distance, -distance]
      : direction === 'down'
        ? [-distance, distance]
        : [0, 0];

  const x = useTransform(scrollYProgress, [0, 1], xRange);
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  if (prefersReducedMotion) {
    return (
      <div className={cn('overflow-hidden', containerClassName)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={cn('w-full h-full object-cover', className)}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden', containerClassName)}
    >
      <m.div
        style={{
          x,
          y,
          scale,
          willChange: 'transform',
        }}
        className={cn('w-full h-full will-change-transform', className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
        />
      </m.div>
    </div>
  );
}
