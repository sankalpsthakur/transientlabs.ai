'use client';

import { m, useReducedMotion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DrawBorder, DrawLine } from '@/components/motion/DrawLine';

const defaultAria =
  'A senior product team that delivers end-to-end: strategy, design, engineering, and AI integration with enterprise-grade reliability.';

function Connector({
  active = true,
  vertical = false,
}: {
  active?: boolean;
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <div className="relative w-6 h-10 flex items-center justify-center">
        <DrawLine direction="vertical" color="rgba(0,0,0,0.2)" />
        {active && (
          <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-ink animate-data-packet-vertical" />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-10 h-4 flex items-center justify-center">
      <DrawLine direction="horizontal" color="rgba(0,0,0,0.2)" />
      {active && (
        <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-ink animate-data-packet" />
      )}
    </div>
  );
}

export function PipelineFlow({
  className,
  ariaLabel = defaultAria,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();

  const nodes = ['Strategy', 'Design', 'Engineering', 'AI'] as const;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'rounded-2xl border border-border bg-paper/70 backdrop-blur-sm p-4 md:p-5',
        className
      )}
    >
      {/* Desktop / Tablet */}
      <div className="hidden sm:flex items-center justify-center gap-2">
        {nodes.map((label, idx) => (
          <div key={label} className="flex items-center">
            <DrawBorder
              borderColor="rgba(0,0,0,0.25)"
              borderWidth={1}
              delay={0.05 * idx}
              className="rounded-xl"
            >
              <div className="px-4 py-2.5 text-xs md:text-sm font-mono uppercase tracking-wider text-ink">
                {label}
              </div>
            </DrawBorder>

            {idx < nodes.length - 1 && <Connector active={!reduced} />}
          </div>
        ))}

        <m.div
          className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-paper"
          initial={false}
          animate={reduced ? { opacity: 1 } : { opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2.2, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <ShieldCheck className="w-5 h-5 text-ink" />
          {!reduced && (
            <span className="absolute inset-0 rounded-xl border border-ink/20 animate-pulse-ring opacity-40" />
          )}
        </m.div>
        <span className="sr-only">Enterprise-grade reliability</span>
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden flex-col items-center justify-center gap-3">
        {nodes.map((label, idx) => (
          <div key={label} className="flex flex-col items-center">
            <DrawBorder
              borderColor="rgba(0,0,0,0.25)"
              borderWidth={1}
              delay={0.05 * idx}
              className="rounded-xl"
            >
              <div className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink">
                {label}
              </div>
            </DrawBorder>
            {idx < nodes.length - 1 && <Connector active={!reduced} vertical />}
          </div>
        ))}

        <m.div
          className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-paper"
          initial={false}
          animate={reduced ? { opacity: 1 } : { opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2.2, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <ShieldCheck className="w-5 h-5 text-ink" />
          {!reduced && (
            <span className="absolute inset-0 rounded-xl border border-ink/20 animate-pulse-ring opacity-40" />
          )}
        </m.div>
        <span className="sr-only">Enterprise-grade reliability</span>
      </div>
    </div>
  );
}
