'use client';

import { m, useReducedMotion } from 'framer-motion';
import { DollarSign, Eye, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DrawLine } from '@/components/motion/DrawLine';

const defaultAria =
  'We build AI products that work in production, not just in demos. Quality assurance, monitoring, and cost optimization are built in from day one—so you can scale with confidence.';

type Pillar = {
  id: 'quality' | 'monitoring' | 'cost';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const pillars: Pillar[] = [
  { id: 'quality', label: 'Quality', icon: ShieldCheck },
  { id: 'monitoring', label: 'Monitoring', icon: Eye },
  { id: 'cost', label: 'Cost', icon: DollarSign },
];

export function BuiltInFromDayOne({
  className,
  ariaLabel = defaultAria,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'rounded-2xl border border-border bg-white/70 backdrop-blur-sm p-5 md:p-6',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10 rounded-xl border border-border bg-paper flex items-center justify-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">
            Day 1
          </span>
          {!reduced && (
            <span className="absolute inset-0 rounded-xl border border-ink/15 animate-pulse-ring opacity-40" />
          )}
        </div>
        <div className="flex-1">
          <DrawLine direction="horizontal" color="rgba(0,0,0,0.15)" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <m.div
              key={p.id}
              className={cn(
                'relative rounded-xl border border-border bg-paper px-4 py-4',
                'flex flex-col items-center justify-center text-center'
              )}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-ink" />
                {!reduced && (
                  <m.div
                    className="absolute inset-0 rounded-full border border-ink/20"
                    initial={false}
                    animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.18, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.15 }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="mt-2 text-[11px] font-mono uppercase tracking-widest text-ink-muted">
                {p.label}
              </div>

              <span className="sr-only">{p.label} built in from day one</span>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}

