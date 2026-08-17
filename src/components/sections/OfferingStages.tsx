'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { useSectionProgress } from '@/components/stack/hooks/useSectionProgress';
import { useInViewMount } from '@/components/stack/webgl/useInViewMount';
import { cn } from '@/lib/utils';

const EnergyAuditExperience = dynamic(
  () => import('@/components/offerings/energy-audit').then((mod) => mod.ModuleExperience),
  { ssr: false }
);

const ScadaExperience = dynamic(
  () => import('@/components/offerings/scada-ignition').then((mod) => mod.ModuleExperience),
  { ssr: false }
);

const WorkflowExperience = dynamic(
  () => import('@/components/offerings/workflow-layer').then((mod) => mod.ModuleExperience),
  { ssr: false }
);

const DmrvExperience = dynamic(
  () => import('@/components/offerings/dmrv').then((mod) => mod.ModuleExperience),
  { ssr: false }
);

const STAGES = [
  {
    id: 'energy-audit',
    eyebrow: '01 · Energy audit',
    whyNow: 'Twelve months of bills become a tag list, clamp bands, and a handoff Ignition can accept.',
    Visual: EnergyAuditExperience,
  },
  {
    id: 'scada-ignition',
    eyebrow: '02 · SCADA / Ignition',
    whyNow: 'Those tags become the control layer: operating modes, SOP gates, and a named person allowed to arm them.',
    Visual: ScadaExperience,
  },
  {
    id: 'workflow-layer',
    eyebrow: '03 · Workflow layer',
    whyNow: 'MES, ERP, QMS, and finance sit on that layer. The cloud proposes. A named person arms.',
    Visual: WorkflowExperience,
  },
  {
    id: 'dmrv',
    eyebrow: '04 · Biochar DMRV',
    whyNow: 'Optional. Kiln batches become permanence a buyer will actually pay for.',
    Visual: DmrvExperience,
  },
] as const;

/** Highest-ratio stage wins so only one ModuleExperience (canvas + window keys) is mounted. */
function useLiveStage(count: number) {
  const ratios = useRef(Array.from({ length: count }, () => 0));
  const [live, setLive] = useState<number | null>(null);

  const setRatio = useCallback((index: number, ratio: number) => {
    ratios.current[index] = ratio;
    let next: number | null = null;
    let best = 0;
    for (let i = 0; i < ratios.current.length; i += 1) {
      const value = ratios.current[i];
      if (value > best) {
        best = value;
        next = i;
      }
    }
    setLive((prev) => (prev === next ? prev : next));
  }, []);

  return { live, setRatio };
}

function StagePlaceholder({ eyebrow }: { eyebrow: string }) {
  return (
    <div
      aria-hidden
      className="flex min-h-[min(72vh,36rem)] items-end rounded-[1.6rem] border border-border bg-paper-warm/50 p-6"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">{eyebrow}</p>
    </div>
  );
}

function OfferingStage({
  index,
  id,
  eyebrow,
  whyNow,
  Visual,
  live,
  reduced,
  onRatio,
}: {
  index: number;
  id: string;
  eyebrow: string;
  whyNow: string;
  Visual: (typeof STAGES)[number]['Visual'];
  live: boolean;
  reduced: boolean;
  onRatio: (index: number, ratio: number) => void;
}) {
  const { ref, progress } = useSectionProgress(['0 0', '1 1']);
  const { ref: viewRef, mounted } = useInViewMount('80px 0px');
  const active = live && mounted;

  useEffect(() => {
    const node = viewRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      onRatio(index, 1);
      return () => onRatio(index, 0);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onRatio(index, entry.isIntersecting ? entry.intersectionRatio : 0);
      },
      {
        threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
        rootMargin: '-12% 0px -18% 0px',
      }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      onRatio(index, 0);
    };
  }, [index, onRatio, viewRef]);

  // Scroll runway per stage was 155vh, which made the offerings block 30% of the
  // whole page. The sticky reveal still reads at 118vh.
  return (
    <article
      ref={ref}
      data-offering-stage={id}
      data-offering-live={live ? 'true' : 'false'}
      className={cn('relative border-t border-border', !reduced && 'md:min-h-[100vh]')}
    >
      <div
        className={cn(
          'flex flex-col justify-center py-8 sm:py-10',
          !reduced &&
            'md:sticky md:top-16 md:min-h-[calc(100dvh-4rem)] md:py-8 lg:top-[4.5rem] lg:min-h-[calc(100dvh-4.5rem)]'
        )}
      >
        <Container>
          <header className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">{eyebrow}</p>
            <p className="mt-3 text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
              {whyNow}
            </p>
          </header>
          <div ref={viewRef} className="mt-6 min-h-[min(72vh,36rem)]">
            {active ? (
              <Visual progress={progress} reduced={reduced} className="w-full max-w-none" />
            ) : (
              <StagePlaceholder eyebrow={eyebrow} />
            )}
          </div>
        </Container>
      </div>
    </article>
  );
}

export function OfferingStages() {
  const prefersReduced = useReducedMotion();
  const reduced = Boolean(prefersReduced);
  const { live, setRatio } = useLiveStage(STAGES.length);

  return (
    <section
      id="offerings"
      aria-labelledby="offerings-title"
      data-live-offering={live == null ? undefined : STAGES[live].id}
      className="border-y border-border bg-paper text-ink"
    >
      <div className="border-b border-border bg-paper-warm/40 py-8 sm:py-10">
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">Offerings</p>
          <h2
            id="offerings-title"
            className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Each layer only works if the one beneath it does.
          </h2>
        </Container>
      </div>

      {STAGES.map((stage, index) => (
        <OfferingStage
          key={stage.id}
          index={index}
          id={stage.id}
          eyebrow={stage.eyebrow}
          whyNow={stage.whyNow}
          Visual={stage.Visual}
          live={live === index}
          reduced={reduced}
          onRatio={setRatio}
        />
      ))}
    </section>
  );
}
