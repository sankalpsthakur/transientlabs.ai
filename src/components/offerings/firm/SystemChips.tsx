'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { CHIP_ORBIT_R, FIRM_COLORS, SYSTEMS } from './constants';
import { lerp, smoothstep } from './math';
import type { FirmInteraction } from './types';

interface SystemChipsProps {
  progress: MotionValue<number>;
  reduced?: boolean;
  interaction: FirmInteraction;
}

const CHIP: [number, number, number] = [0.46, 0.09, 0.3];

/**
 * Five existing-system chips ease onto one equatorial orbit.
 * Gold traces run to the still slab. Work may orbit; authority does not.
 */
export function SystemChips({
  progress,
  reduced = false,
  interaction,
}: SystemChipsProps) {
  const root = useRef<THREE.Group>(null);
  const chipRefs = useRef<Array<THREE.Group | null>>([]);
  const phase = useRef(0);

  const traces = useMemo(() => {
    return SYSTEMS.map((_, i) => {
      const a = (i / SYSTEMS.length) * Math.PI * 2 - Math.PI / 2;
      const outer = new THREE.Vector3(
        Math.cos(a) * CHIP_ORBIT_R,
        0.16,
        Math.sin(a) * CHIP_ORBIT_R
      );
      const inner = new THREE.Vector3(Math.cos(a) * 1.05, 0.04, Math.sin(a) * 1.05);
      const mid = outer.clone().lerp(inner, 0.5);
      mid.y += 0.18;
      return new THREE.QuadraticBezierCurve3(outer, mid, inner).getPoints(18);
    });
  }, []);

  useFrame((_, delta) => {
    const raw = progress.get();
    const p = reduced ? 0.55 : raw;
    const ease = smoothstep(0.06, 0.38, p);
    if (!reduced) phase.current += delta * 0.045;
    const yaw = reduced ? 0.12 : phase.current;

    if (root.current) {
      root.current.rotation.y = yaw;
    }

    chipRefs.current.forEach((node, i) => {
      if (!node) return;
      const a = (i / SYSTEMS.length) * Math.PI * 2 - Math.PI / 2;
      const r = lerp(3.15, CHIP_ORBIT_R, ease);
      node.position.set(Math.cos(a) * r, 0.16, Math.sin(a) * r);
      node.rotation.y = -a + Math.PI / 2;
      node.rotation.x = -0.18;
      const active = interaction.system === SYSTEMS[i].id;
      node.scale.setScalar(active ? 1.12 : 1);
      node.visible = ease > 0.04;
    });
  });

  return (
    <group ref={root}>
      {SYSTEMS.map((sys, i) => {
        const active = interaction.system === sys.id;
        return (
          <group
            key={sys.id}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
          >
            <RoundedBox
              args={CHIP}
              radius={0.04}
              smoothness={3}
              onClick={(e) => {
                e.stopPropagation();
                interaction.selectSystem(sys.id);
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = '';
              }}
            >
              <meshStandardMaterial
                color={FIRM_COLORS.paper}
                roughness={0.5}
                metalness={0.05}
                emissive={active ? FIRM_COLORS.gold : FIRM_COLORS.signal}
                emissiveIntensity={active ? 0.18 : 0.04}
              />
            </RoundedBox>
            <Text
              position={[0, 0, CHIP[2] / 2 + 0.012]}
              fontSize={0.085}
              color={FIRM_COLORS.ink}
              anchorX="center"
              anchorY="middle"
            >
              {sys.label}
            </Text>
          </group>
        );
      })}

      {traces.map((pts, i) => {
        const active = interaction.system === SYSTEMS[i].id;
        return (
          <Line
            key={SYSTEMS[i].id}
            points={pts}
            color={FIRM_COLORS.gold}
            lineWidth={active ? 1.6 : 1}
            transparent
            opacity={active ? 0.72 : 0.28}
          />
        );
      })}
    </group>
  );
}
