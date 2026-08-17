'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { FIRM_COLORS, STRATA } from './constants';
import { lerp, smoothstep } from './math';
import type { FirmInteraction } from './types';

interface ControlSlabProps {
  progress: MotionValue<number>;
  reduced?: boolean;
  interaction: FirmInteraction;
}

const LAYER: [number, number, number] = [2.05, 0.1, 1.28];

/**
 * Still authority object. Four strata — MAP / RULES / ACTIONS / TRACE —
 * explode along Y as progress advances. Work may orbit; this does not.
 */
export function ControlSlab({
  progress,
  reduced = false,
  interaction,
}: ControlSlabProps) {
  const group = useRef<THREE.Group>(null);
  const layerRefs = useRef<Array<THREE.Group | null>>([]);

  useFrame(() => {
    const raw = progress.get();
    const p = reduced ? 0.55 : raw;
    const explode = lerp(0.045, 0.155, smoothstep(0.28, 0.78, p));
    const selected = interaction.stratum;

    layerRefs.current.forEach((node, i) => {
      if (!node) return;
      const baseY = (1.5 - i) * explode;
      const lift =
        selected && STRATA[i].id === selected ? explode * 0.85 : 0;
      node.position.y = baseY + lift;
      node.position.x = (i - 1.5) * 0.035;
      node.position.z = (i - 1.5) * 0.02;
    });
  });

  return (
    <group ref={group} position={[0, 0.02, 0]}>
      {STRATA.map((stratum, i) => {
        const active = interaction.stratum === stratum.id;
        return (
          <group
            key={stratum.id}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
          >
            <RoundedBox
              args={LAYER}
              radius={0.045}
              smoothness={4}
              onClick={(e) => {
                e.stopPropagation();
                interaction.selectStratum(stratum.id);
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = '';
              }}
            >
              <meshStandardMaterial
                color={FIRM_COLORS.ink}
                roughness={0.46}
                metalness={0.12}
                emissive={active ? FIRM_COLORS.gold : FIRM_COLORS.ink}
                emissiveIntensity={active ? 0.22 : 0.04}
              />
              <Edges
                scale={1.003}
                color={active ? FIRM_COLORS.goldSoft : FIRM_COLORS.gold}
                threshold={18}
              />
            </RoundedBox>
            <Text
              position={[0, LAYER[1] / 2 + 0.012, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.13}
              color={FIRM_COLORS.paper}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.12}
            >
              {stratum.label}
            </Text>
            <Text
              position={[0, LAYER[1] / 2 + 0.012, 0.28]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.055}
              color={FIRM_COLORS.goldSoft}
              anchorX="center"
              anchorY="middle"
              maxWidth={1.6}
            >
              {stratum.sub}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
