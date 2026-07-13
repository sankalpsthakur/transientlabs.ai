'use client';

import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'medium' | 'low' | 'unknown';

/**
 * Lightweight capability probe for progressive enhancement.
 * High: full motion + optional WebGL
 * Medium: CSS/SVG scroll scrub, no heavy 3D
 * Low: static keyframes + reduced animation
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setTier('low');
      return;
    }

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
      gpu?: unknown;
    };

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const saveData = nav.connection?.saveData === true;
    const slowNet =
      nav.connection?.effectiveType === '2g' ||
      nav.connection?.effectiveType === 'slow-2g';
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (saveData || slowNet || memory <= 2 || cores <= 2) {
      setTier('low');
      return;
    }

    if (isMobile && memory <= 4) {
      setTier('medium');
      return;
    }

    if (cores >= 8 && memory >= 8) {
      setTier('high');
      return;
    }

    setTier(isMobile ? 'medium' : 'high');
  }, []);

  return tier;
}
