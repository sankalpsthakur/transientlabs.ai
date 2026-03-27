/**
 * Canvas / Three.js components - Lazy loaded for performance
 *
 * These components use dynamic imports with ssr: false to prevent
 * Three.js chunks from loading on initial page load.
 */

import dynamic from 'next/dynamic';

/**
 * Dynamically imported Scene component wrapper.
 * Use this instead of importing Scene directly to avoid
 * bundling Three.js in the initial load.
 */
export const DynamicScene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => null,
});

/**
 * Dynamically imported BitsToAtoms component.
 * Must be used inside a Canvas/Scene context.
 */
export const DynamicBitsToAtoms = dynamic(
  () => import('./BitsToAtoms').then((mod) => mod.BitsToAtoms),
  {
    ssr: false,
    loading: () => null,
  }
);
