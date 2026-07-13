'use client';

import type { ReactNode } from 'react';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { getStackModules } from '@/lib/stack/cms';
import { StackNav } from './StackNav';
import { StackProgress } from './StackProgress';
import { StackHero } from './StackHero';
import { StackCloser } from './StackCloser';
import { ModuleSection } from './ModuleSection';
import { StackGsapProvider } from './gsap/StackGsapProvider';
import { ModuleExperience as SatellitesExperience } from './modules/satellites';
import { ModuleExperience as DataCentersExperience } from './modules/data-centers';
import { ModuleExperience as NuclearExperience } from './modules/nuclear';
import { ModuleExperience as BatteriesExperience } from './modules/batteries';
import { ModuleExperience as AutonomyExperience } from './modules/autonomous-vehicles';
import type { MotionValue } from 'framer-motion';
import type { ModuleId } from '@/lib/stack/content';

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

export function StackExperience() {
  const modules = getStackModules();

  return (
    <MotionProvider>
      <StackGsapProvider>
        <div className="min-h-screen bg-[#070605] text-white antialiased">
          <StackNav sectionMode />
          <StackProgress />
          <main>
            <StackHero />
            {modules.map((mod) => (
              <ModuleSection
                key={mod.id}
                module={mod}
                visual={visuals[mod.id]}
              />
            ))}
            <StackCloser />
          </main>
        </div>
      </StackGsapProvider>
    </MotionProvider>
  );
}
