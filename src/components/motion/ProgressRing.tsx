'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

export function ProgressRing({
  value,
  label,
  className,
  size = 48,
  strokeWidth = 6,
}: {
  value: number; // 0..100
  label: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = useMemo(() => {
    return circumference - (clamped / 100) * circumference;
  }, [circumference, clamped]);

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-3', className)}
      aria-label={`${label}: ${clamped}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <m.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0,0,0,0.55)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={
            reduced || !inView
              ? { strokeDashoffset: offset, opacity: 1 }
              : { strokeDashoffset: [circumference, offset], opacity: [0.4, 1] }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '50% 50%', rotate: -90 }}
        />
      </svg>
      <div>
        <div className="font-mono text-sm font-semibold text-ink">
          {Math.round(clamped)}%
        </div>
        <div className="text-[10px] uppercase tracking-wider text-ink-muted">
          {label}
        </div>
      </div>
    </div>
  );
}

