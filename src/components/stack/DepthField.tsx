'use client';

import { useEffect, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { m, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DepthFieldProps {
  progress: MotionValue<number>;
  accent: string;
  /** Module order label for atmospheric tint */
  cameraLabel?: string;
  className?: string;
}

/**
 * DOM parallax strata behind the sticky stage — gives page-level depth
 * independent of WebGL (works on reduced-motion with static layers).
 */
export function DepthField({
  progress,
  accent,
  cameraLabel,
  className,
}: DepthFieldProps) {
  const [p, setP] = useState(0);
  useEffect(() => progress.on('change', setP), [progress]);

  const farY = useTransform(progress, [0, 1], [40, -80]);
  const midY = useTransform(progress, [0, 1], [20, -40]);
  const nearY = useTransform(progress, [0, 1], [8, -16]);
  const gridOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.04, 0.08, 0.12, 0.06]);
  const vignette = useTransform(progress, [0, 1], [0.35, 0.65]);

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      {/* Far atmospheric bloom */}
      <m.div
        className="absolute -left-1/4 top-0 h-[140%] w-[80%] rounded-full blur-3xl"
        style={{
          y: farY,
          background: `radial-gradient(ellipse at center, ${accent}22 0%, transparent 70%)`,
        }}
      />
      <m.div
        className="absolute -right-1/4 bottom-0 h-[120%] w-[70%] rounded-full blur-3xl"
        style={{
          y: midY,
          background: `radial-gradient(ellipse at center, ${accent}14 0%, transparent 65%)`,
        }}
      />

      {/* Perspective grid — recedes into depth */}
      <m.div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          opacity: gridOpacity,
          y: nearY,
          backgroundImage: `
            linear-gradient(to right, ${accent} 1px, transparent 1px),
            linear-gradient(to bottom, ${accent} 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to top, black 0%, transparent 85%), linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to top, black 0%, transparent 85%), linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          transform: 'perspective(600px) rotateX(62deg)',
          transformOrigin: 'center bottom',
        }}
      />

      {/* Horizon line */}
      <div
        className="absolute inset-x-[10%] top-[42%] h-px opacity-20"
        style={{
          background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Scroll depth meter (left edge) */}
      <div className="absolute bottom-24 left-4 top-28 hidden w-1 overflow-hidden rounded-full bg-white/5 md:block">
        <div
          className="absolute bottom-0 left-0 right-0 origin-bottom rounded-full transition-none"
          style={{
            height: `${Math.round(p * 100)}%`,
            background: `linear-gradient(to top, ${accent}, ${accent}55)`,
          }}
        />
      </div>

      {/* Camera altitude tag */}
      {cameraLabel && (
        <div className="absolute right-5 top-24 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-white/25 md:block">
          z · {cameraLabel.toLowerCase()}
          <span className="mt-1 block text-white/15">
            depth {(p * 100).toFixed(0)}%
          </span>
        </div>
      )}

      {/* Vignette deepens as you zoom in */}
      <m.div
        className="absolute inset-0"
        style={{
          opacity: vignette,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
