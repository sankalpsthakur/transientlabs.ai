'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { FIRM_COLORS, PORTAL_ORBIT_R, PORTALS } from './constants';
import { portalWorld } from './math';
import type { FirmInteraction, FirmPortal } from './types';

interface PortalRingsProps {
  interaction: FirmInteraction;
  reduced?: boolean;
}

const PORTAL_COLOR: Record<FirmPortal, string> = {
  plant: FIRM_COLORS.signal,
  finance: FIRM_COLORS.ledger,
  evidence: FIRM_COLORS.forest,
};

/**
 * Plant / Finance / Evidence — visual handoff cues only.
 * Clicking dollies the camera; it does not import sibling offerings.
 */
export function PortalRings({ interaction, reduced = false }: PortalRingsProps) {
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const positions = useMemo(
    () => PORTALS.map((_, i) => portalWorld(i, PORTAL_ORBIT_R)),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const id = PORTALS[i].id;
      const on = interaction.portal === id;
      const pulse = reduced ? 1 : 1 + Math.sin(t * 1.4 + i) * (on ? 0.04 : 0.012);
      mesh.scale.setScalar((on ? 1.18 : 1) * pulse);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = on ? 0.92 : 0.42;
      mat.emissiveIntensity = on ? 0.45 : 0.12;
    });
  });

  return (
    <group>
      {PORTALS.map((portal, i) => {
        const pos = positions[i];
        const color = PORTAL_COLOR[portal.id];
        const on = interaction.portal === portal.id;
        return (
          <group key={portal.id} position={pos.toArray()}>
            <mesh
              ref={(el) => {
                meshRefs.current[i] = el;
              }}
              rotation={[Math.PI / 2.15, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                interaction.selectPortal(portal.id);
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = '';
              }}
            >
              <torusGeometry args={[0.36, 0.018, 10, 48]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={on ? 0.45 : 0.12}
                roughness={0.4}
                metalness={0.18}
                transparent
                opacity={on ? 0.92 : 0.42}
                depthWrite={false}
              />
            </mesh>
            <Text
              position={[0, 0.42, 0]}
              fontSize={0.09}
              color={color}
              anchorX="center"
              anchorY="middle"
            >
              {portal.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
