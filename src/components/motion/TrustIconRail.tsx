'use client';

import { m, useReducedMotion } from 'framer-motion';
import {
  Brain,
  Code2,
  Gift,
  Handshake,
  LifeBuoy,
  Rocket,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TrustItemId =
  | 'free'
  | 'team'
  | 'delivered'
  | 'satisfaction'
  | 'aiNative'
  | 'support';

const items: Array<{
  id: TrustItemId;
  aria: string;
  render: (reduced: boolean) => React.ReactNode;
}> = [
  {
    id: 'free',
    aria: 'Free consultation.',
    render: (reduced) => (
      <div className="relative">
        <Handshake className="h-5 w-5 text-ink" aria-hidden="true" />
        <m.div
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-emerald-500/15 flex items-center justify-center"
          initial={false}
          animate={reduced ? { opacity: 1, scale: 1 } : { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Gift className="h-3.5 w-3.5 text-emerald-600" />
        </m.div>
      </div>
    ),
  },
  {
    id: 'team',
    aria: 'Dedicated team.',
    render: (reduced) => (
      <m.div
        initial={false}
        animate={reduced ? { y: 0 } : { y: [0, -2, 0] }}
        transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
      >
        <Users className="h-5 w-5 text-ink" aria-hidden="true" />
      </m.div>
    ),
  },
  {
    id: 'delivered',
    aria: '15+ projects delivered.',
    render: (reduced) => (
      <div className="relative">
        <Rocket className="h-5 w-5 text-ink" aria-hidden="true" />
        <div className="mt-2 grid grid-cols-5 gap-0.5" aria-hidden="true">
          {Array.from({ length: 15 }).map((_, idx) => (
            <m.span
              key={idx}
              className="h-1 w-1 rounded-[1px] bg-ink/15"
              initial={false}
              animate={
                reduced
                  ? { backgroundColor: 'rgba(0,0,0,0.18)' }
                  : { backgroundColor: ['rgba(0,0,0,0.10)', 'rgba(0,0,0,0.22)', 'rgba(0,0,0,0.10)'] }
              }
              transition={{
                duration: 1.8,
                repeat: reduced ? 0 : Infinity,
                ease: 'easeInOut',
                delay: (idx % 5) * 0.06 + Math.floor(idx / 5) * 0.04,
              }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'satisfaction',
    aria: '100% client satisfaction.',
    render: (reduced) => (
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, idx) => (
          <m.div
            key={idx}
            initial={false}
            animate={
              reduced
                ? { opacity: 1, scale: 1 }
                : { opacity: [0.35, 1, 1], scale: [0.95, 1, 1] }
            }
            transition={{
              duration: 0.9,
              repeat: reduced ? 0 : Infinity,
              ease: 'easeInOut',
              delay: reduced ? 0 : idx * 0.08,
            }}
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-500/70" />
          </m.div>
        ))}
      </div>
    ),
  },
  {
    id: 'aiNative',
    aria: 'AI-native development.',
    render: (reduced) => (
      <div className="relative">
        <Brain className="h-5 w-5 text-ink" aria-hidden="true" />
        <div className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-ink/5 border border-border flex items-center justify-center" aria-hidden="true">
          <Code2 className="h-3.5 w-3.5 text-ink-muted" />
        </div>
        {!reduced && (
          <m.div
            className="absolute -top-2 -left-2"
            initial={false}
            animate={{ opacity: [0.2, 1, 0.2], rotate: [0, 12, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <Sparkles className="h-4 w-4 text-cyan-600" />
          </m.div>
        )}
      </div>
    ),
  },
  {
    id: 'support',
    aria: 'Post-launch support included.',
    render: (reduced) => (
      <div className="relative">
        <LifeBuoy className="h-5 w-5 text-ink" aria-hidden="true" />
        {!reduced && (
          <m.span
            className="absolute inset-0 rounded-full border border-ink/20"
            initial={false}
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}
      </div>
    ),
  },
];

export function TrustIconRail({ className }: { className?: string }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      className={cn(
        'grid grid-cols-3 sm:grid-cols-6 gap-3',
        className
      )}
      aria-label="Trust signals"
    >
      {items.map((item) => (
        <div
          key={item.id}
          tabIndex={0}
          role="img"
          aria-label={item.aria}
          className={cn(
            'group relative flex items-center justify-center',
            'h-12 rounded-xl border border-border bg-paper/60 backdrop-blur-sm',
            'outline-none focus-visible:ring-2 focus-visible:ring-ink/30'
          )}
        >
          {item.render(reduced)}

          <div
            role="tooltip"
            className={cn(
              'pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2',
              'rounded-lg border border-border bg-white px-2.5 py-1.5 shadow-lg',
              'text-[11px] text-ink-muted whitespace-nowrap',
              'opacity-0 translate-y-1 transition-all duration-200',
              'group-hover:opacity-100 group-hover:translate-y-0',
              'group-focus-within:opacity-100 group-focus-within:translate-y-0'
            )}
          >
            {item.aria}
          </div>
        </div>
      ))}
    </div>
  );
}
