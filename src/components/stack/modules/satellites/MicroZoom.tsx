'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { GltfAsset } from '@/components/stack/webgl';
import { stackModels, USE_GLTF } from '@/lib/stack/models';

interface MicroZoomProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  /** World-space placement of the hero bus (orbital position). */
  position?: [number, number, number];
}

const _obj = new THREE.Object3D();
const _color = new THREE.Color();
const _white = new THREE.Color('#e8eef8');
const _warm = new THREE.Color('#ffd9a0');

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function band(p: number, a: number, b: number, c: number, d: number) {
  return smoothstep(a, b, p) * (1 - smoothstep(c, d, p));
}

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Grid layout for phased-array face (cols × rows). */
const ARRAY_COLS = 12;
const ARRAY_ROWS = 8;
const ARRAY_COUNT = ARRAY_COLS * ARRAY_ROWS;

/** Photon / packet particles along the link. */
const LINK_COUNT = 64;
/** Bitstream symbol instances. */
const BIT_COUNT = 96;

/**
 * Deep scale stages for a single hero satellite:
 * bus → phased array → RF/optical link → bit stream.
 * Crossfades via useFrame + progress.get(); InstancedMesh for grain.
 */
export function MicroZoom({
  progress,
  accent = '#7EA2FF',
  reduced = false,
  position = [1.85, 0.32, 0.55],
}: MicroZoomProps) {
  const rootRef = useRef<THREE.Group>(null);
  const busRef = useRef<THREE.Group>(null);
  const arrayGroupRef = useRef<THREE.Group>(null);
  const linkGroupRef = useRef<THREE.Group>(null);
  const bitsGroupRef = useRef<THREE.Group>(null);

  const arrayMeshRef = useRef<THREE.InstancedMesh>(null);
  const photonMeshRef = useRef<THREE.InstancedMesh>(null);
  const bitMeshRef = useRef<THREE.InstancedMesh>(null);
  const beamMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const beamCoreMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const crosslinkMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const labelBusRef = useRef<THREE.Group>(null);
  const labelArrayRef = useRef<THREE.Group>(null);

  const phaseRef = useRef(0);

  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);

  // Fixed local link axis: array face is +Z of bus; beam shoots +Z then curves to peer sat
  const linkPath = useMemo(() => {
    const start = new THREE.Vector3(0, 0, 0.12);
    const end = new THREE.Vector3(0.85, 0.12, 1.65);
    const mid = new THREE.Vector3(0.35, 0.08, 0.85);
    return { start, mid, end };
  }, []);

  const arrayLayout = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const pitch = 0.028;
    const ox = -((ARRAY_COLS - 1) * pitch) * 0.5;
    const oy = -((ARRAY_ROWS - 1) * pitch) * 0.5;
    for (let r = 0; r < ARRAY_ROWS; r++) {
      for (let c = 0; c < ARRAY_COLS; c++) {
        positions.push(new THREE.Vector3(ox + c * pitch, oy + r * pitch, 0));
      }
    }
    return positions;
  }, []);

  // Initialize array instances
  useLayoutEffect(() => {
    const mesh = arrayMeshRef.current;
    if (!mesh) return;
    for (let i = 0; i < ARRAY_COUNT; i++) {
      _obj.position.copy(arrayLayout[i]);
      _obj.scale.set(0.018, 0.018, 0.01);
      _obj.rotation.set(0, 0, 0);
      _obj.updateMatrix();
      mesh.setMatrixAt(i, _obj.matrix);
      _color.copy(accentColor).multiplyScalar(0.7 + seeded(i, 1) * 0.4);
      mesh.setColorAt(i, _color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [arrayLayout, accentColor]);

  // Initialize photon / bit instances along link path
  useLayoutEffect(() => {
    const photons = photonMeshRef.current;
    const bits = bitMeshRef.current;
    if (photons) {
      for (let i = 0; i < LINK_COUNT; i++) {
        _obj.position.set(0, 0, 0);
        _obj.scale.setScalar(0.012);
        _obj.updateMatrix();
        photons.setMatrixAt(i, _obj.matrix);
        photons.setColorAt(i, _white);
      }
      photons.instanceMatrix.needsUpdate = true;
      if (photons.instanceColor) photons.instanceColor.needsUpdate = true;
    }
    if (bits) {
      for (let i = 0; i < BIT_COUNT; i++) {
        _obj.position.set(0, 0, 0);
        _obj.scale.set(0.018, 0.008, 0.008);
        _obj.updateMatrix();
        bits.setMatrixAt(i, _obj.matrix);
        bits.setColorAt(i, accentColor);
      }
      bits.instanceMatrix.needsUpdate = true;
      if (bits.instanceColor) bits.instanceColor.needsUpdate = true;
    }
  }, [accentColor]);

  useFrame((_, delta) => {
    const raw = progress.get();
    const p = reduced ? 0.55 : raw;

    // Stage weights (overlapping crossfades matching scale-ladders)
    const busW = reduced
      ? 1
      : band(p, 0.26, 0.34, 0.5, 0.62);
    const arrayW = reduced
      ? 0.95
      : band(p, 0.42, 0.5, 0.68, 0.8);
    const linkW = reduced
      ? 0.15
      : band(p, 0.58, 0.68, 0.84, 0.94);
    const bitsW = reduced
      ? 0
      : smoothstep(0.76, 0.88, p);

    // Overall micro presence (fade in as camera dives)
    const presence = reduced ? 1 : smoothstep(0.24, 0.36, p);
    // Mild optical enlarge — camera keyframes own the rest of the dive
    const deepZoom = reduced
      ? 1.25
      : 0.9 + smoothstep(0.28, 0.55, p) * 0.45 + smoothstep(0.55, 0.95, p) * 0.55;

    if (rootRef.current) {
      rootRef.current.visible = presence > 0.01;
      rootRef.current.scale.setScalar(deepZoom);
      // Soft bank for drama; settle facing the array/link axis
      rootRef.current.rotation.y = reduced
        ? 0.35
        : lerp(-0.1, 0.42, smoothstep(0.28, 0.85, p));
      rootRef.current.rotation.x = lerp(0.15, -0.05, smoothstep(0.3, 0.7, p));
    }

    // --- Bus body opacity ---
    if (busRef.current) {
      busRef.current.visible = busW > 0.02 || arrayW > 0.02 || presence > 0.5;
      const bodyAlpha = Math.max(busW, arrayW * 0.55, presence * 0.35);
      busRef.current.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        for (const mat of mats) {
          if (!mat || !('opacity' in mat)) continue;
          const m = mat as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
          m.transparent = true;
          m.opacity = THREE.MathUtils.clamp(bodyAlpha, 0, 1);
          m.depthWrite = bodyAlpha > 0.45;
        }
      });
    }

    // --- Phased array ---
    if (arrayGroupRef.current) {
      arrayGroupRef.current.visible = arrayW > 0.02 || (reduced && presence > 0.5);
      arrayGroupRef.current.scale.setScalar(0.85 + arrayW * 0.2);
    }
    const arrayMesh = arrayMeshRef.current;
    if (arrayMesh) {
      // Steer phase front across the aperture
      if (!reduced) phaseRef.current += delta * (0.9 + arrayW * 1.4);
      const steer = reduced ? 0.6 : phaseRef.current;
      const beamAngle = reduced
        ? 0.4
        : Math.sin(smoothstep(0.48, 0.65, p) * Math.PI) * 0.9 + Math.sin(steer * 0.7) * 0.35;

      for (let i = 0; i < ARRAY_COUNT; i++) {
        const c = i % ARRAY_COLS;
        const r = Math.floor(i / ARRAY_COLS);
        const phase =
          (c / (ARRAY_COLS - 1) - 0.5) * beamAngle * 4 +
          (r / (ARRAY_ROWS - 1) - 0.5) * Math.sin(steer * 0.5) * 0.8 +
          steer;
        const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2));
        const elev = 0.006 + pulse * 0.01 * arrayW;

        _obj.position.copy(arrayLayout[i]);
        _obj.position.z = elev;
        const s = 0.014 + pulse * 0.008;
        _obj.scale.set(s, s, 0.008 + pulse * 0.012);
        _obj.rotation.set(0, 0, 0);
        _obj.updateMatrix();
        arrayMesh.setMatrixAt(i, _obj.matrix);

        _color
          .copy(accentColor)
          .lerp(_white, pulse * 0.55)
          .multiplyScalar(0.65 + pulse * 0.7);
        arrayMesh.setColorAt(i, _color);
      }
      arrayMesh.instanceMatrix.needsUpdate = true;
      if (arrayMesh.instanceColor) arrayMesh.instanceColor.needsUpdate = true;
      const am = arrayMesh.material as THREE.MeshStandardMaterial;
      am.opacity = THREE.MathUtils.clamp(Math.max(arrayW, reduced ? 0.9 : 0), 0, 1);
      am.transparent = true;
      am.emissiveIntensity = 0.4 + arrayW * 1.2;
    }

    // --- RF / optical link ---
    if (linkGroupRef.current) {
      linkGroupRef.current.visible = linkW > 0.02 || bitsW > 0.02;
      linkGroupRef.current.scale.setScalar(0.9 + linkW * 0.15);
    }
    if (beamMatRef.current) {
      beamMatRef.current.opacity = linkW * 0.28 + bitsW * 0.12;
    }
    if (beamCoreMatRef.current) {
      beamCoreMatRef.current.opacity = linkW * 0.55 + bitsW * 0.25;
    }
    if (crosslinkMatRef.current) {
      crosslinkMatRef.current.opacity = linkW * 0.4;
    }

    const photons = photonMeshRef.current;
    if (photons && (linkW > 0.01 || bitsW > 0.01)) {
      const flow = reduced ? 0.35 : phaseRef.current * 0.35;
      for (let i = 0; i < LINK_COUNT; i++) {
        const u = (i / LINK_COUNT + flow * 0.15) % 1;
        // Quadratic bezier along link
        const t = u;
        const it = 1 - t;
        const x =
          it * it * linkPath.start.x +
          2 * it * t * linkPath.mid.x +
          t * t * linkPath.end.x;
        const y =
          it * it * linkPath.start.y +
          2 * it * t * linkPath.mid.y +
          t * t * linkPath.end.y;
        const z =
          it * it * linkPath.start.z +
          2 * it * t * linkPath.mid.z +
          t * t * linkPath.end.z;
        _obj.position.set(x, y, z);
        const pulse = 0.6 + 0.4 * Math.sin(u * Math.PI * 6 + flow);
        const s = (0.008 + pulse * 0.014) * (0.5 + linkW);
        _obj.scale.setScalar(s);
        _obj.updateMatrix();
        photons.setMatrixAt(i, _obj.matrix);
        _color
          .copy(accentColor)
          .lerp(_warm, u * 0.6)
          .multiplyScalar(0.8 + pulse * 0.6);
        photons.setColorAt(i, _color);
      }
      photons.instanceMatrix.needsUpdate = true;
      if (photons.instanceColor) photons.instanceColor.needsUpdate = true;
      const pm = photons.material as THREE.MeshBasicMaterial;
      pm.opacity = THREE.MathUtils.clamp(linkW * 0.95 + bitsW * 0.3, 0, 1);
    }

    // --- Bit stream ---
    if (bitsGroupRef.current) {
      bitsGroupRef.current.visible = bitsW > 0.02;
      bitsGroupRef.current.scale.setScalar(0.95 + bitsW * 0.35);
    }
    const bits = bitMeshRef.current;
    if (bits && bitsW > 0.01) {
      const flow = reduced ? 0 : phaseRef.current * 0.55;
      for (let i = 0; i < BIT_COUNT; i++) {
        const u = (i / BIT_COUNT + flow * 0.08) % 1;
        const t = u;
        const it = 1 - t;
        const x =
          it * it * linkPath.start.x +
          2 * it * t * linkPath.mid.x +
          t * t * linkPath.end.x;
        const y =
          it * it * linkPath.start.y +
          2 * it * t * linkPath.mid.y +
          t * t * linkPath.end.y +
          (seeded(i, 4) - 0.5) * 0.04 * bitsW;
        const z =
          it * it * linkPath.start.z +
          2 * it * t * linkPath.mid.z +
          t * t * linkPath.end.z;

        // Marching dashes: alternate packet / gap silhouette
        const bitOn = seeded(i, 5) > 0.28;
        const packet = Math.floor(i / 4);
        const inPacket = i % 4 < 3;

        _obj.position.set(x, y, z);
        // Orient roughly along path tangent
        const t2 = Math.min(1, t + 0.02);
        const it2 = 1 - t2;
        const x2 =
          it2 * it2 * linkPath.start.x +
          2 * it2 * t2 * linkPath.mid.x +
          t2 * t2 * linkPath.end.x;
        const y2 =
          it2 * it2 * linkPath.start.y +
          2 * it2 * t2 * linkPath.mid.y +
          t2 * t2 * linkPath.end.y;
        const z2 =
          it2 * it2 * linkPath.start.z +
          2 * it2 * t2 * linkPath.mid.z +
          t2 * t2 * linkPath.end.z;
        _obj.lookAt(x2, y2, z2);

        const sx = bitOn && inPacket ? 0.022 + (packet % 3) * 0.006 : 0.006;
        const sy = bitOn && inPacket ? 0.01 : 0.004;
        const sz = bitOn && inPacket ? 0.01 : 0.004;
        _obj.scale.set(sx * bitsW, sy * bitsW, sz * bitsW);
        _obj.updateMatrix();
        bits.setMatrixAt(i, _obj.matrix);

        if (bitOn && inPacket) {
          _color
            .copy(accentColor)
            .lerp(_white, (i % 7) * 0.08)
            .multiplyScalar(0.9 + (i % 3) * 0.15);
        } else {
          _color.copy(accentColor).multiplyScalar(0.25);
        }
        bits.setColorAt(i, _color);
      }
      bits.instanceMatrix.needsUpdate = true;
      if (bits.instanceColor) bits.instanceColor.needsUpdate = true;
      const bm = bits.material as THREE.MeshBasicMaterial;
      bm.opacity = THREE.MathUtils.clamp(bitsW, 0, 1);
    }

    // Labels — bus / array only
    if (labelBusRef.current) {
      labelBusRef.current.visible = busW > 0.35 && arrayW < 0.7;
      labelBusRef.current.scale.setScalar(0.9 + busW * 0.1);
    }
    if (labelArrayRef.current) {
      labelArrayRef.current.visible = arrayW > 0.4 && linkW < 0.55;
      labelArrayRef.current.scale.setScalar(0.9 + arrayW * 0.1);
    }
  });

  return (
    <group ref={rootRef} position={position}>
      {/* ========== Satellite bus ========== */}
      <group ref={busRef}>
        {/* Optional Blender glTF (enable NEXT_PUBLIC_STACK_USE_GLTF=1) */}
        {USE_GLTF && (
          <GltfAsset
            url={stackModels.satellites.path}
            scale={0.22}
            position={[0, 0, 0]}
          />
        )}
        {/* Main flat-panel chassis (procedural — always available) */}
        <mesh castShadow visible={!USE_GLTF}>
          <boxGeometry args={[0.28, 0.06, 0.22]} />
          <meshStandardMaterial
            color="#1a2235"
            metalness={0.72}
            roughness={0.32}
            emissive={accent}
            emissiveIntensity={0.08}
            transparent
            opacity={1}
          />
        </mesh>
        {/* Equipment deck ridge */}
        <mesh position={[0, 0.04, -0.02]}>
          <boxGeometry args={[0.14, 0.03, 0.1]} />
          <meshStandardMaterial
            color="#243048"
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={1}
          />
        </mesh>
        {/* Star tracker / sensors */}
        <mesh position={[0.08, 0.055, 0.04]}>
          <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
          <meshStandardMaterial
            color="#4a5a78"
            metalness={0.5}
            roughness={0.35}
            transparent
            opacity={1}
          />
        </mesh>
        <mesh position={[-0.08, 0.055, 0.04]}>
          <cylinderGeometry args={[0.01, 0.01, 0.016, 8]} />
          <meshStandardMaterial
            color="#4a5a78"
            metalness={0.5}
            roughness={0.35}
            transparent
            opacity={1}
          />
        </mesh>

        {/* Solar wings */}
        <mesh position={[0.28, 0, 0]} rotation={[0, 0, 0.04]}>
          <boxGeometry args={[0.26, 0.008, 0.16]} />
          <meshStandardMaterial
            color="#0d2840"
            metalness={0.45}
            roughness={0.25}
            emissive="#1a4a70"
            emissiveIntensity={0.35}
            transparent
            opacity={1}
          />
        </mesh>
        <mesh position={[-0.28, 0, 0]} rotation={[0, 0, -0.04]}>
          <boxGeometry args={[0.26, 0.008, 0.16]} />
          <meshStandardMaterial
            color="#0d2840"
            metalness={0.45}
            roughness={0.25}
            emissive="#1a4a70"
            emissiveIntensity={0.35}
            transparent
            opacity={1}
          />
        </mesh>
        {/* Solar cell grid lines (cheap detail) */}
        <mesh position={[0.28, 0.005, 0]}>
          <boxGeometry args={[0.24, 0.001, 0.002]} />
          <meshBasicMaterial color={accent} transparent opacity={0.35} />
        </mesh>
        <mesh position={[-0.28, 0.005, 0]}>
          <boxGeometry args={[0.24, 0.001, 0.002]} />
          <meshBasicMaterial color={accent} transparent opacity={0.35} />
        </mesh>

        {/* Inter-sat laser terminal (small dome) */}
        <mesh position={[0, 0.02, -0.12]}>
          <sphereGeometry args={[0.022, 12, 10]} />
          <meshStandardMaterial
            color="#c8d4e8"
            metalness={0.85}
            roughness={0.15}
            emissive={accent}
            emissiveIntensity={0.25}
            transparent
            opacity={1}
          />
        </mesh>

        {/* Thruster pods */}
        <mesh position={[0.1, -0.02, -0.1]}>
          <boxGeometry args={[0.03, 0.02, 0.04]} />
          <meshStandardMaterial
            color="#2a3040"
            metalness={0.7}
            roughness={0.4}
            transparent
            opacity={1}
          />
        </mesh>
        <mesh position={[-0.1, -0.02, -0.1]}>
          <boxGeometry args={[0.03, 0.02, 0.04]} />
          <meshStandardMaterial
            color="#2a3040"
            metalness={0.7}
            roughness={0.4}
            transparent
            opacity={1}
          />
        </mesh>

        <group ref={labelBusRef} position={[0.22, 0.12, 0.05]}>
          <Text
            fontSize={0.028}
            color={accent}
            anchorX="left"
            anchorY="middle"
            outlineWidth={0.002}
            outlineColor="#000000"
          >
            BUS
          </Text>
        </group>
      </group>

      {/* ========== Phased array face ========== */}
      <group ref={arrayGroupRef} position={[0, 0, 0.12]}>
        {/* Array backplane */}
        <mesh position={[0, 0, -0.008]}>
          <boxGeometry args={[0.36, 0.24, 0.012]} />
          <meshStandardMaterial
            color="#121a28"
            metalness={0.55}
            roughness={0.4}
            emissive={accent}
            emissiveIntensity={0.12}
            transparent
            opacity={0.95}
          />
        </mesh>
        <instancedMesh
          ref={arrayMeshRef}
          args={[undefined, undefined, ARRAY_COUNT]}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.8}
            roughness={0.25}
            metalness={0.5}
            toneMapped={false}
            transparent
            opacity={1}
          />
        </instancedMesh>

        <group ref={labelArrayRef} position={[0.2, 0.15, 0.04]}>
          <Text
            fontSize={0.022}
            color={accent}
            anchorX="left"
            anchorY="middle"
            outlineWidth={0.002}
            outlineColor="#000000"
          >
            PHASED ARRAY
          </Text>
        </group>
      </group>

      {/* ========== RF / optical link + peer ========== */}
      <group ref={linkGroupRef}>
        {/* Soft beam volume along link */}
        <mesh
          position={[0.35, 0.06, 0.85]}
          rotation={[0.08, 0.45, 0.04]}
        >
          <cylinderGeometry args={[0.012, 0.04, 1.55, 10, 1, true]} />
          <meshBasicMaterial
            ref={beamMatRef}
            color={accent}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh
          position={[0.35, 0.06, 0.85]}
          rotation={[0.08, 0.45, 0.04]}
        >
          <cylinderGeometry args={[0.004, 0.01, 1.55, 8, 1, true]} />
          <meshBasicMaterial
            ref={beamCoreMatRef}
            color="#e8f0ff"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Photon / symbol particles */}
        <instancedMesh
          ref={photonMeshRef}
          args={[undefined, undefined, LINK_COUNT]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </instancedMesh>

        {/* Optional laser crosslink peer sat (simplified) */}
        <group position={[0.85, 0.12, 1.65]} scale={0.55}>
          <mesh>
            <boxGeometry args={[0.2, 0.04, 0.14]} />
            <meshStandardMaterial
              color="#1a2235"
              metalness={0.7}
              roughness={0.35}
              emissive={accent}
              emissiveIntensity={0.15}
            />
          </mesh>
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.14, 0.006, 0.1]} />
            <meshStandardMaterial
              color="#0d2840"
              emissive="#1a4a70"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[-0.18, 0, 0]}>
            <boxGeometry args={[0.14, 0.006, 0.1]} />
            <meshStandardMaterial
              color="#0d2840"
              emissive="#1a4a70"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[0, 0, -0.08]}>
            <sphereGeometry args={[0.018, 10, 8]} />
            <meshBasicMaterial
              ref={crosslinkMatRef}
              color={accent}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* ========== Bit stream ========== */}
      <group ref={bitsGroupRef}>
        <instancedMesh
          ref={bitMeshRef}
          args={[undefined, undefined, BIT_COUNT]}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </instancedMesh>
      </group>
    </group>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Hero satellite orbital anchor used by Scene camera look-at. */
export const HERO_SAT_POS: [number, number, number] = [1.85, 0.32, 0.55];
