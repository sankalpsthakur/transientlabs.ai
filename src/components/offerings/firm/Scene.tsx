'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { ControlSlab } from './ControlSlab';
import { LongExposureRings } from './LongExposureRings';
import { PortalRings } from './PortalRings';
import { SystemChips } from './SystemChips';
import { FIRM_COLORS } from './constants';
import { mixCam, PORTAL_CAM, sampleCamera } from './math';
import type { FirmInteraction } from './types';

interface SceneProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  interaction: FirmInteraction;
}

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function PaperDust({ reduced }: { reduced: boolean }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = reduced ? 40 : 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (seeded(i, 1) - 0.5) * 12;
      positions[i * 3 + 1] = (seeded(i, 2) - 0.5) * 6.5;
      positions[i * 3 + 2] = (seeded(i, 3) - 0.5) * 10;
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [reduced]);

  useEffect(() => {
    return () => {
      geo.dispose();
    };
  }, [geo]);

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial
        color="#c4b49a"
        size={0.018}
        transparent
        opacity={0.32}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Firm nucleus scene. Rings smear. Slab stays. Chips take one orbit.
 * Portal selection mixes camera toward a handoff cue — no sibling imports.
 */
export function Scene({
  progress,
  accent = FIRM_COLORS.signal,
  reduced = false,
  interaction,
}: SceneProps) {
  const { camera, invalidate } = useThree();
  const look = useRef(new THREE.Vector3());
  const mixRef = useRef(0);

  useFrame((_, delta) => {
    const raw = progress.get();
    const p = reduced ? 0.55 : raw;
    const base = sampleCamera(p);
    const targetMix = interaction.portal ? 1 : 0;
    mixRef.current = THREE.MathUtils.damp(mixRef.current, targetMix, 4.2, delta);
    const framed = interaction.portal
      ? mixCam(base, PORTAL_CAM[interaction.portal], mixRef.current)
      : base;

    camera.position.set(framed.pos[0], framed.pos[1], framed.pos[2]);
    look.current.set(framed.look[0], framed.look[1], framed.look[2]);
    camera.lookAt(look.current);

    const persp = camera as THREE.PerspectiveCamera;
    if (Math.abs(persp.fov - framed.fov) > 0.04) {
      persp.fov = framed.fov;
      persp.updateProjectionMatrix();
    }

    invalidate();
  });

  return (
    <group>
      <color attach="background" args={[FIRM_COLORS.paper]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[6, 8, 4]} intensity={0.55} color="#fff8ee" />
      <directionalLight position={[-4, 2, -3]} intensity={0.22} color={accent} />
      <pointLight
        position={[0.4, 1.6, 1.4]}
        intensity={0.28}
        color={FIRM_COLORS.goldSoft}
        distance={10}
        decay={2}
      />

      <PaperDust reduced={reduced} />
      <LongExposureRings
        progress={progress}
        accent={accent}
        reduced={reduced}
        interaction={interaction}
      />
      <ControlSlab
        progress={progress}
        reduced={reduced}
        interaction={interaction}
      />
      <SystemChips
        progress={progress}
        reduced={reduced}
        interaction={interaction}
      />
      <PortalRings interaction={interaction} reduced={reduced} />
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.18}
        scale={14}
        blur={2.6}
        far={6}
      />
    </group>
  );
}
