'use client';

import { m } from 'framer-motion';
import { ArrowDown, ArrowRight, ClipboardList, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollTo } from '@/components/smooth-scroll/SmoothScrollProvider';
import type { ComponentType } from 'react';

type CrossRef = {
  id: string;
  label: string;
  aria: string;
  target: string;
  icon: ComponentType<{ className?: string }>;
};

const refs: CrossRef[] = [
  {
    id: 'sprint',
    label: 'See Sprint details',
    aria: 'Sprint inclusions (scroll to Services section).',
    target: '#services',
    icon: ClipboardList,
  },
  {
    id: 'qa',
    label: 'Watch QA in action',
    aria: 'Quality assurance (scroll to VideoShowcase section).',
    target: '#showcase',
    icon: ShieldCheck,
  },
  {
    id: 'patterns',
    label: 'See Technical Patterns',
    aria: 'AI reliability patterns (scroll to Capabilities section).',
    target: '#capabilities',
    icon: Sparkles,
  },
];

export function VisualCrossReferences({ className }: { className?: string }) {
  const scrollTo = useScrollTo();

  return (
    <div className={cn('rounded-2xl border border-border bg-paper-warm/50 p-6', className)}>
      <div className="flex items-center gap-2 mb-4 text-ink-muted">
        <ArrowDown className="w-4 h-4" aria-hidden="true" />
        <span className="text-xs font-mono uppercase tracking-widest">
          See it in action
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {refs.map((r, idx) => {
          const Icon = r.icon;
          return (
            <m.button
              key={r.id}
              type="button"
              onClick={() => scrollTo(r.target, { offset: -80 })}
              className={cn(
                'group w-full rounded-xl border border-border bg-white/70 px-4 py-4 text-left',
                'outline-none focus-visible:ring-2 focus-visible:ring-ink/30',
                'hover:border-ink/20 transition-colors'
              )}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              aria-label={r.aria}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-border bg-paper flex items-center justify-center">
                    <Icon className="w-5 h-5 text-ink" aria-hidden="true" />
                  </div>
                  <div className="text-sm font-medium text-ink">{r.label}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink transition-colors" aria-hidden="true" />
              </div>
            </m.button>
          );
        })}
      </div>
    </div>
  );
}
