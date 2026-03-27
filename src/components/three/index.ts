/**
 * Three.js / React Three Fiber components - Lazy loaded for performance
 *
 * These components use dynamic imports with ssr: false to prevent
 * Three.js chunks from loading on initial page load. The heavy 3D
 * libraries (~500KB+ gzipped) are only fetched when the component
 * mounts on the client.
 */

export { HeroWorkflowFallback } from './HeroWorkflowFallback';
export { DynamicHeroWorkflow, DynamicHeroWorkflow as HeroWorkflow } from './HeroWorkflow.dynamic';
