'use client';

import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group, MeshStandardMaterial as MeshStdMat } from 'three';
import { Color, DoubleSide, MeshStandardMaterial } from 'three';

export interface ReactorLayersProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  /** Hold a static reveal (reduced-motion / fallback) */
  fixedProgress?: number;
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

/**
 * Layered reactor cutaway: containment → pressure vessel → fuel assembly.
 * Peels outer shells, emphasizes rod lattice, then fades for MicroZoom grain.
 */
export function ReactorLayers({
  progress,
  accent = '#5CE1A8',
  reduced = false,
  fixedProgress,
}: ReactorLayersProps) {
  const rootRef = useRef<Group>(null);
  const containmentRef = useRef<Group>(null);
  const vesselRef = useRef<Group>(null);
  const coreGroupRef = useRef<Group>(null);
  const latticeRef = useRef<Group>(null);

  const containmentMat = useRef<MeshStdMat>(null);
  const containmentCapMat = useRef<MeshStdMat>(null);
  const containmentRingMat = useRef<MeshStdMat>(null);
  const vesselMat = useRef<MeshStdMat>(null);
  const vesselHeadMat = useRef<MeshStdMat>(null);
  const vesselRingMat = useRef<MeshStdMat>(null);
  const coreHaloMat = useRef<MeshStdMat>(null);
  const coreInnerMat = useRef<MeshStdMat>(null);

  const accentColor = useMemo(() => new Color(accent), [accent]);
  const shellDark = useMemo(() => new Color('#0d1612'), []);
  const vesselDark = useMemo(() => new Color('#121f1a'), []);

  const fuelMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.7,
        metalness: 0.2,
        roughness: 0.45,
        transparent: true,
        opacity: 0.85,
        toneMapped: false,
      }),
    [accentColor]
  );

  useEffect(() => () => fuelMat.dispose(), [fuelMat]);

  // Sparse fuel lattice — visual cue, not a CAD model
  const fuelRods = useMemo(() => {
    const rods: { x: number; z: number; h: number; highlight: boolean }[] = [];
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        if (i * i + j * j > 5.5) continue;
        rods.push({
          x: i * 0.1,
          z: j * 0.1,
          h: 0.52 + ((Math.abs(i) + Math.abs(j)) % 3) * 0.03,
          // Center-right rod is the extract target for MicroZoom pellet
          highlight: i === 1 && j === 1,
        });
      }
    }
    return rods;
  }, []);

  useFrame((state) => {
    const p = fixedProgress != null ? fixedProgress : progress.get();

    // Timeline aligned with scaleLadders.nuclear
    const containmentFade = smoothstep(0.08, 0.28, p);
    const vesselFade = smoothstep(0.22, 0.42, p);
    const coreReveal = smoothstep(0.32, 0.5, p);
    const assemblyFocus = smoothstep(0.38, 0.52, p);
    // Hand off to MicroZoom — macro core dissolves into grain
    const microHandoff = smoothstep(0.52, 0.66, p);

    const containmentOpacity = lerp(0.88, 0.04, containmentFade) * (1 - microHandoff);
    const vesselOpacity = lerp(0.92, 0.08, vesselFade) * (1 - microHandoff);
    const coreOpacity = lerp(0.35, 1, coreReveal) * (1 - microHandoff * 0.95);

    if (containmentRef.current) {
      const s = lerp(1, 1.12, containmentFade);
      containmentRef.current.scale.set(s, s * 1.18, s);
      containmentRef.current.position.x = lerp(0, 0.28, containmentFade);
      containmentRef.current.position.z = lerp(0, 0.16, containmentFade);
      containmentRef.current.visible = containmentOpacity > 0.02;
    }
    if (vesselRef.current) {
      const s = lerp(1, 1.08, vesselFade);
      vesselRef.current.scale.set(s, s * 1.1, s);
      vesselRef.current.position.x = lerp(0, 0.14, vesselFade);
      vesselRef.current.position.z = lerp(0, 0.08, vesselFade);
      vesselRef.current.visible = vesselOpacity > 0.02;
    }

    const applyShell = (
      mat: MeshStdMat | null,
      opacity: number,
      emis: number
    ) => {
      if (!mat) return;
      mat.opacity = opacity;
      mat.emissiveIntensity = emis;
    };

    applyShell(
      containmentMat.current,
      containmentOpacity,
      lerp(0.05, 0.012, containmentFade)
    );
    applyShell(
      containmentCapMat.current,
      containmentOpacity,
      lerp(0.05, 0.012, containmentFade)
    );
    applyShell(
      containmentRingMat.current,
      containmentOpacity * 0.85,
      lerp(0.12, 0.03, containmentFade)
    );
    applyShell(
      vesselMat.current,
      vesselOpacity,
      lerp(0.1, 0.025, vesselFade)
    );
    applyShell(
      vesselHeadMat.current,
      vesselOpacity,
      lerp(0.1, 0.025, vesselFade)
    );
    applyShell(
      vesselRingMat.current,
      vesselOpacity * 0.85,
      lerp(0.15, 0.04, vesselFade)
    );

    const t = state.clock.elapsedTime;
    const pulse = reduced ? 0 : Math.sin(t * 1.55) * 0.14 * coreReveal;
    const coreEmissive =
      lerp(0.3, 1.2, coreReveal) * (1 + pulse) * (1 - microHandoff);

    if (coreHaloMat.current) {
      // Halo recedes as lattice emphasis takes over
      coreHaloMat.current.opacity =
        coreOpacity * lerp(0.42, 0.12, assemblyFocus);
      coreHaloMat.current.emissiveIntensity = coreEmissive * 0.55;
    }
    if (coreInnerMat.current) {
      coreInnerMat.current.opacity =
        coreOpacity * lerp(1, 0.15, assemblyFocus);
      coreInnerMat.current.emissiveIntensity = coreEmissive;
    }

    // Lattice: scale pitch slightly open for assembly reading
    if (latticeRef.current) {
      const pitch = lerp(1, 1.18, assemblyFocus);
      latticeRef.current.scale.set(pitch, 1, pitch);
    }

    fuelMat.opacity = coreOpacity * lerp(0.85, 1, assemblyFocus);
    fuelMat.emissiveIntensity =
      coreEmissive * lerp(0.55, 0.95, assemblyFocus);

    if (coreGroupRef.current) {
      const s =
        lerp(0.9, 1, coreReveal) *
        lerp(1, 1.12, assemblyFocus) *
        lerp(1, 0.4, microHandoff);
      coreGroupRef.current.scale.setScalar(s);
      coreGroupRef.current.visible = coreOpacity > 0.02 || assemblyFocus > 0.02;
    }

    if (rootRef.current) {
      if (reduced) {
        rootRef.current.rotation.set(0.08, -0.28, 0);
      } else {
        // Ease rotation as we enter micro (schematic stays readable)
        const rotBlend = 1 - microHandoff * 0.7;
        rootRef.current.rotation.y =
          lerp(-0.55, -0.18, Math.min(1, p * 1.1)) * rotBlend;
        rootRef.current.rotation.x = lerp(0.14, 0.04, p) * rotBlend;
      }
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.05, 0]}>
      {/* —— Containment (outer) —— */}
      <group ref={containmentRef}>
        <mesh>
          <cylinderGeometry args={[1.35, 1.42, 2.35, 40, 1, true]} />
          <meshStandardMaterial
            ref={containmentMat}
            color={shellDark}
            emissive={accentColor}
            emissiveIntensity={0.05}
            metalness={0.62}
            roughness={0.34}
            transparent
            opacity={0.88}
            depthWrite={false}
            side={DoubleSide}
          />
          <Edges threshold={22} color={accent} />
        </mesh>
        <mesh position={[0, 1.22, 0]}>
          <sphereGeometry
            args={[1.35, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            ref={containmentCapMat}
            color={shellDark}
            emissive={accentColor}
            emissiveIntensity={0.05}
            metalness={0.62}
            roughness={0.34}
            transparent
            opacity={0.88}
            depthWrite={false}
            side={DoubleSide}
          />
          <Edges threshold={22} color={accent} />
        </mesh>
        <mesh position={[0, -1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.38, 0.035, 8, 48]} />
          <meshStandardMaterial
            ref={containmentRingMat}
            color={shellDark}
            emissive={accentColor}
            emissiveIntensity={0.12}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.75}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* —— Pressure vessel —— */}
      <group ref={vesselRef}>
        <mesh>
          <cylinderGeometry args={[0.78, 0.82, 1.55, 36, 1, true]} />
          <meshStandardMaterial
            ref={vesselMat}
            color={vesselDark}
            emissive={accentColor}
            emissiveIntensity={0.1}
            metalness={0.72}
            roughness={0.28}
            transparent
            opacity={0.92}
            depthWrite={false}
            side={DoubleSide}
          />
          <Edges threshold={20} color="#7aefc0" />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <sphereGeometry
            args={[0.78, 36, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            ref={vesselHeadMat}
            color={vesselDark}
            emissive={accentColor}
            emissiveIntensity={0.1}
            metalness={0.72}
            roughness={0.28}
            transparent
            opacity={0.92}
            depthWrite={false}
            side={DoubleSide}
          />
          <Edges threshold={20} color="#7aefc0" />
        </mesh>
        <mesh position={[0, -0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.028, 8, 40]} />
          <meshStandardMaterial
            ref={vesselRingMat}
            color={vesselDark}
            emissive={accentColor}
            emissiveIntensity={0.15}
            metalness={0.7}
            roughness={0.28}
            transparent
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* —— Core + fuel assembly lattice —— */}
      <group ref={coreGroupRef} position={[0, 0.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.52, 28, 20]} />
          <meshStandardMaterial
            ref={coreHaloMat}
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.5}
            metalness={0.1}
            roughness={0.55}
            transparent
            opacity={0.4}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.28, 24, 18]} />
          <meshStandardMaterial
            ref={coreInnerMat}
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1}
            metalness={0.05}
            roughness={0.4}
            transparent
            opacity={1}
            toneMapped={false}
          />
        </mesh>
        <group ref={latticeRef}>
          {fuelRods.map((rod, i) => (
            <mesh
              key={i}
              position={[rod.x, 0, rod.z]}
              material={fuelMat}
              scale={rod.highlight ? 1.15 : 1}
            >
              <cylinderGeometry
                args={[
                  rod.highlight ? 0.022 : 0.018,
                  rod.highlight ? 0.022 : 0.018,
                  rod.h,
                  5,
                ]}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
