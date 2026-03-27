'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

// Use useLayoutEffect on client, useEffect on server (for SSR compatibility)
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Number counting animation component
export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
}: CountUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();
  // Initialize with end value to prevent flash of 0 during SSR/hydration
  const [count, setCount] = useState(end);
  const hasAnimated = useRef(false);
  const hasMounted = useRef(false);

  // Use layout effect to set initial state before paint (avoids flash)
  useIsomorphicLayoutEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      if (!prefersReducedMotion) {
        setCount(start);
      }
    }
  }, [prefersReducedMotion, start]);

  useEffect(() => {
    if (!isInView || hasAnimated.current || prefersReducedMotion) {
      return;
    }

    hasAnimated.current = true;
    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration * 1000;

    const tick = () => {
      const now = Date.now();

      if (now < startTime) {
        requestAnimationFrame(tick);
        return;
      }

      if (now >= endTime) {
        setCount(end);
        return;
      }

      const progress = (now - startTime) / (duration * 1000);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const currentValue = start + (end - start) * eased;

      setCount(Number(currentValue.toFixed(decimals)));
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, end, start, duration, delay, decimals, prefersReducedMotion]);

  const displayValue = prefersReducedMotion ? end : count;

  return (
    <m.span
      ref={ref}
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </m.span>
  );
}

// Animated stat block with count up
interface AnimatedStatProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  delay?: number;
  className?: string;
}

export function AnimatedStat({
  value,
  label,
  suffix = '',
  prefix = '',
  delay = 0,
  className = '',
}: AnimatedStatProps) {
  return (
    <div className={cn('text-center', className)}>
      <div className="text-2xl md:text-3xl font-semibold text-ink">
        <CountUp end={value} suffix={suffix} prefix={prefix} delay={delay} />
      </div>
      <div className="text-sm text-ink-muted mt-1">{label}</div>
    </div>
  );
}
