'use client';

import { useCallback, useEffect, useMemo, type KeyboardEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';
import { DEFAULT_ACCENT, PORTALS, STRATA } from './constants';
import { FirmCanvas } from './FirmCanvas';
import { FirmFallback } from './FirmFallback';
import { Overlay } from './Overlay';
import { Scene } from './Scene';
import type { FirmExperienceProps, FirmPortal, FirmStratum } from './types';
import { useFirmInteraction } from './useFirmInteraction';

const PORTAL_KEYS: Record<string, FirmPortal> = {
  '1': 'plant',
  '2': 'finance',
  '3': 'evidence',
};

/**
 * Firm nucleus — Long Exposure rings pierce a still control slab.
 * Systems take one orbit. Portals are visual handoff cues only.
 */
export function ModuleExperience({
  progress,
  accent = DEFAULT_ACCENT,
  reduced,
  className,
  fullBleed = false,
  onPortal,
  initialPortal = null,
}: FirmExperienceProps) {
  const prefersReduced = useReducedMotion();
  const tier = useDeviceTier();
  const quiet = reduced ?? prefersReduced ?? false;
  const useFallback = quiet || tier === 'low';
  const interaction = useFirmInteraction(initialPortal, onPortal);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        interaction.reset();
        return;
      }
      if (event.key === 'm' || event.key === 'M') {
        interaction.armMark();
        return;
      }
      const portal = PORTAL_KEYS[event.key];
      if (portal) {
        event.preventDefault();
        interaction.selectPortal(portal);
        return;
      }
      if (event.key === '[' || event.key === ']') {
        event.preventDefault();
        const ids = STRATA.map((item) => item.id);
        const idx = interaction.stratum ? ids.indexOf(interaction.stratum) : -1;
        const next =
          event.key === ']'
            ? ids[(idx + 1) % ids.length]
            : ids[(idx - 1 + ids.length) % ids.length];
        interaction.selectStratum(next as FirmStratum);
      }
    },
    [interaction]
  );

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  const label = useMemo(() => {
    const portal = PORTALS.find((item) => item.id === interaction.portal);
    return portal
      ? `${portal.hrefHint}. ${portal.cue}`
      : 'Long Exposure firm nucleus. Three rings pierce a control slab. Existing systems on one orbit. Portals are visual handoffs only.';
  }, [interaction.portal]);

  return (
    <div
      data-firm-experience=""
      data-firm-fallback={useFallback ? 'true' : undefined}
      data-full-bleed={fullBleed || undefined}
      tabIndex={0}
      role="region"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        'relative mx-auto aspect-[4/5] w-full max-w-lg outline-none focus-visible:ring-2 focus-visible:ring-[#1f3f93]/40',
        fullBleed && 'lg:h-[100dvh] lg:max-w-none lg:aspect-auto',
        className
      )}
    >
      {useFallback ? (
        <FirmFallback accent={accent} interaction={interaction} />
      ) : (
        <FirmCanvas
          className="h-full max-w-none w-full"
          reduced={quiet}
          fullBleed={fullBleed}
        >
          <Scene
            progress={progress}
            accent={accent}
            reduced={quiet}
            interaction={interaction}
          />
        </FirmCanvas>
      )}
      <Overlay
        progress={progress}
        accent={accent}
        reduced={quiet}
        interaction={interaction}
      />
    </div>
  );
}

export default ModuleExperience;
