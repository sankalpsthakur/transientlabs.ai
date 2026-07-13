'use client';

import type { ReactNode } from 'react';
import { MotionProvider } from '@/components/providers/MotionProvider';
import type { StackModule, ModuleId } from '@/lib/stack/content';
import { StackNav } from './StackNav';
import { ModuleSection } from './ModuleSection';
import { StackGsapProvider } from './gsap/StackGsapProvider';
import { ModuleExperience as SatellitesExperience } from './modules/satellites';
import { ModuleExperience as DataCentersExperience } from './modules/data-centers';
import { ModuleExperience as NuclearExperience } from './modules/nuclear';
import { ModuleExperience as BatteriesExperience } from './modules/batteries';
import { ModuleExperience as AutonomyExperience } from './modules/autonomous-vehicles';
import type { MotionValue } from 'framer-motion';
import Link from 'next/link';
import { STACK_PATH } from '@/lib/stack/content';
import { enterpriseBriefs } from '@/lib/stack/enterprise';
import { EnterpriseBrief } from './EnterpriseBrief';

type VisualFn = (
  progress: MotionValue<number>,
  options: { reduced: boolean; accent: string; fullBleed?: boolean }
) => ReactNode;

const visuals: Record<ModuleId, VisualFn> = {
  satellites: (p, { reduced, accent, fullBleed }) => (
    <SatellitesExperience progress={p} reduced={reduced} accent={accent} fullBleed={fullBleed} />
  ),
  'data-centers': (p, { reduced, accent, fullBleed }) => (
    <DataCentersExperience progress={p} reduced={reduced} accent={accent} fullBleed={fullBleed} />
  ),
  nuclear: (p, { reduced, accent, fullBleed }) => (
    <NuclearExperience progress={p} reduced={reduced} accent={accent} fullBleed={fullBleed} />
  ),
  batteries: (p, { reduced, accent, fullBleed }) => (
    <BatteriesExperience progress={p} reduced={reduced} accent={accent} fullBleed={fullBleed} />
  ),
  'autonomous-vehicles': (p, { reduced, accent, fullBleed }) => (
    <AutonomyExperience progress={p} reduced={reduced} accent={accent} fullBleed={fullBleed} />
  ),
};

interface ModuleDeepDiveProps {
  module: StackModule;
}

export function ModuleDeepDive({ module }: ModuleDeepDiveProps) {
  const enterpriseBrief = enterpriseBriefs[module.id];
  return (
    <MotionProvider>
      <StackGsapProvider>
        <div className="min-h-screen bg-[#070605] text-white antialiased">
          <StackNav sectionMode={false} />
          <main className="pt-4">
            <div className="mx-auto max-w-6xl px-5 pt-20 md:px-8">
              <Link
                href={STACK_PATH}
                className="font-mono text-[11px] uppercase tracking-wider text-white/40 transition-colors hover:text-white/70"
              >
                ← Full stack narrative
              </Link>
            </div>
            <ModuleSection
              module={module}
              visual={visuals[module.id]}
              standalone
            />
            {enterpriseBrief ? <EnterpriseBrief module={module} brief={enterpriseBrief} /> : null}
            <section className="border-t border-white/10 px-5 py-16 md:px-8">
              <div className="mx-auto max-w-2xl">
                <h3 className="text-lg font-medium text-white">
                  {module.stakes.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {module.stakes.body}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {module.stakes.tension}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-white/45">
                  {module.scale.detail}
                </p>
              </div>
            </section>
          </main>
        </div>
      </StackGsapProvider>
    </MotionProvider>
  );
}
