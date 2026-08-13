'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceTier } from '@/components/stack/hooks/useDeviceTier';
import { useInViewMount } from '@/components/stack/webgl';
import { PAPER } from './model';

export function PaperCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, mounted } = useInViewMount('220px 0px');
  const tier = useDeviceTier();
  const high = tier === 'high';

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl border border-border bg-paper',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 42%, rgba(255,255,255,0.45) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
            loading kiln
          </span>
        </div>
      )}
      {mounted && (
        <Canvas
          dpr={[1, high ? 1.5 : 1.25]}
          frameloop="demand"
          gl={{
            antialias: high,
            alpha: true,
            powerPreference: high ? 'high-performance' : 'default',
          }}
          camera={{ position: [3.2, 1.55, 3.8], fov: 36, near: 0.05, far: 80 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <color attach="background" args={[PAPER]} />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
