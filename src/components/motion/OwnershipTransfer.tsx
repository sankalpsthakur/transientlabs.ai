'use client';

import { m, useReducedMotion } from 'framer-motion';
import { FileText, KeyRound, LockKeyhole } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DrawLine } from '@/components/motion/DrawLine';

const defaultAria = '100% IP ownership.';

export function OwnershipTransfer({
  className,
  ariaLabel = defaultAria,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      tabIndex={0}
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'group relative rounded-xl border border-border bg-paper/60 backdrop-blur-sm',
        'px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ink/30',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-white">
          <FileText className="w-5 h-5 text-ink-muted" aria-hidden="true" />
          {!reduced && (
            <m.div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center"
              initial={false}
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            </m.div>
          )}
        </div>

        <div className="relative w-20 h-6 flex items-center" aria-hidden="true">
          <DrawLine direction="horizontal" color="rgba(0,0,0,0.18)" />
          {!reduced && (
            <m.div
              className="absolute top-1/2 -translate-y-1/2"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [0, 72], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FileText className="w-4 h-4 text-ink" />
            </m.div>
          )}
        </div>

        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-white">
          <LockKeyhole className="w-5 h-5 text-ink" aria-hidden="true" />
          {!reduced && (
            <m.span
              className="absolute inset-0 rounded-lg border border-ink/20"
              initial={false}
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* Tooltip with the original stat text (lossless, progressive disclosure) */}
      <div
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-3 right-3 -bottom-2 translate-y-full',
          'rounded-lg border border-border bg-white px-3 py-2 shadow-lg',
          'text-[11px] text-ink-muted leading-relaxed',
          'opacity-0 translate-y-1 transition-all duration-200',
          'group-hover:opacity-100 group-hover:translate-y-0',
          'group-focus-within:opacity-100 group-focus-within:translate-y-0'
        )}
      >
        100% IP ownership — full code, infrastructure, and deployments.
      </div>
    </div>
  );
}

