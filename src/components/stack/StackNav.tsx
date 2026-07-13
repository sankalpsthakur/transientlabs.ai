'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { moduleNav, narrative, STACK_PATH } from '@/lib/stack/content';
import { cn } from '@/lib/utils';
import { useReducedMotion } from 'framer-motion';

interface StackNavProps {
  /** IDs for in-page section jump (landing only) */
  sectionMode?: boolean;
}

export function StackNav({ sectionMode = true }: StackNavProps) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!sectionMode) return;

    const ids = moduleNav.map((m) => m.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { threshold: 0.2, rootMargin: '-20% 0px -45% 0px' }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionMode]);

  const jump = (id: string) => {
    setOpen(false);
    if (sectionMode) {
      const el = document.getElementById(id);
      el?.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
      return;
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0908]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 md:h-16 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 opacity-90 transition-opacity hover:opacity-100"
            aria-label="Transient Labs home"
          >
            <BrandLogo
              variant="symbol"
              tone="dark"
              alt=""
              className="h-7 w-7"
            />
          </Link>
          <div className="h-4 w-px bg-white/15" aria-hidden />
          <Link href={STACK_PATH} className="min-w-0">
            <div className="truncate text-sm font-medium tracking-tight text-white">
              {narrative.title}
            </div>
            <div className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 sm:block">
              stack.transientlabs.ai
            </div>
          </Link>
        </div>

        {/* Desktop module jump */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Modules"
        >
          {moduleNav.map((m) => {
            const isActive =
              sectionMode
                ? active === m.id
                : pathname?.includes(m.slug);
            const href = sectionMode ? `#${m.id}` : m.href;

            if (sectionMode) {
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => jump(m.id)}
                  className={cn(
                    'rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/45 hover:text-white/80'
                  )}
                  style={
                    isActive
                      ? { boxShadow: `inset 0 0 0 1px ${m.accent}55` }
                      : undefined
                  }
                >
                  {m.cameraLabel}
                </button>
              );
            }

            return (
              <Link
                key={m.id}
                href={href}
                className={cn(
                  'rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/45 hover:text-white/80'
                )}
              >
                {m.cameraLabel}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="https://transientlabs.ai"
            className="hidden text-xs text-white/40 transition-colors hover:text-white/70 sm:inline"
          >
            Studio
          </Link>
          <button
            type="button"
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Module menu"
          >
            {open ? 'Close' : narrative.skipLabel}
          </button>
        </div>
      </div>

      {/* Mobile module list */}
      {open && (
        <div className="border-t border-white/10 bg-[#0a0908] px-5 py-4 lg:hidden">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/35">
            {narrative.skipLabel}
          </p>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {moduleNav.map((m) => (
              <li key={m.id}>
                {sectionMode ? (
                  <button
                    type="button"
                    onClick={() => jump(m.id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white/80 hover:bg-white/5"
                  >
                    <span>{m.label}</span>
                    <span className="font-mono text-[10px] text-white/35">
                      {m.cameraLabel}
                    </span>
                  </button>
                ) : (
                  <Link
                    href={m.href}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5"
                  >
                    <span>{m.label}</span>
                    <span className="font-mono text-[10px] text-white/35">
                      {m.cameraLabel}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
