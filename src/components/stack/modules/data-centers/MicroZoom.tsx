'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  InstancedMesh,
  Object3D,
  type Group,
  type MeshStandardMaterial,
  type Points,
  type PointsMaterial,
} from 'three';

export interface MicroZoomProps {
  progress: MotionValue<number>;
  accent?: string;
  reduced?: boolean;
  /** World position of the hero rack front (GPU focus) */
  focus?: [number, number, number];
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Hero rack — row 1, col 2 (matches Racks layout) */
export const HERO_RACK: [number, number, number] = [-0.4, 0.55, 0.07];

const GATE_COLS = 18;
const GATE_ROWS = 18;
const GATE_COUNT = GATE_COLS * GATE_ROWS;
const BIT_COUNT = 96;
const HEAT_RESIDUAL = 48;

const dummy = new Object3D();
const gateColor = new Color();
const litColor = new Color('#6ec8ff');
const dimColor = new Color('#1a2830');

/**
 * Continuum micro scales: GPU package + HBM → die gate grain → bit/token stream.
 * All motion via useFrame + instancing; no per-instance React nodes.
 */
export function MicroZoom({
  progress,
  accent = '#E8A87C',
  reduced = false,
  focus = HERO_RACK,
}: MicroZoomProps) {
  const root = useRef<Group>(null);
  const packageGroup = useRef<Group>(null);
  const dieGroup = useRef<Group>(null);
  const gateRef = useRef<InstancedMesh>(null);
  const bitRef = useRef<Points>(null);
  const heatRef = useRef<Points>(null);
  const gateMat = useRef<MeshStandardMaterial>(null);
  const bitMat = useRef<PointsMaterial>(null);
  const heatMat = useRef<PointsMaterial>(null);
  const packageMats = useRef<MeshStandardMaterial[]>([]);
  const gatesPlaced = useRef(false);

  const accentColor = useMemo(() => new Color(accent), [accent]);

  const bitSeeds = useMemo(() => {
    const s = new Float32Array(BIT_COUNT * 4);
    for (let i = 0; i < BIT_COUNT; i++) {
      s[i * 4] = Math.random();
      s[i * 4 + 1] = (Math.random() - 0.5) * 0.12;
      s[i * 4 + 2] = (Math.random() - 0.5) * 0.12;
      s[i * 4 + 3] = Math.random() > 0.45 ? 1 : 0;
    }
    return s;
  }, []);

  const heatSeeds = useMemo(() => {
    const s = new Float32Array(HEAT_RESIDUAL * 3);
    for (let i = 0; i < HEAT_RESIDUAL; i++) {
      s[i * 3] = (Math.random() - 0.5) * 0.16;
      s[i * 3 + 1] = Math.random();
      s[i * 3 + 2] = (Math.random() - 0.5) * 0.16;
    }
    return s;
  }, []);

  const bitGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(BIT_COUNT * 3), 3)
    );
    return geo;
  }, []);

  const heatGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(HEAT_RESIDUAL * 3), 3)
    );
    return geo;
  }, []);

  // Static gate lattice positions (local die plane)
  useLayoutEffect(() => {
    const mesh = gateRef.current;
    if (!mesh || gatesPlaced.current) return;
    const pitch = 0.0072;
    const ox = -((GATE_COLS - 1) * pitch) / 2;
    const oz = -((GATE_ROWS - 1) * pitch) / 2;
    let i = 0;
    for (let r = 0; r < GATE_ROWS; r++) {
      for (let c = 0; c < GATE_COLS; c++) {
        dummy.position.set(ox + c * pitch, 0, oz + r * pitch);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, dimColor);
        i++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    gatesPlaced.current = true;
  }, []);

  useFrame((state) => {
    // GPU+die keyframe for reduced motion
    const p = reduced ? 0.62 : progress.get();
    const t = state.clock.elapsedTime;

    const microIn = reduced ? 1 : smoothstep(0.38, 0.48, p);
    const packageVis = reduced
      ? 0.85
      : smoothstep(0.38, 0.48, p) * (1 - smoothstep(0.58, 0.7, p) * 0.55);
    const dieVis = reduced ? 1 : smoothstep(0.52, 0.62, p);
    const gateLit = reduced ? 0.75 : smoothstep(0.55, 0.72, p);
    const bitVis = reduced ? 0 : smoothstep(0.7, 0.82, p);
    const heatVis = reduced
      ? 0.35
      : smoothstep(0.58, 0.7, p) * (0.55 + 0.45 * smoothstep(0.72, 0.9, p));

    const rootG = root.current;
    if (rootG) {
      rootG.visible = microIn > 0.02;
      const zoomScale = lerp(0.35, 1.15, smoothstep(0.4, 0.58, p));
      const dieScale = lerp(1, 1.85, smoothstep(0.55, 0.75, p));
      rootG.scale.setScalar(microIn * zoomScale * (reduced ? 1.1 : 1));
      rootG.position.set(
        focus[0],
        focus[1] + lerp(0, 0.02, dieVis),
        focus[2]
      );
      rootG.rotation.y = Math.sin(p * Math.PI * 0.5) * 0.08;
      if (dieGroup.current) {
        dieGroup.current.scale.setScalar(lerp(0.85, dieScale, dieVis));
      }
    }

    if (packageGroup.current) {
      packageGroup.current.visible = packageVis > 0.02;
      for (const mat of packageMats.current) {
        if (!mat) continue;
        mat.transparent = true;
        mat.opacity = packageVis;
        mat.depthWrite = packageVis > 0.45;
      }
    }

    // Gate light-up wave across die
    const gates = gateRef.current;
    if (gates && dieVis > 0.02) {
      gates.visible = true;
      const wave = reduced ? 0.7 : gateLit;
      let i = 0;
      for (let r = 0; r < GATE_ROWS; r++) {
        for (let c = 0; c < GATE_COLS; c++) {
          const dist = (c + r) / (GATE_COLS + GATE_ROWS - 2);
          const local = Math.min(
            1,
            Math.max(0, (wave - dist * 0.55) / 0.45)
          );
          const pulse =
            reduced || local < 0.05
              ? 0
              : Math.sin(t * 4.2 + c * 0.45 + r * 0.31) * 0.12 * local;
          const on = Math.min(1, local + pulse);
          const pitch = 0.0072;
          const ox = -((GATE_COLS - 1) * pitch) / 2;
          const oz = -((GATE_ROWS - 1) * pitch) / 2;
          const s = lerp(0.35, 1.15, on);
          dummy.position.set(ox + c * pitch, on * 0.0015, oz + r * pitch);
          dummy.scale.setScalar(s);
          dummy.updateMatrix();
          gates.setMatrixAt(i, dummy.matrix);
          gateColor.copy(dimColor).lerp(litColor, on);
          if ((c * 7 + r * 3) % 11 === 0) {
            gateColor.lerp(accentColor, on * 0.55);
          }
          gates.setColorAt(i, gateColor);
          i++;
        }
      }
      gates.instanceMatrix.needsUpdate = true;
      if (gates.instanceColor) gates.instanceColor.needsUpdate = true;
      if (gateMat.current) {
        gateMat.current.emissiveIntensity = 0.15 + gateLit * 1.6;
        gateMat.current.opacity = 0.25 + dieVis * 0.75;
      }
    } else if (gates) {
      gates.visible = false;
    }

    // Bit / token stream leaving the die
    const bits = bitRef.current;
    if (bits) {
      const pos = bits.geometry.attributes.position as BufferAttribute;
      const flow = reduced ? 0 : bitVis;
      for (let i = 0; i < BIT_COUNT; i++) {
        const phase = bitSeeds[i * 4];
        const lx = bitSeeds[i * 4 + 1];
        const lz = bitSeeds[i * 4 + 2];
        const isOne = bitSeeds[i * 4 + 3] > 0.5;
        const u = ((t * 0.28 + phase) % 1 + 1) % 1;
        const x =
          lx +
          u * 0.55 * (isOne ? 1.1 : 0.85) +
          Math.sin(t + phase * 8) * 0.01;
        const y = 0.01 + u * 0.42 + Math.sin(u * Math.PI) * 0.04;
        const z = lz + u * 0.72;
        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
      bits.visible = flow > 0.02;
      if (bitMat.current) {
        bitMat.current.opacity = flow * 0.95;
        bitMat.current.size = lerp(0.012, 0.028, flow);
      }
    }

    // Heat residual rising from package / die
    const heat = heatRef.current;
    if (heat) {
      const pos = heat.geometry.attributes.position as BufferAttribute;
      for (let i = 0; i < HEAT_RESIDUAL; i++) {
        const sx = heatSeeds[i * 3];
        const phase = heatSeeds[i * 3 + 1];
        const sz = heatSeeds[i * 3 + 2];
        const u = ((t * 0.2 + phase) % 1 + 1) % 1;
        pos.setXYZ(
          i,
          sx + Math.sin(t * 1.2 + phase * 5) * 0.015,
          0.02 + u * 0.55,
          sz - u * 0.08
        );
      }
      pos.needsUpdate = true;
      heat.visible = heatVis > 0.02;
      if (heatMat.current) {
        heatMat.current.opacity = heatVis * 0.8;
        heatMat.current.color.copy(accentColor);
      }
    }
  });

  const registerMat = (mat: MeshStandardMaterial | null) => {
    if (mat && !packageMats.current.includes(mat)) {
      packageMats.current.push(mat);
    }
  };

  return (
    <group ref={root} position={focus}>
      {/* Accelerator: package + HBM stacks */}
      <group ref={packageGroup}>
        <mesh position={[0, -0.012, 0]} castShadow>
          <boxGeometry args={[0.22, 0.012, 0.18]} />
          <meshStandardMaterial
            ref={registerMat}
            color="#1a1612"
            roughness={0.55}
            metalness={0.5}
            transparent
            opacity={1}
          />
        </mesh>
        <mesh position={[0.02, 0.01, 0]} castShadow>
          <boxGeometry args={[0.1, 0.018, 0.1]} />
          <meshStandardMaterial
            ref={registerMat}
            color="#0e1218"
            roughness={0.35}
            metalness={0.65}
            transparent
            opacity={1}
          />
        </mesh>
        <mesh position={[0.02, 0.02, 0]}>
          <boxGeometry args={[0.092, 0.004, 0.092]} />
          <meshStandardMaterial
            ref={registerMat}
            color="#1c2834"
            emissive="#1a3048"
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0.75}
            transparent
            opacity={1}
          />
        </mesh>
        {[-0.07, -0.035, 0.035, 0.07].map((z, i) => (
          <group key={`hbm-${i}`} position={[-0.08, 0.01, z]}>
            {Array.from({ length: 4 }, (_, layer) => (
              <mesh key={layer} position={[0, layer * 0.008, 0]} castShadow>
                <boxGeometry args={[0.032, 0.006, 0.028]} />
                <meshStandardMaterial
                  ref={registerMat}
                  color={layer % 2 === 0 ? '#2a221c' : '#3a3028'}
                  emissive={accent}
                  emissiveIntensity={0.08 + layer * 0.04}
                  roughness={0.4}
                  metalness={0.55}
                  transparent
                  opacity={1}
                />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[0.1, 0.0, 0]}>
          <boxGeometry args={[0.012, 0.008, 0.14]} />
          <meshStandardMaterial
            ref={registerMat}
            color="#5CE1A8"
            emissive="#5CE1A8"
            emissiveIntensity={0.4}
            roughness={0.35}
            metalness={0.7}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* Die plane + gate grain */}
      <group ref={dieGroup} position={[0.02, 0.028, 0]}>
        <mesh position={[0, -0.003, 0]}>
          <boxGeometry args={[0.13, 0.003, 0.13]} />
          <meshStandardMaterial
            color="#0a1018"
            roughness={0.3}
            metalness={0.7}
            emissive="#0a1828"
            emissiveIntensity={0.4}
            transparent
            opacity={0.92}
          />
        </mesh>
        <mesh position={[0, -0.001, 0]}>
          <boxGeometry args={[0.135, 0.001, 0.135]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>
        <instancedMesh
          ref={gateRef}
          args={[undefined, undefined, GATE_COUNT]}
          frustumCulled={false}
        >
          <boxGeometry args={[0.0045, 0.0022, 0.0045]} />
          <meshStandardMaterial
            ref={gateMat}
            color="#ffffff"
            emissive="#6ec8ff"
            emissiveIntensity={0.5}
            roughness={0.25}
            metalness={0.15}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </instancedMesh>
      </group>

      {/* Bit / token stream */}
      <points ref={bitRef} geometry={bitGeo} frustumCulled={false}>
        <pointsMaterial
          ref={bitMat}
          color="#9fd8ff"
          size={0.02}
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      {/* Heat residual */}
      <points ref={heatRef} geometry={heatGeo} frustumCulled={false}>
        <pointsMaterial
          ref={heatMat}
          color={accent}
          size={0.022}
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}
