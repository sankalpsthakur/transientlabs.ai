'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { m, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

export interface Overlay3DProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  fixedProgress?: number;
}

export interface OverlayProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const chipBase: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 10,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  padding: '3px 8px',
  borderRadius: 4,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(6,12,10,0.72)',
  backdropFilter: 'blur(6px)',
  color: 'rgba(255,255,255,0.7)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  userSelect: 'none',
};

/**
 * In-scene layer callouts (Html). Opacity mutated on the DOM — no React re-renders.
 * Macro labels only; MicroZoom is instrument geometry without floating HTML.
 */
export function Overlay3D({
  progress,
  accent = '#5CE1A8',
  fixedProgress,
}: Overlay3DProps) {
  const containmentRef = useRef<HTMLDivElement>(null);
  const vesselRef = useRef<HTMLDivElement>(null);
  const assemblyRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const p = fixedProgress != null ? fixedProgress : progress.get();
    const containmentFade = smoothstep(0.08, 0.28, p);
    const vesselFade = smoothstep(0.22, 0.42, p);
    const assemblyReveal = smoothstep(0.36, 0.5, p);
    const microHandoff = smoothstep(0.52, 0.64, p);

    if (containmentRef.current) {
      containmentRef.current.style.opacity = String(
        lerp(1, 0.08, containmentFade) * (1 - microHandoff)
      );
    }
    if (vesselRef.current) {
      vesselRef.current.style.opacity = String(
        lerp(1, 0.1, vesselFade) * (1 - microHandoff)
      );
    }
    if (assemblyRef.current) {
      assemblyRef.current.style.opacity = String(
        lerp(0.2, 1, assemblyReveal) * (1 - microHandoff)
      );
    }
  });

  return (
    <group>
      <Html position={[1.55, 1.05, 0.2]} center zIndexRange={[20, 0]}>
        <div ref={containmentRef} style={chipBase}>
          Containment
        </div>
      </Html>

      <Html position={[1.05, 0.35, 0.15]} center zIndexRange={[20, 0]}>
        <div ref={vesselRef} style={chipBase}>
          Pressure vessel
        </div>
      </Html>

      <Html position={[0.55, -0.05, 0.35]} center zIndexRange={[20, 0]}>
        <div
          ref={assemblyRef}
          style={{
            ...chipBase,
            borderColor: `${accent}55`,
            color: accent,
            fontWeight: 600,
          }}
        >
          Fuel assembly
        </div>
      </Html>
    </group>
  );
}

/**
 * DOM stage chip — compact companion to ScaleLadderHUD.
 * Framer MotionValues keep this free of R3F re-renders.
 */
export function Overlay({
  progress,
  accent = '#5CE1A8',
  reduced = false,
}: OverlayProps) {
  const stageOpacity = useTransform(
    progress,
    [0.02, 0.08, 0.94, 1],
    [0, 1, 1, 0.85]
  );
  const stageLabel = useTransform(progress, (p): string => {
    if (reduced) return 'ASSEMBLY · FISSION GRAIN';
    if (p < 0.12) return 'PAD · SMR vs GW FOOTPRINT';
    if (p < 0.28) return 'LAYER 01 · CONTAINMENT';
    if (p < 0.42) return 'LAYER 02 · PRESSURE VESSEL';
    if (p < 0.55) return 'LAYER 03 · FUEL ASSEMBLY';
    if (p < 0.68) return 'PELLET · UO₂ CERAMIC';
    if (p < 0.85) return 'FISSION · NUCLEUS SPLIT';
    return 'NEUTRON ECONOMY · CONTROL LOOP';
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-5">
      <m.div
        className="self-start rounded-md border border-white/10 bg-black/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 backdrop-blur-sm sm:text-[11px]"
        style={{
          opacity: reduced ? 1 : stageOpacity,
          borderColor: `${accent}33`,
        }}
      >
        <m.span>{stageLabel}</m.span>
      </m.div>

      {/* Bottom reserved for ScaleLadderHUD */}
      <div />
    </div>
  );
}
