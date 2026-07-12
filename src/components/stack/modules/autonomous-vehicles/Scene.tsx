'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import type { Group } from 'three';
import * as THREE from 'three';
import { Vehicle } from './Vehicle';
import { Sensors } from './Sensors';
import { PerceptionOverlay } from './PerceptionOverlay';
import { DecisionTree } from './DecisionTree';
import { MicroZoom } from './MicroZoom';

export interface SceneProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Scroll-scrubbed AV stage: street → vehicle → sensors → ray/pixel/feature → control.
 * Camera dolly continues inward for micro grain; all motion via progress.get() in useFrame.
 */
export function Scene({
  progress,
  accent = '#C4A1FF',
  reduced = false,
}: SceneProps) {
  const stage = useRef<Group>(null);
  const street = useRef<Group>(null);
  const roadMat = useRef<THREE.MeshStandardMaterial>(null);
  const curbMat = useRef<THREE.MeshBasicMaterial>(null);
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0.35, 0));

  useFrame((state) => {
    const p = reduced ? 0.72 : progress.get();
    const t = state.clock.elapsedTime;

    // —— Camera continuum (street → control grain) ——
    // 0.00–0.14 street wide | 0.10–0.28 vehicle | 0.24–0.44 sensors
    // 0.40–0.58 rays | 0.54–0.72 pixels | 0.68–0.86 latent | 0.82–1.00 control
    const toVehicle = smoothstep(0.08, 0.26, p);
    const toSensor = smoothstep(0.24, 0.42, p);
    const toRay = smoothstep(0.4, 0.55, p);
    const toPixel = smoothstep(0.54, 0.68, p);
    const toFeature = smoothstep(0.68, 0.82, p);
    const toControl = smoothstep(0.82, 0.95, p);

    let camX = lerp(2.55, 2.1, toVehicle);
    let camY = lerp(1.85, 1.45, toVehicle);
    let camZ = lerp(4.2, 3.35, toVehicle);

    camX = lerp(camX, 1.85, toSensor);
    camY = lerp(camY, 1.35, toSensor);
    camZ = lerp(camZ, 2.85, toSensor);

    // push toward lidar / front sample volume
    camX = lerp(camX, 1.15, toRay);
    camY = lerp(camY, 1.15, toRay);
    camZ = lerp(camZ, 2.15, toRay);

    camX = lerp(camX, 0.85, toPixel);
    camY = lerp(camY, 0.95, toPixel);
    camZ = lerp(camZ, 1.75, toPixel);

    // latent graph sits mid-body
    camX = lerp(camX, 1.05, toFeature);
    camY = lerp(camY, 0.9, toFeature);
    camZ = lerp(camZ, 1.95, toFeature);

    // drop slightly for wheel/brake control pathways
    camX = lerp(camX, 1.35, toControl);
    camY = lerp(camY, 0.72, toControl);
    camZ = lerp(camZ, 2.25, toControl);

    if (reduced) {
      camX = 1.9;
      camY = 1.35;
      camZ = 3.0;
    }

    camera.position.x = lerp(camera.position.x, camX, 0.1);
    camera.position.y = lerp(camera.position.y, camY, 0.1);
    camera.position.z = lerp(camera.position.z, camZ, 0.1);

    const lookY = lerp(
      lerp(0.2, 0.45, toVehicle),
      lerp(0.7, 0.35, toControl),
      Math.max(toRay, toFeature * 0.6)
    );
    const lookZ = lerp(0, 0.35, toRay) - toControl * 0.15;
    look.current.set(0, reduced ? 0.4 : lookY, reduced ? 0 : lookZ);
    camera.lookAt(look.current);

    // tighten near plane fog as we go micro
    const fog = state.scene.fog as THREE.Fog | null;
    if (fog) {
      const grain = Math.max(toRay, toPixel, toFeature, toControl);
      fog.near = lerp(8, 3.5, grain);
      fog.far = lerp(18, 9, grain);
    }

    if (stage.current) {
      const yaw = lerp(0.55, -0.28, clamp01(p * 0.85));
      const pitch = lerp(0.28, 0.12 + toControl * 0.06, clamp01(p));
      stage.current.rotation.y =
        yaw + (reduced ? 0 : Math.sin(t * 0.15) * 0.018);
      stage.current.rotation.x = pitch;
      // pull stage as micro layers dominate
      const z = lerp(0.15, -0.2, clamp01((p - 0.35) / 0.5));
      stage.current.position.z = z;
      stage.current.position.y = lerp(0.05, -0.05, clamp01(p));
    }

    // Street fades as we leave macro establishing shot
    const streetFade = reduced ? 0.35 : 1 - smoothstep(0.22, 0.48, p);
    if (roadMat.current) {
      roadMat.current.opacity = 0.35 + streetFade * 0.65;
    }
    if (curbMat.current) {
      curbMat.current.opacity = streetFade * 0.04;
    }

    if (street.current && !reduced) {
      street.current.position.z = ((t * 0.25) % 0.6) - 0.3;
      street.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat && 'opacity' in mat && mat.userData?.lane) {
            mat.opacity = mat.userData.lane * streetFade;
          }
        }
      });
    }
  });

  return (
    <>
      {/* Night-street ambient lighting */}
      <color attach="background" args={['#050408']} />
      <fog attach="fog" args={['#050408', 8, 18]} />

      <ambientLight intensity={0.28} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={0.85}
        color="#e8e4f0"
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.35}
        color={accent}
      />
      <pointLight
        position={[0, 2.2, 1.5]}
        intensity={0.55}
        color={accent}
        distance={8}
        decay={2}
      />
      <pointLight
        position={[1.5, 1, -1]}
        intensity={0.25}
        color="#7EA2FF"
        distance={6}
        decay={2}
      />

      <group ref={stage}>
        {/* Street plane + lane marks */}
        <group position={[0, -0.15, 0]}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[6, 8]} />
            <meshStandardMaterial
              ref={roadMat}
              color="#0c0a10"
              metalness={0.15}
              roughness={0.9}
              transparent
              opacity={1}
            />
          </mesh>
          <group ref={street}>
            {[-0.9, 0, 0.9].map((x) =>
              [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((z) => (
                <mesh
                  key={`${x}-${z}`}
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[x, 0.012, z]}
                >
                  <planeGeometry args={[0.04, 0.35]} />
                  <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={x === 0 ? 0.18 : 0.08}
                    userData={{ lane: x === 0 ? 0.18 : 0.08 }}
                  />
                </mesh>
              ))
            )}
          </group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
            <ringGeometry args={[2.2, 2.6, 48]} />
            <meshBasicMaterial
              ref={curbMat}
              color={accent}
              transparent
              opacity={0.04}
              depthWrite={false}
            />
          </mesh>
        </group>

        <Vehicle progress={progress} accent={accent} reduced={reduced} />
        <Sensors progress={progress} accent={accent} reduced={reduced} />
        <PerceptionOverlay
          progress={progress}
          accent={accent}
          reduced={reduced}
        />
        <MicroZoom progress={progress} accent={accent} reduced={reduced} />
        <DecisionTree progress={progress} accent={accent} reduced={reduced} />
      </group>
    </>
  );
}
