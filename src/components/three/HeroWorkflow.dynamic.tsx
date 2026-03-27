'use client';

import dynamic from 'next/dynamic';
import { HeroWorkflowFallback } from './HeroWorkflowFallback';

/**
 * Dynamically imported HeroWorkflow component.
 *
 * Three.js and React Three Fiber are heavy libraries (~500KB+ gzipped).
 * By using next/dynamic with ssr: false, we:
 * 1. Prevent these chunks from being included in the initial bundle
 * 2. Only load them on the client when the component mounts
 * 3. Show a lightweight SVG fallback during loading
 *
 * The fallback uses Framer Motion (already in the bundle) to show
 * an animated 2D representation of the workflow while 3D loads.
 */
export const DynamicHeroWorkflow = dynamic(
  () => import('./HeroWorkflow').then((mod) => mod.HeroWorkflow),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <HeroWorkflowFallback className="w-full max-w-md opacity-60" />
      </div>
    ),
  }
);
