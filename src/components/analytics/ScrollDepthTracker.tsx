'use client';

import { useScrollDepth } from '@/lib/hooks/useScrollDepth';

/** Drop this in the root layout to enable scroll-depth GA4 events site-wide. */
export function ScrollDepthTracker() {
  useScrollDepth();
  return null;
}
