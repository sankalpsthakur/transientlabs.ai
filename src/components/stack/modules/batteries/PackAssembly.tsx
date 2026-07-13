'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type {
  Group,
  Mesh,
  MeshStandardMaterial,
  LineSegments,
  LineBasicMaterial,
} from 'three';
import * as THREE from 'three';

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export interface PackAssemblyProps {
  progress: MotionValue<number>;
  accent?: string;
}

const COLS = 4;
const ROWS = 3;
const CELL_R = 0.13;
const CELL_H = 0.42;
const PITCH_X = 0.32;
const PITCH_Z = 0.32;

type CellSlot = {
  ix: number;
  iz: number;
  x: number;
  z: number;
  delay: number;
};

/**
 * Macro manufacturing stage for the batteries scale ladder:
 *  0.00–0.14  Gigafactory — abstract line / wide pack proxy
 *  0.10–0.28  Pack enclosure + bus
 *  0.24–0.40  Module grid emphasis
 * Hands off to jelly-roll cell zoom after ~0.36.
 */
export function PackAssembly({
  progress,
  accent = '#F0C75E',
}: PackAssemblyProps) {
  const root = useRef<Group>(null);
  const enclosure = useRef<Mesh>(null);
  const enclosureEdges = useRef<LineSegments>(null);
  const busBar = useRef<Mesh>(null);
  const conveyor = useRef<Group>(null);
  const beltRef = useRef<Mesh>(null);
  const railRefs = useRef<(Mesh | null)[]>([]);
  const cellMeshes = useRef<(Mesh | null)[]>([]);
  const conveyorCells = useRef<(Mesh | null)[]>([]);
  const hallFloor = useRef<Mesh>(null);
  const hallColumns = useRef<(Mesh | null)[]>([]);

  const slots: CellSlot[] = useMemo(() => {
    const list: CellSlot[] = [];
    const ox = -((COLS - 1) * PITCH_X) / 2;
    const oz = -((ROWS - 1) * PITCH_Z) / 2;
    for (let iz = 0; iz < ROWS; iz++) {
      for (let ix = 0; ix < COLS; ix++) {
        const i = iz * COLS + ix;
        list.push({
          ix,
          iz,
          x: ox + ix * PITCH_X,
          z: oz + iz * PITCH_Z,
          delay: i * 0.012,
        });
      }
    }
    return list;
  }, []);

  const edgeGeo = useMemo(() => {
    const w = COLS * PITCH_X + 0.22;
    const h = CELL_H + 0.18;
    const d = ROWS * PITCH_Z + 0.22;
    const box = new THREE.BoxGeometry(w, h, d);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    return edges;
  }, []);

  useFrame((state) => {
    const p = progress.get();

    // Gigafactory: production-line silhouette early, fades as pack resolves
    const factoryT =
      smoothstep(0.0, 0.06, p) * (1 - smoothstep(0.12, 0.22, p));
    if (conveyor.current) {
      conveyor.current.visible = factoryT > 0.02 || smoothstep(0.08, 0.18, p) > 0.02;
      conveyor.current.position.y = -0.85;
      conveyor.current.position.z = lerp(0.55, 0.9, smoothstep(0.1, 0.22, p));
      conveyor.current.scale.setScalar(lerp(1.35, 1, smoothstep(0.05, 0.2, p)));
    }
    if (beltRef.current) {
      const mat = beltRef.current.material as MeshStandardMaterial;
      mat.opacity =
        Math.max(factoryT, smoothstep(0.08, 0.16, p) * (1 - smoothstep(0.22, 0.32, p))) *
        0.55;
    }
    railRefs.current.forEach((rail) => {
      if (!rail) return;
      const mat = rail.material as MeshStandardMaterial;
      mat.opacity =
        Math.max(factoryT, smoothstep(0.08, 0.16, p) * (1 - smoothstep(0.22, 0.32, p))) *
        0.5;
    });
    conveyorCells.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = (state.clock.elapsedTime * 0.32 + i * 0.22) % 1;
      mesh.position.x = lerp(-1.6, 1.6, t);
      mesh.position.y = 0.12;
      const cmat = mesh.material as MeshStandardMaterial;
      cmat.opacity =
        Math.max(factoryT, smoothstep(0.08, 0.16, p) * (1 - smoothstep(0.24, 0.34, p))) *
        0.85;
    });

    // Abstract dry-room hall floor + columns (factory proxy)
    if (hallFloor.current) {
      const mat = hallFloor.current.material as MeshStandardMaterial;
      mat.opacity = factoryT * 0.4;
      hallFloor.current.visible = factoryT > 0.02;
      hallFloor.current.scale.set(
        lerp(1.2, 1, factoryT),
        1,
        lerp(1.4, 1, factoryT)
      );
    }
    hallColumns.current.forEach((col, i) => {
      if (!col) return;
      const mat = col.material as MeshStandardMaterial;
      const delay = i * 0.04;
      const cT = smoothstep(0.0 + delay, 0.08 + delay, p) * factoryT;
      mat.opacity = cT * 0.55;
      col.visible = cT > 0.02;
      col.scale.y = lerp(0.4, 1, cT);
    });

    // Pack / module visibility window
    const packEnter = smoothstep(0.08, 0.2, p);
    const packHold = 1 - smoothstep(0.36, 0.48, p);
    const packVis = packEnter * packHold;
    const moduleFocus = smoothstep(0.22, 0.36, p) * packHold;

    if (root.current) {
      root.current.visible = packVis > 0.01 || factoryT > 0.02;
      root.current.position.y = lerp(0.05, -0.2, packEnter);
      // Module phase: slightly larger / closer composition scale
      root.current.scale.setScalar(
        lerp(0.75, 1.05, packEnter) * lerp(1, 1.12, moduleFocus) * lerp(1, 0.55, 1 - packHold)
      );
      root.current.rotation.x = lerp(0.55, 0.42, packEnter);
      root.current.rotation.y = lerp(0.15, -0.28, packEnter + moduleFocus * 0.35);
    }

    // Cells assemble as pack → module
    cellMeshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const slot = slots[i];
      const t =
        smoothstep(0.12 + slot.delay, 0.26 + slot.delay, p) * packHold;
      mesh.visible = t > 0.01;
      mesh.position.set(slot.x, lerp(0.35, 0, t), slot.z);
      mesh.scale.setScalar(lerp(0.35, 1, t));
      const mat = mesh.material as MeshStandardMaterial;
      mat.opacity = t * 0.95;
      mat.emissiveIntensity = lerp(0.04, 0.12, moduleFocus);
    });

    const encT = smoothstep(0.16, 0.28, p) * packHold;
    if (enclosure.current) {
      enclosure.current.visible = encT > 0.02;
      const mat = enclosure.current.material as MeshStandardMaterial;
      mat.opacity = encT * 0.22;
      enclosure.current.scale.setScalar(lerp(0.92, 1, encT));
    }
    if (enclosureEdges.current) {
      enclosureEdges.current.visible = encT > 0.02;
      const mat = enclosureEdges.current.material as LineBasicMaterial;
      mat.opacity = encT * 0.85;
    }
    if (busBar.current) {
      const bT = smoothstep(0.2, 0.3, p) * packHold;
      busBar.current.visible = bT > 0.02;
      const mat = busBar.current.material as MeshStandardMaterial;
      mat.opacity = bT;
    }
  });

  return (
    <group ref={root}>
      {/* Factory hall proxy */}
      <mesh
        ref={hallFloor}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[5.5, 4.2]} />
        <meshStandardMaterial
          color="#16140f"
          roughness={0.92}
          metalness={0.08}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      {([-2.2, 2.2] as const).flatMap((x, xi) =>
        ([-1.4, 1.4] as const).map((z, zi) => {
          const i = xi * 2 + zi;
          return (
            <mesh
              key={`col-${i}`}
              ref={(m) => {
                hallColumns.current[i] = m;
              }}
              position={[x, -0.15, z]}
            >
              <boxGeometry args={[0.08, 1.8, 0.08]} />
              <meshStandardMaterial
                color={accent}
                roughness={0.45}
                metalness={0.65}
                transparent
                opacity={0}
                emissive={accent}
                emissiveIntensity={0.08}
                depthWrite={false}
              />
            </mesh>
          );
        })
      )}

      <group ref={conveyor}>
        <mesh ref={beltRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.6, 0.5]} />
          <meshStandardMaterial
            color="#1a1814"
            roughness={0.9}
            metalness={0.1}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
        {([-0.26, 0.26] as const).map((z, i) => (
          <mesh
            key={z}
            ref={(m) => {
              railRefs.current[i] = m;
            }}
            position={[0, 0.02, z]}
          >
            <boxGeometry args={[3.6, 0.03, 0.03]} />
            <meshStandardMaterial
              color={accent}
              roughness={0.5}
              metalness={0.6}
              transparent
              opacity={0}
              emissive={accent}
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={i}
            ref={(m) => {
              conveyorCells.current[i] = m;
            }}
            castShadow
          >
            <cylinderGeometry args={[0.09, 0.09, 0.22, 14]} />
            <meshStandardMaterial
              color="#7a8088"
              roughness={0.3}
              metalness={0.85}
              transparent
              opacity={0}
            />
          </mesh>
        ))}
      </group>

      <group>
        {slots.map((slot, i) => (
          <mesh
            key={`${slot.ix}-${slot.iz}`}
            ref={(m) => {
              cellMeshes.current[i] = m;
            }}
            castShadow
            position={[slot.x, 0, slot.z]}
          >
            <cylinderGeometry args={[CELL_R, CELL_R, CELL_H, 16]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#6a7078' : '#8a9098'}
              roughness={0.28}
              metalness={0.88}
              transparent
              opacity={0}
              emissive={accent}
              emissiveIntensity={0.04}
            />
          </mesh>
        ))}

        <mesh ref={busBar} position={[0, CELL_H / 2 + 0.04, 0]} castShadow>
          <boxGeometry args={[COLS * PITCH_X * 0.92, 0.025, 0.08]} />
          <meshStandardMaterial
            color={accent}
            roughness={0.35}
            metalness={0.85}
            emissive={accent}
            emissiveIntensity={0.2}
            transparent
            opacity={0}
          />
        </mesh>

        <mesh ref={enclosure} castShadow>
          <boxGeometry
            args={[
              COLS * PITCH_X + 0.22,
              CELL_H + 0.18,
              ROWS * PITCH_Z + 0.22,
            ]}
          />
          <meshStandardMaterial
            color="#14110c"
            roughness={0.55}
            metalness={0.35}
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        <lineSegments ref={enclosureEdges} geometry={edgeGeo}>
          <lineBasicMaterial color={accent} transparent opacity={0} />
        </lineSegments>
      </group>
    </group>
  );
}
