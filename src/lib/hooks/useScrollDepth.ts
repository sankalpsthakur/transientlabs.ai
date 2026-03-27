'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

const MILESTONES = [25, 50, 75, 100] as const;

/**
 * Tracks scroll depth milestones (25/50/75/100%) and fires
 * GA4 `scroll_depth` events. Each milestone fires at most once per page load.
 */
export function useScrollDepth() {
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    fired.current = new Set();

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone);
          trackEvent('scroll_depth', { depth: milestone });
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
