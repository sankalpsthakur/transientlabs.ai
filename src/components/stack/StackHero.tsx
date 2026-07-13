'use client';

import { m, useReducedMotion } from 'framer-motion';
import { moduleNav } from '@/lib/stack/content';
import { getStackNarrative } from '@/lib/stack/cms';
import { StackRiveIcon } from './rive/StackRiveIcon';

export function StackHero() {
  const prefersReduced = useReducedMotion();
  const narrative = getStackNarrative();

  return (
    <section
      id="intro"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#070605] px-5 pb-24 pt-28 md:px-8"
    >
      {/* Atmospheric field — multi-plane depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(31, 63, 147, 0.4), transparent 55%),
            radial-gradient(ellipse 40% 40% at 80% 60%, rgba(92, 225, 168, 0.08), transparent 50%),
            radial-gradient(ellipse 40% 40% at 15% 70%, rgba(232, 168, 124, 0.08), transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% 100%, rgba(0,0,0,0.7), transparent 50%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, #7EA2FF 1px, transparent 1px),
            linear-gradient(to bottom, #7EA2FF 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
          transform: 'perspective(500px) rotateX(58deg)',
          transformOrigin: 'center bottom',
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl">
        <m.p
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#7EA2FF]"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {narrative.eyebrow}
        </m.p>

        <m.h1
          className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl md:leading-[1.05]"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          {narrative.title}
        </m.h1>

        <m.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          {narrative.tagline}
        </m.p>

        <m.p
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/45"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {narrative.thesis}
        </m.p>

        {/* Camera path chips */}
        <m.div
          className="mt-12 flex flex-wrap items-center gap-2"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
        >
          <span className="mr-1 font-mono text-[10px] uppercase tracking-widest text-white/30">
            Camera path
          </span>
          {moduleNav.map((m, i) => (
            <span key={m.id} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-white/20" aria-hidden>
                  →
                </span>
              )}
              <button
                type="button"
                onClick={() =>
                  document.getElementById(m.id)?.scrollIntoView({
                    behavior: prefersReduced ? 'auto' : 'smooth',
                  })
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 font-mono text-[11px] uppercase tracking-wider text-white/70 transition-colors hover:border-white/25 hover:text-white"
                style={{ borderColor: `${m.accent}33` }}
              >
                <StackRiveIcon
                  accent={m.accent}
                  label={m.label}
                  fallback={String(i + 1)}
                  className="!h-6 !w-6 !text-[10px]"
                />
                {m.cameraLabel}
              </button>
            </span>
          ))}
        </m.div>

        <m.div
          className="mt-16 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 text-sm text-white/40">
            <span className="inline-flex h-8 w-5 items-start justify-center rounded-full border border-white/20 pt-1.5">
              <span className="block h-1.5 w-0.5 animate-bounce rounded-full bg-white/50" />
            </span>
            {narrative.scrollHint}
          </div>
          <p className="max-w-sm font-mono text-[11px] leading-relaxed text-white/25">
            {narrative.cameraPath}
          </p>
        </m.div>
      </div>
    </section>
  );
}
