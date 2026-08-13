'use client';

import { Edges, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, MeshStandardMaterial } from 'three';
import { Color, Vector3 } from 'three';
import {
  FOREST,
  INK,
  LEDGER,
  MONITORING_POINTS,
  SIGNAL,
  STEEL,
  STEEL_DARK,
} from './model';
import type { DmrvTier } from './types';
import { lerp, smoothstep } from './math';

const CABINET: [number, number, number] = [0.18, -0.08, -1.18];

export function Sensors({
  tier,
  stageIndex,
  reduced,
}: {
  tier: DmrvTier;
  stageIndex: number;
  reduced: boolean;
}) {
  const root = useRef<Group>(null);
  const heads = useRef<Array<MeshStandardMaterial | null>>([]);
  const cabinet = useRef<Group>(null);
  const gate = useRef<Group>(null);
  const book = useRef<Group>(null);
  const forest = useMemo(() => new Color(FOREST), []);
  const ink = useMemo(() => new Color(INK), []);
  const signal = useMemo(() => new Color(SIGNAL), []);

  const conduits = useMemo(
    () =>
      MONITORING_POINTS.map((point) => {
        const [x, y, z] = point.position;
        return [
          new Vector3(x, y, z),
          new Vector3(
            x * 0.45 + CABINET[0] * 0.55,
            y * 0.4 + 0.35,
            z * 0.4 + CABINET[2] * 0.4
          ),
          new Vector3(...CABINET),
        ];
      }),
    []
  );

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const integrate = smoothstep(0.4, 1.2, stageIndex);
    MONITORING_POINTS.forEach((point, i) => {
      const mat = heads.current[i];
      if (!mat) return;
      const cadence = point.cadence[tier];
      const absent = cadence === 'absent';
      const periodic = cadence === 'periodic';
      const live = !absent && stageIndex >= 1;
      const pulse =
        live && !reduced && periodic ? 0.35 + Math.sin(t * 1.1 + i) * 0.25 : 1;
      const target = absent ? 0.08 : live ? 0.22 + 0.55 * pulse * integrate : 0.12;
      mat.opacity = lerp(mat.opacity, target, 0.1);
      mat.emissiveIntensity = live ? (cadence === 'continuous' ? 0.28 : 0.12) : 0;
      mat.emissive.copy(cadence === 'continuous' ? forest : ink);
      mat.color.copy(absent ? ink : forest);
    });

    const showCabinet = (tier === 'mid' || tier === 'high') && stageIndex >= 1;
    if (cabinet.current) {
      cabinet.current.visible = showCabinet;
      const s = lerp(cabinet.current.scale.x || 0.01, showCabinet ? 1 : 0.01, 0.12);
      cabinet.current.scale.setScalar(s);
    }
    if (gate.current) {
      const show = tier === 'high' && stageIndex >= 1;
      gate.current.visible = show;
    }
    if (book.current) {
      book.current.visible = tier === 'low';
    }
  });

  return (
    <group ref={root}>
      {MONITORING_POINTS.map((point, i) => {
        const cadence = point.cadence[tier];
        return (
          <group key={point.id} position={point.position}>
            <mesh>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial
                color={STEEL}
                roughness={0.4}
                metalness={0.65}
              />
              <Edges threshold={18} color={INK} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.12, 8]} />
              <meshStandardMaterial
                ref={(el) => {
                  heads.current[i] = el;
                }}
                color={FOREST}
                emissive={FOREST}
                emissiveIntensity={0}
                transparent
                opacity={0.12}
                roughness={0.35}
                metalness={0.3}
              />
            </mesh>
            {cadence !== 'absent' && stageIndex >= 1 && (
              <Line
                points={conduits[i]}
                color={cadence === 'continuous' ? FOREST : LEDGER}
                transparent
                opacity={cadence === 'periodic' ? 0.22 : 0.45}
                dashed={cadence !== 'continuous'}
                dashSize={0.06}
                gapSize={0.04}
                lineWidth={1}
              />
            )}
          </group>
        );
      })}

      {/* Batch book — low tech */}
      <group ref={book} position={[-1.55, -0.28, 0.62]}>
        <mesh rotation={[-0.5, 0.3, 0.1]}>
          <boxGeometry args={[0.22, 0.04, 0.28]} />
          <meshStandardMaterial color={LEDGER} roughness={0.8} metalness={0} />
          <Edges threshold={16} color={INK} />
        </mesh>
      </group>

      {/* Photo plate — low / mid */}
      {(tier === 'low' || tier === 'mid') && (
        <mesh position={[-1.62, 0.22, 0.48]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.18, 0.14, 0.02]} />
          <meshStandardMaterial color="#d7c6b0" roughness={0.7} metalness={0} />
          <Edges threshold={16} color={INK} />
        </mesh>
      )}

      {/* Logger / edge cabinet */}
      <group ref={cabinet} position={CABINET}>
        <mesh>
          <boxGeometry
            args={tier === 'high' ? [0.42, 0.58, 0.28] : [0.32, 0.42, 0.22]}
          />
          <meshStandardMaterial
            color={STEEL_DARK}
            roughness={0.48}
            metalness={0.45}
          />
          <Edges threshold={18} color={INK} />
        </mesh>
        <mesh position={[0, 0.18, 0.15]}>
          <boxGeometry args={[0.22, 0.08, 0.01]} />
          <meshStandardMaterial
            color={tier === 'high' ? signal : forest}
            roughness={0.4}
            metalness={0.2}
            emissive={tier === 'high' ? signal : forest}
            emissiveIntensity={0.12}
          />
        </mesh>
      </group>

      {/* SOP gate — high only; authority does not orbit */}
      <group ref={gate} position={[0.18, -0.08, -0.78]}>
        <mesh position={[0, 0.22, 0]}>
          <torusGeometry args={[0.22, 0.016, 8, 20, Math.PI]} />
          <meshStandardMaterial
            color={LEDGER}
            roughness={0.4}
            metalness={0.35}
          />
        </mesh>
        <mesh position={[-0.2, 0.02, 0]}>
          <boxGeometry args={[0.03, 0.22, 0.03]} />
          <meshStandardMaterial color={LEDGER} roughness={0.45} metalness={0.3} />
        </mesh>
        <mesh position={[0.2, 0.02, 0]}>
          <boxGeometry args={[0.03, 0.22, 0.03]} />
          <meshStandardMaterial color={LEDGER} roughness={0.45} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
