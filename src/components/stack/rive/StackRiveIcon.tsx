'use client';

import { cn } from '@/lib/utils';

export interface StackRiveIconProps {
  /** Path under public/ e.g. /stack/rive/orbit-icon.riv — reserved for authored assets */
  src?: string;
  className?: string;
  label?: string;
  fallback?: string;
  accent?: string;
}

/**
 * Icon-scale diagram slot for Rive.
 *
 * Production path: author `.riv` in public/stack/rive/ and replace this
 * with a thin `useRive` wrapper. Until then we render a stable CSS fallback
 * so layout and a11y are production-ready without missing assets.
 *
 * Package installed: `@rive-app/react-canvas`
 */
export function StackRiveIcon({
  className,
  label = 'Diagram',
  fallback = '◎',
  accent = '#7EA2FF',
}: StackRiveIconProps) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 font-mono text-lg',
        className
      )}
      style={{ color: accent }}
      role="img"
      aria-label={label}
      data-rive-slot="pending-asset"
    >
      {fallback}
    </div>
  );
}
