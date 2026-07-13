'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type {
  Group,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Points,
  LineSegments,
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

export interface MicroZoomProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  /** When set, scrub is frozen (reduced motion) */
  fixedProgress?: number;
  /** Ion count — keep modest for mobile GPU */
  ionCount?: number;
}

const ION_COUNT_DEFAULT = 14;
const LATTICE_N = 4; // 4³ host sites
const LATTICE_SPACING = 0.22;

/** Anode (top) → separator band → cathode (bottom) in local micro-space */
const ANODE_Y = 0.55;
const SEP_Y = 0.0;
const CATHODE_Y = -0.55;
const HOP_X_SPREAD = 0.55;
const HOP_Z_SPREAD = 0.35;

type IonSeed = {
  phase: number;
  x0: number;
  z0: number;
  speed: number;
  sway: number;
};

/**
 * Atomic-scale zoom: Li⁺ ions hop anode → separator → cathode,
 * then a simplified crystal host lights intercalation sites.
 * Progress scrubbed — no free-running particle chaos.
 *
 * Timeline (module progress):
 *  0.62–0.82  Li⁺ shuttle
 *  0.78–1.00  Crystal host + site lighting
 */
export function MicroZoom({
  progress,
  accent = '#F0C75E',
  reduced = false,
  fixedProgress,
  ionCount = ION_COUNT_DEFAULT,
}: MicroZoomProps) {
  const root = useRef<Group>(null);
  const shuttleGroup = useRef<Group>(null);
  const latticeGroup = useRef<Group>(null);
  const ionsRef = useRef<InstancedMesh>(null);
  const sitesRef = useRef<InstancedMesh>(null);
  const bondsRef = useRef<LineSegments>(null);
  const atomsRef = useRef<Points>(null);
  const anodeHint = useRef<Mesh>(null);
  const sepHint = useRef<Mesh>(null);
  const cathHint = useRef<Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorTmp = useMemo(() => new THREE.Color(), []);
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);
  const dimColor = useMemo(() => new THREE.Color('#3a424c'), []);
  const litColor = useMemo(() => new THREE.Color(accent), [accent]);

  const ions: IonSeed[] = useMemo(() => {
    return Array.from({ length: ionCount }, (_, i) => {
      const t = i / Math.max(1, ionCount - 1);
      return {
        phase: (i * 0.137 + 0.08) % 1,
        x0: lerp(-HOP_X_SPREAD, HOP_X_SPREAD, t) * 0.85 + ((i * 17) % 7) * 0.02,
        z0: (((i * 13) % 11) / 10 - 0.5) * HOP_Z_SPREAD,
        speed: 0.85 + (i % 5) * 0.06,
        sway: 0.04 + (i % 3) * 0.015,
      };
    });
  }, [ionCount]);

  const siteCount = LATTICE_N * LATTICE_N * LATTICE_N;

  const { bondGeometry, atomGeometry, siteOffsets } = useMemo(() => {
    const offsets: THREE.Vector3[] = [];
    const half = ((LATTICE_N - 1) * LATTICE_SPACING) / 2;
    for (let iz = 0; iz < LATTICE_N; iz++) {
      for (let iy = 0; iy < LATTICE_N; iy++) {
        for (let ix = 0; ix < LATTICE_N; ix++) {
          offsets.push(
            new THREE.Vector3(
              ix * LATTICE_SPACING - half,
              iy * LATTICE_SPACING - half,
              iz * LATTICE_SPACING - half
            )
          );
        }
      }
    }

    // Framework atoms slightly offset from intercalation sites (rock-salt-ish)
    const atomPos = new Float32Array(siteCount * 3);
    for (let i = 0; i < siteCount; i++) {
      const o = offsets[i];
      const corner = 0.07;
      atomPos[i * 3] = o.x + corner * ((i % 2) * 2 - 1);
      atomPos[i * 3 + 1] = o.y + corner * (((i >> 1) % 2) * 2 - 1);
      atomPos[i * 3 + 2] = o.z + corner * (((i >> 2) % 2) * 2 - 1);
    }
    const atomGeo = new THREE.BufferGeometry();
    atomGeo.setAttribute('position', new THREE.BufferAttribute(atomPos, 3));

    // Bonds along nearest neighbors on the cubic lattice
    const bondVerts: number[] = [];
    const indexOf = (ix: number, iy: number, iz: number) =>
      iz * LATTICE_N * LATTICE_N + iy * LATTICE_N + ix;
    for (let iz = 0; iz < LATTICE_N; iz++) {
      for (let iy = 0; iy < LATTICE_N; iy++) {
        for (let ix = 0; ix < LATTICE_N; ix++) {
          const a = offsets[indexOf(ix, iy, iz)];
          if (ix + 1 < LATTICE_N) {
            const b = offsets[indexOf(ix + 1, iy, iz)];
            bondVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
          if (iy + 1 < LATTICE_N) {
            const b = offsets[indexOf(ix, iy + 1, iz)];
            bondVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
          if (iz + 1 < LATTICE_N) {
            const b = offsets[indexOf(ix, iy, iz + 1)];
            bondVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
        }
      }
    }
    const bondGeo = new THREE.BufferGeometry();
    bondGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(bondVerts, 3)
    );

    return {
      bondGeometry: bondGeo,
      atomGeometry: atomGeo,
      siteOffsets: offsets,
    };
  }, [siteCount]);

  useEffect(
    () => () => {
      bondGeometry.dispose();
      atomGeometry.dispose();
    },
    [bondGeometry, atomGeometry]
  );

  useFrame((state) => {
    const p =
      fixedProgress != null
        ? fixedProgress
        : reduced
          ? 0.72
          : progress.get();

    const shuttleT = smoothstep(0.6, 0.68, p) * (1 - smoothstep(0.86, 0.96, p));
    const latticeT = smoothstep(0.76, 0.88, p);
    const overall = Math.max(shuttleT, latticeT);

    if (root.current) {
      root.current.visible = overall > 0.02;
      // Morph stage from electrode-scale sandwich toward lattice center
      const micro = smoothstep(0.62, 0.92, p);
      root.current.position.y = lerp(0.02, -0.05, latticeT);
      root.current.scale.setScalar(lerp(0.95, 1.15, latticeT));
      root.current.rotation.y = reduced
        ? 0.35
        : 0.2 + state.clock.elapsedTime * 0.06 * overall + micro * 0.4;
      root.current.rotation.x = lerp(0.12, 0.35, latticeT);
    }

    // Thin electrode plates as spatial anchors during shuttle
    const plateFade = shuttleT * (1 - latticeT * 0.85);
    const plates: [typeof anodeHint, number][] = [
      [anodeHint, ANODE_Y],
      [sepHint, SEP_Y],
      [cathHint, CATHODE_Y],
    ];
    for (const [ref, y] of plates) {
      if (!ref.current) continue;
      ref.current.position.y = y;
      const mat = ref.current.material as MeshStandardMaterial;
      const base = ref === sepHint ? 0.28 : 0.45;
      mat.opacity = plateFade * base;
      ref.current.visible = mat.opacity > 0.02;
    }

    if (shuttleGroup.current) {
      shuttleGroup.current.visible = shuttleT > 0.02;
    }

    // Li⁺ hop: progress maps hop fraction; reduced freezes mid-separator
    if (ionsRef.current) {
      const hopGlobal = reduced
        ? 0.48 // mid-separator freeze
        : smoothstep(0.62, 0.82, p);

      for (let i = 0; i < ionCount; i++) {
        const seed = ions[i];
        // Staggered hop along the stack axis (Y)
        let hop = clamp01(hopGlobal * seed.speed + seed.phase * 0.15 - 0.08);
        // Ease through separator band
        const y = lerp(ANODE_Y, CATHODE_Y, hop * hop * (3 - 2 * hop));
        const lateral =
          reduced
            ? 0
            : Math.sin(state.clock.elapsedTime * 1.4 + seed.phase * 6.28) *
              seed.sway *
              (1 - Math.abs(hop - 0.5) * 1.2);
        const x = seed.x0 + lateral;
        const z = seed.z0;

        dummy.position.set(x, y, z);
        // Slight squash in separator
        const inSep = 1 - Math.min(1, Math.abs(y - SEP_Y) / 0.18);
        const s = lerp(0.045, 0.032, inSep) * (0.7 + shuttleT * 0.3);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        ionsRef.current.setMatrixAt(i, dummy.matrix);

        // Gold pulse stronger near cathode arrival
        const arrival = smoothstep(0.55, 1, hop);
        colorTmp.copy(dimColor).lerp(accentColor, 0.45 + arrival * 0.55);
        ionsRef.current.setColorAt(i, colorTmp);
      }
      ionsRef.current.instanceMatrix.needsUpdate = true;
      if (ionsRef.current.instanceColor) {
        ionsRef.current.instanceColor.needsUpdate = true;
      }
      ionsRef.current.visible = shuttleT > 0.02;
      const ionMat = ionsRef.current.material as MeshStandardMaterial;
      ionMat.opacity = shuttleT * 0.95;
      ionMat.emissiveIntensity = lerp(0.35, 0.9, hopGlobal);
    }

    // Crystal host
    if (latticeGroup.current) {
      latticeGroup.current.visible = latticeT > 0.02;
      latticeGroup.current.scale.setScalar(lerp(0.55, 1, latticeT));
    }

    if (bondsRef.current) {
      const mat = bondsRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = latticeT * 0.55;
    }
    if (atomsRef.current) {
      const mat = atomsRef.current.material as THREE.PointsMaterial;
      mat.opacity = latticeT * 0.75;
      mat.size = lerp(0.035, 0.055, latticeT);
    }

    // Intercalation sites light as ions "arrive"
    if (sitesRef.current) {
      const fill = reduced
        ? 0.35 // lattice hint — partial occupancy
        : smoothstep(0.78, 0.98, p);

      for (let i = 0; i < siteCount; i++) {
        const o = siteOffsets[i];
        // Radial fill from cathode-facing face then inward
        const order = (o.y + 0.4) * 0.35 + (i % 7) * 0.04;
        const lit = clamp01((fill - order * 0.55) / 0.35);

        dummy.position.copy(o);
        dummy.scale.setScalar(lerp(0.02, 0.055, lit) * latticeT);
        dummy.updateMatrix();
        sitesRef.current.setMatrixAt(i, dummy.matrix);

        colorTmp.copy(dimColor).lerp(litColor, lit);
        sitesRef.current.setColorAt(i, colorTmp);
      }
      sitesRef.current.instanceMatrix.needsUpdate = true;
      if (sitesRef.current.instanceColor) {
        sitesRef.current.instanceColor.needsUpdate = true;
      }
      const siteMat = sitesRef.current.material as MeshStandardMaterial;
      siteMat.opacity = latticeT * 0.9;
      siteMat.emissiveIntensity = lerp(0.1, 0.75, fill);
    }
  });

  return (
    <group ref={root}>
      {/* Micro electrode sandwich hints */}
      <mesh ref={anodeHint} position={[0, ANODE_Y, 0]}>
        <boxGeometry args={[1.35, 0.06, 0.85]} />
        <meshStandardMaterial
          color="#2a3340"
          roughness={0.85}
          metalness={0.15}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={sepHint} position={[0, SEP_Y, 0]}>
        <boxGeometry args={[1.3, 0.03, 0.8]} />
        <meshStandardMaterial
          color="#e8eef5"
          roughness={0.4}
          metalness={0.05}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={cathHint} position={[0, CATHODE_Y, 0]}>
        <boxGeometry args={[1.35, 0.06, 0.85]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.35}
          metalness={0.75}
          emissive={accent}
          emissiveIntensity={0.12}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Li⁺ ions */}
      <group ref={shuttleGroup}>
        <instancedMesh
          ref={ionsRef}
          args={[undefined, undefined, ionCount]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color={accent}
            roughness={0.25}
            metalness={0.55}
            emissive={accent}
            emissiveIntensity={0.5}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </instancedMesh>
      </group>

      {/* Crystal host lattice */}
      <group ref={latticeGroup} position={[0, -0.05, 0]}>
        <lineSegments ref={bondsRef} geometry={bondGeometry} frustumCulled={false}>
          <lineBasicMaterial
            color="#8a9098"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </lineSegments>
        <points ref={atomsRef} geometry={atomGeometry} frustumCulled={false}>
          <pointsMaterial
            color="#c5cad0"
            size={0.04}
            sizeAttenuation
            transparent
            opacity={0}
            depthWrite={false}
          />
        </points>
        <instancedMesh
          ref={sitesRef}
          args={[undefined, undefined, siteCount]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={accent}
            roughness={0.3}
            metalness={0.6}
            emissive={accent}
            emissiveIntensity={0.2}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </instancedMesh>
      </group>
    </group>
  );
}
