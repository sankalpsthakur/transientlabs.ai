'use client';

import { m, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Gauge,
  ServerCog,
  Scale,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultAria =
  'Building AI products that work reliably in the real world requires addressing challenges that most teams underestimate.';

export function DemoVsProduction({
  className,
  ariaLabel = defaultAria,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'relative rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden',
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
        {/* Demo */}
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Demo
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-24 rounded bg-white/10" />
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-14 rounded bg-white/[0.06]" />
                <div className="h-14 rounded bg-white/[0.06]" />
                <div className="h-14 rounded bg-white/[0.06]" />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-3 text-white/70">
                <Gauge className="h-4 w-4 text-white/60" />
                <div className="h-2.5 w-28 rounded bg-white/10" />
              </div>
              <div className="mt-3 h-2 rounded bg-white/10 overflow-hidden">
                <m.div
                  className="h-full bg-emerald-400/50"
                  initial={false}
                  animate={prefersReducedMotion ? { width: '70%' } : { width: ['55%', '78%', '70%'] }}
                  transition={{ duration: 2.6, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative hidden md:block w-px">
          <m.div
            className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"
            initial={false}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 2.8, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Production */}
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Production
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between text-white/70">
                <div className="flex items-center gap-2">
                  <ServerCog className="h-4 w-4 text-white/60" />
                  <div className="h-2.5 w-28 rounded bg-white/10" />
                </div>
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <m.div
                  className="h-14 rounded bg-white/[0.06]"
                  initial={false}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.6, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                />
                <div className="h-14 rounded bg-white/[0.06]" />
                <div className="h-14 rounded bg-white/[0.06]" />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center gap-3 text-white/70">
                <span className="inline-flex items-center gap-2">
                  <Scale className="h-4 w-4 text-white/60" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/60">
                    Scale
                  </span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-white/60" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/60">
                    Compliance
                  </span>
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 rounded bg-white/10 overflow-hidden">
                  <m.div
                    className="h-full bg-amber-400/50"
                    initial={false}
                    animate={prefersReducedMotion ? { width: '62%' } : { width: ['35%', '68%', '62%'] }}
                    transition={{ duration: 2.2, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <m.div
                  className="h-2 w-2 rounded-full bg-amber-400"
                  initial={false}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

