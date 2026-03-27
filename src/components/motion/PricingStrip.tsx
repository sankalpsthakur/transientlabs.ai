'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type PricingVariant = 'sprint' | 'cto' | 'enterprise';

const variants: Record<
  PricingVariant,
  { label: string; aria: string; tone: string }
> = {
  sprint: {
    label: 'FIXED',
    aria: 'Fixed pricing (Sprint).',
    tone: 'border-emerald-600 text-emerald-700 bg-emerald-50',
  },
  cto: {
    label: '$ / MO',
    aria: 'Monthly retainer (Fractional CTO).',
    tone: 'border-cyan-600 text-cyan-700 bg-cyan-50',
  },
  enterprise: {
    label: 'CUSTOM',
    aria: 'Custom scope (Enterprise engagement).',
    tone: 'border-amber-600 text-amber-700 bg-amber-50',
  },
};

export function PricingStrip({
  variant,
  className,
}: {
  variant: PricingVariant;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const v = variants[variant];

  return (
    <div
      role="img"
      aria-label={v.aria}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5',
        'font-mono text-[10px] uppercase tracking-widest',
        'overflow-hidden',
        v.tone,
        className
      )}
    >
      <span className="relative z-10">{v.label}</span>

      {!reduced && variant === 'cto' && (
        <m.span
          className="absolute inset-0"
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)',
          }}
          aria-hidden="true"
        />
      )}

      {!reduced && variant === 'enterprise' && (
        <m.span
          className="absolute inset-0 rounded-full"
          initial={false}
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.03, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ border: '1px solid rgba(0,0,0,0.1)' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

