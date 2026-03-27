'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const defaultAria =
  'Adaptive personalization architecture: user requests route through segment-specific adapters; memory stores keep consistent behavior; new segments are extracted into ML; context is injected without bloating prompts.';

type NodeId =
  | 'user'
  | 'router'
  | 'adapters'
  | 'memory'
  | 'ml'
  | 'injector'
  | 'llm';

const tooltips: Record<NodeId, string> = {
  user: 'User',
  router: 'Segment router',
  adapters: 'Segment-specific adapters with routing tool-calls',
  memory: 'Memory stores (mem0, supermemory) for consistent user behavior',
  ml: 'Continuous extraction of new segments back into traditional ML',
  injector: 'Trait-based context injection without bloating prompts',
  llm: 'LLM (compact prompts)',
};

export function PersonalizationDiagram({
  className,
  ariaLabel = defaultAria,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();

  const packet = reduced
    ? { opacity: 1, x: 0 }
    : { opacity: [0, 1, 1, 0], x: [0, 190, 190, 190] };

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'rounded-2xl border border-border bg-paper-warm/50 p-5 md:p-6 overflow-hidden',
        className
      )}
    >
      <div className="relative">
        <svg viewBox="0 0 360 180" className="w-full h-auto" fill="none" aria-hidden="true">
          {/* Links */}
          <path d="M50 58h60" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />
          <path d="M160 58h70" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />
          <path d="M250 58h60" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />
          <path d="M195 92v40" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />
          <path d="M195 132h80" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />
          <path d="M275 132v-26" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round" />

          {/* Loop arrow */}
          <path
            d="M160 132h-40c-12 0-22-10-22-22V92"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M96 92l6 6-10 1" fill="rgba(0,0,0,0.22)" />

          {/* Thin arrow to LLM */}
          <path d="M310 132h26" stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M336 132l-6-4v8l6-4Z" fill="rgba(0,0,0,0.12)" />

          {/* Nodes */}
          <rect x="10" y="42" width="40" height="32" rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(0,0,0,0.18)" />
          <rect x="110" y="42" width="50" height="32" rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(0,0,0,0.18)" />
          <rect x="230" y="42" width="80" height="32" rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(0,0,0,0.18)" />
          <rect x="170" y="132" width="50" height="32" rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(0,0,0,0.18)" />
          <rect x="275" y="116" width="60" height="32" rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(0,0,0,0.18)" />
          <rect x="60" y="116" width="60" height="32" rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(0,0,0,0.18)" />
          <rect x="275" y="42" width="60" height="32" rx="10" fill="rgba(255,255,255,0.0)" stroke="rgba(0,0,0,0.0)" />
          <rect x="310" y="116" width="50" height="32" rx="10" fill="rgba(255,255,255,0.0)" stroke="rgba(0,0,0,0.0)" />

          {/* Labels (kept minimal) */}
          <text x="30" y="62" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(0,0,0,0.75)">
            User
          </text>
          <text x="135" y="62" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(0,0,0,0.75)">
            Router
          </text>
          <text x="270" y="62" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(0,0,0,0.75)">
            Adapters
          </text>
          <text x="195" y="152" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(0,0,0,0.75)">
            Memory
          </text>
          <text x="305" y="136" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(0,0,0,0.75)">
            LLM
          </text>
          <text x="90" y="136" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(0,0,0,0.75)">
            ML
          </text>
          <text x="245" y="136" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(0,0,0,0.75)">
            Inject
          </text>

          {/* Adapters A/B/C */}
          <g opacity="0.7">
            <rect x="242" y="80" width="18" height="12" rx="4" fill="rgba(14,165,233,0.18)" stroke="rgba(14,165,233,0.35)" />
            <rect x="270" y="80" width="18" height="12" rx="4" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.35)" />
            <rect x="298" y="80" width="18" height="12" rx="4" fill="rgba(168,85,247,0.18)" stroke="rgba(168,85,247,0.35)" />
          </g>
        </svg>

        {/* Data packet animation */}
        {!reduced && (
          <m.div
            className="absolute left-[24px] top-[56px] h-2 w-2 rounded-full bg-ink/40"
            initial={false}
            animate={packet}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Interactive tooltips (keyboard accessible) */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {(
          [
            ['adapters', tooltips.adapters],
            ['memory', tooltips.memory],
            ['ml', tooltips.ml],
            ['injector', tooltips.injector],
          ] as Array<[NodeId, string]>
        ).map(([id, text]) => (
          <div
            key={id}
            tabIndex={0}
            className={cn(
              'group relative rounded-xl border border-border bg-white/60 px-3 py-2',
              'text-[11px] font-mono uppercase tracking-widest text-ink-muted',
              'outline-none focus-visible:ring-2 focus-visible:ring-ink/30'
            )}
            aria-label={text}
          >
            {id === 'adapters' ? 'Adapters' : id === 'injector' ? 'Injector' : id.toUpperCase()}
            <div
              role="tooltip"
              className={cn(
                'pointer-events-none absolute left-2 right-2 top-full mt-2',
                'rounded-lg border border-border bg-white px-2.5 py-2 shadow-lg',
                'text-[11px] normal-case tracking-normal font-sans text-ink-muted leading-relaxed',
                'opacity-0 translate-y-1 transition-all duration-200',
                'group-hover:opacity-100 group-hover:translate-y-0',
                'group-focus-within:opacity-100 group-focus-within:translate-y-0'
              )}
            >
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

