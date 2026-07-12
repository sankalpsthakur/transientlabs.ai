'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import type { Group, InstancedMesh, LineSegments, Points } from 'three';

export interface MicroZoomProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
}

const CAM_BLUE = '#7EA2FF';
const LATENT_TEAL = '#5CE1A8';
const CONTROL_PINK = '#E8A0C8';

/** Lidar dome origin in stage space (matches Sensors LIDAR_HOME + vehicle offset). */
const LIDAR_ORIGIN = new THREE.Vector3(0, 0.83, -0.05);

const RAY_COUNT = 28;
const RETURN_COUNT = 48;
const DENSE_COUNT = 160;
const GRID_W = 10;
const GRID_H = 7;
const LATENT_NODES = 9;
const CONTROL_PARTICLES = 36;

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
 * Continuous micro zoom: ray/return → pixel/point → feature/intent → control bit.
 * Buffer geometry + instancing only — no per-particle React nodes.
 */
export function MicroZoom({
  progress,
  accent = '#C4A1FF',
  reduced = false,
}: MicroZoomProps) {
  const root = useRef<Group>(null);
  const rayLines = useRef<LineSegments>(null);
  const returnPts = useRef<Points>(null);
  const densePts = useRef<Points>(null);
  const gridMesh = useRef<InstancedMesh>(null);
  const latentMesh = useRef<InstancedMesh>(null);
  const latentEdges = useRef<LineSegments>(null);
  const trajGroup = useRef<Group>(null);
  const controlPts = useRef<Points>(null);
  const controlLines = useRef<LineSegments>(null);
  const wheelGlows = useRef<(THREE.Mesh | null)[]>([]);
  const brakeGlow = useRef<THREE.Mesh>(null);
  const labels = useRef<Group>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);
  const camColor = useMemo(() => new THREE.Color(CAM_BLUE), []);
  const latentColor = useMemo(() => new THREE.Color(LATENT_TEAL), []);

  /** Deterministic ray directions — fan + slight elevation variation. */
  const rayDirs = useMemo(() => {
    const dirs: THREE.Vector3[] = [];
    for (let i = 0; i < RAY_COUNT; i++) {
      const a = (i / RAY_COUNT) * Math.PI * 1.65 - Math.PI * 0.825;
      const elev = -0.08 + (i % 5) * 0.04;
      const v = new THREE.Vector3(
        Math.sin(a) * Math.cos(elev),
        Math.sin(elev) * 0.55,
        Math.cos(a) * Math.cos(elev)
      ).normalize();
      dirs.push(v);
    }
    return dirs;
  }, []);

  const rayRanges = useMemo(() => {
    const r = new Float32Array(RAY_COUNT);
    for (let i = 0; i < RAY_COUNT; i++) {
      r[i] = 1.1 + (i % 7) * 0.18 + (i % 3) * 0.05;
    }
    return r;
  }, []);

  const rayGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(RAY_COUNT * 2 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const returnGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(RETURN_COUNT * 3), 3)
    );
    return geo;
  }, []);

  const denseSeeds = useMemo(() => {
    const s = new Float32Array(DENSE_COUNT * 4);
    for (let i = 0; i < DENSE_COUNT; i++) {
      const lane = i % 5;
      s[i * 4] = (lane - 2) * 0.22 + Math.sin(i * 1.3) * 0.04;
      s[i * 4 + 1] =
        i % 13 === 0
          ? 0.18 + (i % 4) * 0.05
          : i % 9 === 0
            ? 0.28
            : Math.abs(Math.sin(i * 0.37)) * 0.06;
      s[i * 4 + 2] = (i / DENSE_COUNT) * 2.4 - 0.4;
      s[i * 4 + 3] = (i * 0.618) % 1;
    }
    return s;
  }, []);

  const denseGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(DENSE_COUNT * 3), 3)
    );
    return geo;
  }, []);

  const gridCells = GRID_W * GRID_H;

  const latentPositions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < LATENT_NODES; i++) {
      const ring = i < 1 ? 0 : i < 5 ? 1 : 2;
      const k = i < 1 ? 0 : i < 5 ? i - 1 : i - 5;
      const n = ring === 0 ? 1 : ring === 1 ? 4 : 4;
      const a = (k / n) * Math.PI * 2 + ring * 0.4;
      const r = ring === 0 ? 0 : ring === 1 ? 0.28 : 0.52;
      arr.push(
        new THREE.Vector3(
          Math.cos(a) * r,
          0.35 + Math.sin(a * 2) * 0.06 + (ring === 0 ? 0.12 : 0),
          Math.sin(a) * r * 0.7
        )
      );
    }
    return arr;
  }, []);

  const latentEdgeGeo = useMemo(() => {
    // star from center (0) + ring links
    const pairs: [number, number][] = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [1, 5],
      [2, 6],
      [3, 7],
      [4, 8],
    ];
    const pos = new Float32Array(pairs.length * 2 * 3);
    pairs.forEach(([a, b], i) => {
      const pa = latentPositions[a];
      const pb = latentPositions[b];
      pos[i * 6] = pa.x;
      pos[i * 6 + 1] = pa.y;
      pos[i * 6 + 2] = pa.z;
      pos[i * 6 + 3] = pb.x;
      pos[i * 6 + 4] = pb.y;
      pos[i * 6 + 5] = pb.z;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [latentPositions]);

  /** Control paths: brain → FL, FR, RL, RR wheels + brake. */
  const controlPaths = useMemo(() => {
    const brain = new THREE.Vector3(0, 0.55, 0.1);
    const ends = [
      new THREE.Vector3(-0.72, 0.03, 0.52),
      new THREE.Vector3(0.72, 0.03, 0.52),
      new THREE.Vector3(-0.72, 0.03, -0.55),
      new THREE.Vector3(0.72, 0.03, -0.55),
      new THREE.Vector3(0, 0.12, 1.05), // brake / front actuator
    ];
    return { brain, ends };
  }, []);

  const controlLineGeo = useMemo(() => {
    const n = controlPaths.ends.length;
    const pos = new Float32Array(n * 2 * 3);
    controlPaths.ends.forEach((end, i) => {
      pos[i * 6] = controlPaths.brain.x;
      pos[i * 6 + 1] = controlPaths.brain.y;
      pos[i * 6 + 2] = controlPaths.brain.z;
      pos[i * 6 + 3] = end.x;
      pos[i * 6 + 4] = end.y;
      pos[i * 6 + 5] = end.z;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [controlPaths]);

  const controlGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(CONTROL_PARTICLES * 3), 3)
    );
    return geo;
  }, []);

  useFrame((state) => {
    const p = reduced ? 0.88 : progress.get();
    const t = state.clock.elapsedTime;

    // Phase weights from scale ladder
    const rayT = reduced ? 0.15 : smoothstep(0.4, 0.52, p) * (1 - smoothstep(0.56, 0.66, p));
    const pixelT = reduced
      ? 0.45
      : smoothstep(0.54, 0.64, p) * (1 - smoothstep(0.7, 0.78, p));
    const featureT = reduced
      ? 0.55
      : smoothstep(0.68, 0.78, p) * (1 - smoothstep(0.84, 0.92, p));
    const controlT = reduced ? 0.85 : smoothstep(0.82, 0.92, p);
    // Soft residual for reduced: keep a light control + feature blend
    const anyMicro = rayT + pixelT + featureT + controlT;

    if (root.current) {
      root.current.visible = anyMicro > 0.02;
    }

    // —— Rays / TOF pulses ——
    const rays = rayLines.current;
    if (rays) {
      const attr = rays.geometry.attributes.position as THREE.BufferAttribute;
      const pulse = (t * 1.8) % 1;
      for (let i = 0; i < RAY_COUNT; i++) {
        const dir = rayDirs[i];
        const range = rayRanges[i];
        // sweep: rays appear in a rotating fan
        const sweep = reduced
          ? 1
          : smoothstep(0, 1, rayT * 1.4 - (i / RAY_COUNT) * 0.5);
        const live = Math.sin(t * 2.2 + i * 0.4) * 0.08 + 0.92;
        const len = range * sweep * live;
        // origin
        attr.setXYZ(i * 2, LIDAR_ORIGIN.x, LIDAR_ORIGIN.y, LIDAR_ORIGIN.z);
        // tip with TOF pulse short segment intensity via length modulation
        const tipScale = 0.55 + pulse * 0.45;
        attr.setXYZ(
          i * 2 + 1,
          LIDAR_ORIGIN.x + dir.x * len * tipScale,
          LIDAR_ORIGIN.y + dir.y * len * tipScale,
          LIDAR_ORIGIN.z + dir.z * len * tipScale
        );
      }
      attr.needsUpdate = true;
      const mat = rays.material as THREE.LineBasicMaterial;
      mat.opacity = rayT * 0.55 + pixelT * 0.12;
      rays.visible = rayT > 0.02 || (pixelT > 0.1 && rayT > 0.01);
    }

    // —— Sparse returns ——
    const rets = returnPts.current;
    if (rets) {
      const attr = rets.geometry.attributes.position as THREE.BufferAttribute;
      const show = Math.max(rayT, pixelT * 0.35);
      for (let i = 0; i < RETURN_COUNT; i++) {
        const ri = i % RAY_COUNT;
        const dir = rayDirs[ri];
        const range = rayRanges[ri] * (0.55 + (i % 5) * 0.08);
        const jitter = Math.sin(t * 3 + i) * 0.02 * show;
        const reveal = reduced
          ? 1
          : clamp01((show - (i / RETURN_COUNT) * 0.4) / 0.6);
        attr.setXYZ(
          i,
          LIDAR_ORIGIN.x + dir.x * range + jitter,
          LIDAR_ORIGIN.y + dir.y * range + Math.abs(jitter) * 0.5,
          LIDAR_ORIGIN.z + dir.z * range
        );
        // hide unrevealed by collapsing to origin (cheap)
        if (reveal < 0.05) {
          attr.setXYZ(i, LIDAR_ORIGIN.x, LIDAR_ORIGIN.y, LIDAR_ORIGIN.z);
        }
      }
      attr.needsUpdate = true;
      const mat = rets.material as THREE.PointsMaterial;
      mat.opacity = show * 0.9;
      mat.size = 0.045 + rayT * 0.02;
      rets.visible = show > 0.03;
    }

    // —— Dense point cloud / image samples ——
    const dense = densePts.current;
    if (dense) {
      const attr = dense.geometry.attributes.position as THREE.BufferAttribute;
      const densify = smoothstep(0, 1, pixelT + featureT * 0.25);
      for (let i = 0; i < DENSE_COUNT; i++) {
        const sx = denseSeeds[i * 4];
        const sy = denseSeeds[i * 4 + 1];
        const sz = denseSeeds[i * 4 + 2];
        const seed = denseSeeds[i * 4 + 3];
        const reveal = reduced
          ? densify
          : clamp01((densify - seed * 0.55) / 0.45);
        // morph from lidar-sphere samples toward structured scene cloud
        const blend = densify;
        const dir = rayDirs[i % RAY_COUNT];
        const rayX = LIDAR_ORIGIN.x + dir.x * (0.8 + seed);
        const rayY = LIDAR_ORIGIN.y + dir.y * (0.8 + seed);
        const rayZ = LIDAR_ORIGIN.z + dir.z * (0.8 + seed);
        const x = lerp(rayX, sx, blend);
        const y = lerp(rayY, sy + 0.15, blend);
        const z = lerp(rayZ, sz, blend);
        if (reveal < 0.04) {
          attr.setXYZ(i, 0, -10, 0);
        } else {
          attr.setXYZ(
            i,
            x + Math.sin(t * 1.5 + i) * 0.008 * densify,
            y,
            z
          );
        }
      }
      attr.needsUpdate = true;
      const mat = dense.material as THREE.PointsMaterial;
      mat.opacity = densify * 0.85;
      mat.size = 0.028 + densify * 0.012;
      dense.visible = densify > 0.04;
    }

    // —— Image grid sampling ——
    const grid = gridMesh.current;
    if (grid) {
      const gShow = pixelT * (1 - featureT * 0.7);
      let i = 0;
      for (let gy = 0; gy < GRID_H; gy++) {
        for (let gx = 0; gx < GRID_W; gx++) {
          const u = gx / (GRID_W - 1);
          const v = gy / (GRID_H - 1);
          const x = (u - 0.5) * 0.95;
          const y = 0.55 + (v - 0.5) * 0.55;
          const z = 1.15;
          const pop = reduced
            ? gShow
            : gShow * smoothstep(0, 1, gShow * 1.5 - (i / gridCells) * 0.6);
          const pulse = 1 + Math.sin(t * 4 + i * 0.3) * 0.12 * pop;
          dummy.position.set(x, y, z);
          dummy.scale.setScalar(0.018 * pop * pulse);
          dummy.updateMatrix();
          grid.setMatrixAt(i, dummy.matrix);
          i++;
        }
      }
      grid.instanceMatrix.needsUpdate = true;
      grid.visible = gShow > 0.04;
    }

    // —— Latent nodes + edges ——
    const latent = latentMesh.current;
    if (latent) {
      for (let i = 0; i < LATENT_NODES; i++) {
        const pos = latentPositions[i];
        const phase = reduced
          ? featureT
          : smoothstep(0, 1, featureT * 1.3 - i * 0.08);
        const breath =
          1 + Math.sin(t * 2.4 + i * 0.9) * 0.12 * phase;
        dummy.position.set(
          pos.x + Math.sin(t * 0.8 + i) * 0.01 * phase,
          pos.y,
          pos.z
        );
        dummy.scale.setScalar((0.055 + (i === 0 ? 0.03 : 0)) * phase * breath);
        dummy.updateMatrix();
        latent.setMatrixAt(i, dummy.matrix);
      }
      latent.instanceMatrix.needsUpdate = true;
      latent.visible = featureT > 0.04 || controlT > 0.1;
      const mat = latent.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(featureT, controlT * 0.35) * 0.9;
    }
    if (latentEdges.current) {
      const mat = latentEdges.current.material as THREE.LineBasicMaterial;
      mat.opacity = featureT * 0.45 + controlT * 0.15;
      latentEdges.current.visible = featureT > 0.05 || controlT > 0.12;
    }

    // —— Trajectory intent cones ——
    if (trajGroup.current) {
      const intent = Math.max(featureT, controlT * 0.5);
      trajGroup.current.visible = intent > 0.05;
      trajGroup.current.scale.setScalar(0.7 + intent * 0.35);
      trajGroup.current.position.z = 0.4 + Math.sin(t * 0.6) * 0.02 * intent;
      trajGroup.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          const mat = mesh.material as THREE.MeshBasicMaterial;
          if (mat && 'opacity' in mat) {
            mat.opacity = intent * (mesh.userData.baseOpacity ?? 0.2);
          }
        }
      });
    }

    // —— Control signal lines + particles ——
    if (controlLines.current) {
      const mat = controlLines.current.material as THREE.LineBasicMaterial;
      mat.opacity = controlT * 0.55;
      controlLines.current.visible = controlT > 0.04;
    }

    const cpts = controlPts.current;
    if (cpts) {
      const attr = cpts.geometry.attributes.position as THREE.BufferAttribute;
      const nPaths = controlPaths.ends.length;
      for (let i = 0; i < CONTROL_PARTICLES; i++) {
        const path = i % nPaths;
        const end = controlPaths.ends[path];
        const brain = controlPaths.brain;
        const u = ((t * 0.55 + i * 0.07 + path * 0.13) % 1 + 1) % 1;
        // ease along path; stagger by controlT
        const travel = reduced ? u : u * controlT;
        const x = lerp(brain.x, end.x, travel);
        const y = lerp(brain.y, end.y, travel) + Math.sin(travel * Math.PI) * 0.06;
        const z = lerp(brain.z, end.z, travel);
        if (controlT < 0.05) {
          attr.setXYZ(i, brain.x, brain.y, brain.z);
        } else {
          attr.setXYZ(i, x, y, z);
        }
      }
      attr.needsUpdate = true;
      const mat = cpts.material as THREE.PointsMaterial;
      mat.opacity = controlT * 0.95;
      mat.size = 0.04 + controlT * 0.02;
      cpts.visible = controlT > 0.04;
    }

    // Wheel / brake receive glow
    wheelGlows.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const pulse = 0.55 + 0.45 * Math.sin(t * 3.2 + i * 1.1);
      mat.opacity = controlT * 0.35 * pulse;
      mesh.scale.setScalar(0.9 + controlT * 0.25 * pulse);
      mesh.visible = controlT > 0.08;
    });
    if (brakeGlow.current) {
      const mat = brakeGlow.current.material as THREE.MeshBasicMaterial;
      const pulse = 0.5 + 0.5 * Math.sin(t * 4.5);
      mat.opacity = controlT * 0.4 * pulse;
      brakeGlow.current.visible = controlT > 0.1;
    }

    if (labels.current) {
      // show the active micro label
      const labelPhase =
        controlT > 0.35
          ? 3
          : featureT > 0.35
            ? 2
            : pixelT > 0.35
              ? 1
              : rayT > 0.2
                ? 0
                : -1;
      labels.current.children.forEach((child, i) => {
        child.visible = i === labelPhase;
      });
    }
  });

  const wheelTargets = useMemo(
    () =>
      [
        [-0.72, 0.03, 0.52],
        [0.72, 0.03, 0.52],
        [-0.72, 0.03, -0.55],
        [0.72, 0.03, -0.55],
      ] as const,
    []
  );

  return (
    <group ref={root}>
      {/* Lidar rays */}
      <lineSegments ref={rayLines} geometry={rayGeo} frustumCulled={false}>
        <lineBasicMaterial
          color={accent}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Sparse TOF returns */}
      <points ref={returnPts} geometry={returnGeo} frustumCulled={false}>
        <pointsMaterial
          color={accent}
          size={0.05}
          transparent
          opacity={0.85}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Densified point cloud */}
      <points ref={densePts} geometry={denseGeo} frustumCulled={false}>
        <pointsMaterial
          color={camColor}
          size={0.03}
          transparent
          opacity={0.8}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Camera pixel grid (front frustum samples) */}
      <instancedMesh
        ref={gridMesh}
        args={[undefined, undefined, gridCells]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 0.15]} />
        <meshBasicMaterial
          color={CAM_BLUE}
          transparent
          opacity={0.55}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Feature / intent latent graph */}
      <group position={[0, 0.15, 0.15]}>
        <instancedMesh
          ref={latentMesh}
          args={[undefined, undefined, LATENT_NODES]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial
            color={latentColor}
            transparent
            opacity={0.85}
            depthWrite={false}
            toneMapped={false}
          />
        </instancedMesh>
        <lineSegments
          ref={latentEdges}
          geometry={latentEdgeGeo}
          frustumCulled={false}
        >
          <lineBasicMaterial
            color={LATENT_TEAL}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>

      {/* Predicted trajectory cones */}
      <group ref={trajGroup} position={[0, 0.12, 0.55]}>
        <mesh
          position={[0, 0.05, 0.85]}
          rotation={[Math.PI / 2, 0, 0]}
          userData={{ baseOpacity: 0.18 }}
        >
          <coneGeometry args={[0.55, 1.8, 5, 1, true]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh
          position={[0.35, 0.05, 0.7]}
          rotation={[Math.PI / 2, 0, 0.28]}
          userData={{ baseOpacity: 0.1 }}
        >
          <coneGeometry args={[0.32, 1.35, 4, 1, true]} />
          <meshBasicMaterial
            color={CONTROL_PINK}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh
          position={[-0.32, 0.05, 0.7]}
          rotation={[Math.PI / 2, 0, -0.28]}
          userData={{ baseOpacity: 0.1 }}
        >
          <coneGeometry args={[0.32, 1.35, 4, 1, true]} />
          <meshBasicMaterial
            color={CAM_BLUE}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Control bit pathways */}
      <lineSegments
        ref={controlLines}
        geometry={controlLineGeo}
        frustumCulled={false}
      >
        <lineBasicMaterial
          color={accentColor}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points ref={controlPts} geometry={controlGeo} frustumCulled={false}>
        <pointsMaterial
          color={accent}
          size={0.045}
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {wheelTargets.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            wheelGlows.current[i] = el;
          }}
          position={[pos[0], pos[1], pos[2]]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <torusGeometry args={[0.24, 0.03, 8, 20]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.3}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      <mesh ref={brakeGlow} position={[0, 0.18, 1.15]}>
        <boxGeometry args={[0.55, 0.06, 0.08]} />
        <meshBasicMaterial
          color={CONTROL_PINK}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Phase labels — visibility driven in useFrame */}
      <group ref={labels}>
        <Text
          visible={false}
          position={[0, 1.55, 0.2]}
          fontSize={0.07}
          color={accent}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          ray · return
        </Text>
        <Text
          visible={false}
          position={[0, 1.55, 0.2]}
          fontSize={0.07}
          color={CAM_BLUE}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          pixel · point
        </Text>
        <Text
          visible={false}
          position={[0, 1.55, 0.2]}
          fontSize={0.07}
          color={LATENT_TEAL}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          feature · intent
        </Text>
        <Text
          visible={false}
          position={[0, 1.55, 0.2]}
          fontSize={0.07}
          color={accent}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          control bit → motion
        </Text>
      </group>
    </group>
  );
}
