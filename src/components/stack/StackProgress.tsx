'use client';

import { useEffect, useState } from 'react';
import { useScroll, useReducedMotion } from 'framer-motion';
import { moduleNav } from '@/lib/stack/content';
import { cn } from '@/lib/utils';

export function StackProgress() {
  const { scrollYProgress } = useScroll();
  const [p, setP] = useState(0);
  const [active, setActive] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    return scrollYProgress.on('change', (v) => setP(v));
  }, [scrollYProgress]);

  useEffect(() => {
    const ids = moduleNav.map((m) => m.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id as (typeof ids)[number]);
            if (idx >= 0) setActive(idx);
          }
        }
      },
      { threshold: 0.15, rootMargin: '-20% 0px -40% 0px' }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (prefersReduced) return null;

  return (
    <>
      {/* Top progress bar */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full"
        style={{
          background: `linear-gradient(to right, #7EA2FF ${p * 100}%, transparent ${p * 100}%)`,
        }}
        aria-hidden
      />

      {/* Right rail — camera path */}
      <nav
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
        aria-label="Camera path"
      >
        {moduleNav.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              document.getElementById(m.id)?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            className="group flex items-center justify-end gap-2"
            aria-label={`Go to ${m.label}`}
            aria-current={active === i ? 'true' : undefined}
          >
            <span
              className={cn(
                'font-mono text-[10px] uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100',
                active === i ? 'opacity-100 text-white' : 'text-white/50'
              )}
            >
              {m.cameraLabel}
            </span>
            <span
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                active === i ? 'scale-125' : 'bg-white/25 group-hover:bg-white/50'
              )}
              style={
                active === i
                  ? { backgroundColor: m.accent }
                  : undefined
              }
            />
          </button>
        ))}
      </nav>
    </>
  );
}
