'use client';

import { m, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, ArrowUpRight, DollarSign, Star, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultAria =
  'We focus on business results: reduced costs, faster workflows, better customer experiences.';

export function OutcomeIcons({
  className,
  ariaLabel = defaultAria,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();

  const items = [
    {
      label: 'Costs',
      icon: DollarSign,
      accent: 'rgba(34,197,94,0.85)',
      motion: reduced ? {} : { rotate: [0, -6, 0] },
      deco: ArrowDownRight,
    },
    {
      label: 'Workflows',
      icon: Timer,
      accent: 'rgba(59,130,246,0.85)',
      motion: reduced ? {} : { rotate: [0, 8, 0] },
      deco: ArrowRight,
    },
    {
      label: 'Experience',
      icon: Star,
      accent: 'rgba(245,158,11,0.9)',
      motion: reduced ? {} : { scale: [1, 1.06, 1] },
      deco: ArrowUpRight,
    },
  ] as const;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('grid grid-cols-3 gap-3', className)}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const Deco = item.deco;
        return (
          <m.div
            key={item.label}
            className="relative rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
          >
            <m.div
              className="mx-auto w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center"
              initial={false}
              animate={item.motion}
              transition={{ duration: 2.0, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            >
              <Icon className="w-5 h-5" style={{ color: item.accent }} />
            </m.div>
            <div className="mt-2 text-[11px] font-mono uppercase tracking-widest text-white/60">
              {item.label}
            </div>
            <Deco
              className="absolute top-3 right-3 w-4 h-4 opacity-40"
              style={{ color: item.accent }}
              aria-hidden="true"
            />
          </m.div>
        );
      })}
    </div>
  );
}

