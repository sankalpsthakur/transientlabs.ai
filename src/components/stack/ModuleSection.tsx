'use client';

import type { ReactNode } from 'react';
import { useReducedMotion, useSpring, type MotionValue } from 'framer-motion';
import Link from 'next/link';
import type { StackModule } from '@/lib/stack/content';
import { STACK_PATH } from '@/lib/stack/content';
import { cn } from '@/lib/utils';
import { useGsapSectionProgress } from './gsap/useGsapSectionProgress';

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

  // GSAP ScrollTrigger drives progress; exposed as MotionValue for R3F useFrame
  const { ref, progress } = useGsapSectionProgress({
    start: 'top bottom',
    end: 'bottom top',
    scrub: prefersReduced ? false : 0.55,
  });

  const smooth = useSpring(progress, {
    stiffness: prefersReduced ? 1000 : 120,
    damping: prefersReduced ? 100 : 32,
    restDelta: 0.001,
  });

  return (
    <section
      ref={ref}
      id={module.id}
      data-module={module.id}
      className={cn(
        'relative border-t border-white/[0.06]',
        standalone ? 'min-h-[220vh]' : 'min-h-[280vh]',
        className
      )}
      style={{ background: module.color }}
      aria-labelledby={`${module.id}-title`}
    >
      <div className="sticky top-0 flex min-h-[100dvh] flex-col justify-center overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.04),transparent_50%)]" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center md:gap-12 md:px-8">
          <div className="order-2 md:order-1">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: module.accent }}
              >
                {String(module.order + 1).padStart(2, '0')} · {module.cameraLabel}
              </span>
            </div>

            <h2
              id={`${module.id}-title`}
              className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              {module.title}
            </h2>
            <p className="mt-2 text-sm text-white/45 md:text-base">{module.subtitle}</p>

            <div className="mt-8 border-l-2 pl-5" style={{ borderColor: module.accent }}>
              <div
                className="font-mono text-4xl font-medium tracking-tight md:text-5xl"
                style={{ color: module.accent }}
              >
                {module.hookStat}
              </div>
              <p className="mt-1 max-w-sm text-sm text-white/55">{module.hookLabel}</p>
            </div>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              {module.thesis}
            </p>

            <ol className="mt-8 space-y-4">
              {module.mechanism.map((beat, i) => (
                <li key={beat.title} className="flex gap-3">
                  <span
                    className="mt-0.5 font-mono text-xs tabular-nums"
                    style={{ color: module.accent }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-white/90">{beat.title}</div>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/50">{beat.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                  Scale
                </div>
                <p className="mt-2 text-sm font-medium text-white/85">{module.scale.claim}</p>
                <p className="mt-1 text-xs text-white/45">{module.scale.comparator}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                  Stakes
                </div>
                <p className="mt-2 text-sm font-medium text-white/85">{module.stakes.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/45">
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
                Deep dive
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>

          <div className="order-1 md:order-2">
            <div className="relative mx-auto w-full max-w-md md:max-w-none">
              {visual(smooth, {
                reduced: !!prefersReduced,
                accent: module.accent,
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
