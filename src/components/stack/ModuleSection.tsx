'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  useReducedMotion,
  useSpring,
  useTransform,
  m,
  type MotionValue,
} from 'framer-motion';
import Link from 'next/link';
import type { StackModule } from '@/lib/stack/content';
import { STACK_PATH } from '@/lib/stack/content';
import { depthStrata, type DepthStratum } from '@/lib/stack/depth-copy';
import { cn } from '@/lib/utils';
import { useGsapSectionProgress } from './gsap/useGsapSectionProgress';
import { DepthField } from './DepthField';

function DepthStrataList({
  strata,
  progress,
  accent,
}: {
  strata: DepthStratum[];
  progress: MotionValue<number>;
  accent: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    return progress.on('change', (v) => {
      const idx = Math.min(
        strata.length - 1,
        Math.max(0, Math.floor(v * strata.length))
      );
      setActive(idx);
    });
  }, [progress, strata.length]);

  return (
    <div className="mt-8 space-y-0">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
          Depth strata
        </span>
        <span className="font-mono text-[9px] text-white/25">
          L{active + 1}/{strata.length}
        </span>
      </div>
      <ol className="relative space-y-0">
        {strata.map((s, i) => {
          const on = i === active;
          const past = i < active;
          return (
            <li
              key={s.layer}
              className="relative border-l-2 py-3 pl-5 transition-all duration-300"
              style={{
                borderLeftColor: on ? accent : past ? `${accent}55` : 'rgba(255,255,255,0.08)',
                opacity: on ? 1 : past ? 0.7 : 0.4,
                transform: on ? 'translateX(4px)' : 'none',
              }}
            >
              <div
                className="absolute -left-[5px] top-5 h-2 w-2 rounded-full transition-transform"
                style={{
                  backgroundColor: accent,
                  opacity: on ? 1 : 0.35,
                  transform: on ? 'scale(1.35)' : 'scale(1)',
                }}
              />
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className="font-mono text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: on ? accent : 'rgba(255,255,255,0.5)' }}
                >
                  {s.layer}
                </span>
                <span className="font-mono text-[9px] text-white/25">L{i + 1}</span>
              </div>
              <p
                className={cn(
                  'mt-1 text-sm leading-snug',
                  on ? 'text-white/90' : 'text-white/55'
                )}
              >
                {s.see}
              </p>
              {on && (
                <>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">
                    {s.relation}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    {s.why}
                  </p>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export type ModuleVisualFn = (
  progress: MotionValue<number>,
  options: { reduced: boolean; accent: string }
) => ReactNode;

interface ModuleSectionProps {
  module: StackModule;
  visual: ModuleVisualFn;
  /** When true, section is standalone deep-dive (taller, more copy visible). */
  standalone?: boolean;
  className?: string;
}

export function ModuleSection({
  module,
  visual,
  standalone = false,
  className,
}: ModuleSectionProps) {
  const prefersReduced = useReducedMotion();
  const strata = depthStrata[module.id];

  // Longer runway = more camera depth per scroll pixel
  const { ref, progress } = useGsapSectionProgress({
    start: 'top bottom',
    end: 'bottom top',
    scrub: prefersReduced ? false : 0.65,
  });

  const smooth = useSpring(progress, {
    stiffness: prefersReduced ? 1000 : 100,
    damping: prefersReduced ? 100 : 34,
    restDelta: 0.001,
  });

  // Copy column drifts opposite to visual — page parallax
  const copyY = useTransform(smooth, [0, 1], [24, -48]);
  const visualY = useTransform(smooth, [0, 1], [-12, 28]);
  const copyOpacity = useTransform(
    smooth,
    [0, 0.08, 0.85, 1],
    [0.55, 1, 1, 0.75]
  );

  return (
    <section
      ref={ref}
      id={module.id}
      data-module={module.id}
      className={cn(
        'relative border-t border-white/[0.06]',
        // Deep scroll runway for full scale continuum
        standalone ? 'min-h-[320vh]' : 'min-h-[380vh]',
        className
      )}
      style={{ background: module.color }}
      aria-labelledby={`${module.id}-title`}
    >
      <div className="sticky top-0 flex min-h-[100dvh] flex-col justify-center overflow-hidden py-16 md:py-20">
        <DepthField
          progress={smooth}
          accent={module.accent}
          cameraLabel={module.cameraLabel}
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8">
          {/* Copy — 5 cols, parallax */}
          <m.div
            className="order-2 lg:order-1 lg:col-span-5"
            style={
              prefersReduced
                ? undefined
                : { y: copyY, opacity: copyOpacity }
            }
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: module.accent }}
              >
                {String(module.order + 1).padStart(2, '0')} · {module.cameraLabel}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                scroll = depth
              </span>
            </div>

            <h2
              id={`${module.id}-title`}
              className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.65rem] lg:leading-[1.08]"
            >
              {module.title}
            </h2>
            <p className="mt-2 text-sm text-white/45 md:text-base">
              {module.subtitle}
            </p>

            <div
              className="mt-8 border-l-2 pl-5"
              style={{ borderColor: module.accent }}
            >
              <div
                className="font-mono text-4xl font-medium tracking-tight md:text-5xl"
                style={{ color: module.accent }}
              >
                {module.hookStat}
              </div>
              <p className="mt-1 max-w-sm text-sm text-white/55">
                {module.hookLabel}
              </p>
            </div>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              {module.thesis}
            </p>

            {/* Depth strata — spatial relations, scroll-synced highlight */}
            <DepthStrataList
              strata={strata}
              progress={smooth}
              accent={module.accent}
            />

            {/* Classic mechanism (condensed) */}
            <details className="mt-8 group">
              <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-white/35 transition-colors hover:text-white/60">
                Mechanism beats ({module.mechanism.length})
              </summary>
              <ol className="mt-4 space-y-3">
                {module.mechanism.map((beat, i) => (
                  <li key={beat.title} className="flex gap-3">
                    <span
                      className="mt-0.5 font-mono text-xs tabular-nums"
                      style={{ color: module.accent }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-white/85">
                        {beat.title}
                      </div>
                      <p className="mt-0.5 text-sm leading-relaxed text-white/45">
                        {beat.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </details>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                  Scale
                </div>
                <p className="mt-2 text-sm font-medium text-white/85">
                  {module.scale.claim}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  {module.scale.comparator}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                  Stakes
                </div>
                <p className="mt-2 text-sm font-medium text-white/85">
                  {module.stakes.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  {module.stakes.tension}
                </p>
              </div>
            </div>

            {!standalone && (
              <Link
                href={`${STACK_PATH}/${module.slug}`}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: module.accent }}
              >
                Deep dive this layer
                <span aria-hidden>→</span>
              </Link>
            )}
          </m.div>

          {/* Visual — 7 cols, larger cinematic stage */}
          <m.div
            className="order-1 lg:order-2 lg:col-span-7"
            style={prefersReduced ? undefined : { y: visualY }}
          >
            <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
              {/* Floating depth label above stage */}
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                  spatial stage
                </span>
                <span
                  className="font-mono text-[9px] uppercase tracking-wider"
                  style={{ color: module.accent }}
                >
                  {module.cameraLabel} → micro
                </span>
              </div>
              {visual(smooth, {
                reduced: !!prefersReduced,
                accent: module.accent,
              })}
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
