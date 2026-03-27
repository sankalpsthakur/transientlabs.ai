'use client';

import { m, useReducedMotion } from 'framer-motion';
import { Cloud, Code2, Sparkles, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultAria =
  'A production-ready MVP with full-stack architecture and AI integration. Perfect for validating your concept with real users.';

const layers = [
  { id: 'infra', label: 'Infrastructure', icon: Cloud },
  { id: 'api', label: 'Code + API', icon: Code2 },
  { id: 'ui', label: 'UI + AI', icon: Sparkles },
  { id: 'users', label: 'Validation', icon: Users },
] as const;

export function SprintVisualization({
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
        'rounded-2xl border border-border bg-paper-warm/60 p-4 overflow-hidden',
        className
      )}
    >
      <div className="space-y-2">
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <m.div
              key={layer.id}
              className={cn(
                'flex items-center gap-3 rounded-xl border border-border bg-white/70 px-3 py-2.5'
              )}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: reduced ? 0 : 0.08 * idx }}
            >
              <div className="w-9 h-9 rounded-xl border border-border bg-paper flex items-center justify-center">
                <Icon className="w-5 h-5 text-ink" aria-hidden="true" />
              </div>
              <div className="h-2.5 flex-1 rounded bg-ink/5" aria-hidden="true" />
            </m.div>
          );
        })}
      </div>

      <m.div
        className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-ink-muted"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: reduced ? 0 : 0.45 }}
        aria-hidden="true"
      >
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
      </m.div>
    </div>
  );
}
