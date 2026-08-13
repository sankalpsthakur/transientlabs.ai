'use client';

import { ContactShadows, Edges, Line, RoundedBox, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Group, PerspectiveCamera } from 'three';
import * as THREE from 'three';
import {
  conduitAuthoritySolid,
  type PlantAction,
  type PlantState,
  type SelectedNode,
} from './model';

export interface SceneProps {
  progress: MotionValue<number>;
  state: PlantState;
  dispatch: (action: PlantAction) => void;
  accent?: string;
  reduced?: boolean;
}

const PAPER = '#f4eee4';
const INK = '#18120d';
const SIGNAL = '#1f3f93';
const LEDGER = '#8b5e34';
const VERMILLION = '#d55e00';
const SKY = '#0072b2';
const GROUND = '#161310';

function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function Slab({
  position,
  size,
  label,
  color,
  selected,
  onClick,
  opacity = 1,
}: {
  position: [number, number, number];
  size: [number, number, number];
  label: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  opacity?: number;
}) {
  return (
    <group position={position} onClick={onClick}>
      <RoundedBox args={size} radius={0.05} smoothness={3}>
        <meshStandardMaterial
          color={PAPER}
          roughness={0.52}
          metalness={0.04}
          emissive={color}
          emissiveIntensity={selected ? 0.16 : 0.045}
          transparent={opacity < 1}
          opacity={opacity}
        />
        <Edges scale={1.004} color={selected ? color : INK} threshold={16} />
      </RoundedBox>
      <Text
        position={[0, 0, size[2] / 2 + 0.02]}
        fontSize={0.11}
        color={INK}
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] - 0.1}
      >
        {label}
      </Text>
    </group>
  );
}

function FieldMachines() {
  return (
    <group position={[0, 0.12, 0.15]}>
      {/* Press */}
      <mesh position={[-1.15, 0.22, 0.15]}>
        <boxGeometry args={[0.55, 0.44, 0.42]} />
        <meshStandardMaterial color="#d7c6b0" roughness={0.6} metalness={0.12} />
        <Edges color={INK} />
      </mesh>
      <mesh position={[-1.15, 0.5, 0.15]}>
        <boxGeometry args={[0.38, 0.14, 0.28]} />
        <meshStandardMaterial color="#8e7863" roughness={0.45} metalness={0.2} />
      </mesh>
      {/* Oven */}
      <mesh position={[0, 0.18, 0.05]}>
        <boxGeometry args={[0.9, 0.36, 0.5]} />
        <meshStandardMaterial color="#c4b09a" roughness={0.7} metalness={0.08} />
        <Edges color={INK} />
      </mesh>
      {/* Pack */}
      <mesh position={[1.1, 0.16, 0.12]}>
        <boxGeometry args={[0.62, 0.32, 0.4]} />
        <meshStandardMaterial color="#ddd2c2" roughness={0.55} metalness={0.1} />
        <Edges color={SIGNAL} />
      </mesh>
      {/* Conveyor */}
      <mesh position={[0, 0.05, 0.42]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.6, 0.06, 0.16]} />
        <meshStandardMaterial color="#2b231d" roughness={0.8} />
      </mesh>
    </group>
  );
}

function EdgeCrate({
  alive,
  selected,
  onClick,
}: {
  alive: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const target = alive ? 1 : 0;
    g.scale.x = lerp(g.scale.x, target, Math.min(1, delta * 6));
    g.scale.y = g.scale.x;
    g.scale.z = g.scale.x;
    g.visible = g.scale.x > 0.04;
  });
  return (
    <group ref={ref} position={[-0.62, 1.28, 0]} onClick={onClick}>
      <RoundedBox args={[0.72, 0.48, 0.52]} radius={0.04} smoothness={2}>
        <meshStandardMaterial
          color={PAPER}
          roughness={0.48}
          metalness={0.08}
          emissive={SKY}
          emissiveIntensity={selected ? 0.2 : 0.06}
        />
        <Edges color={SKY} />
      </RoundedBox>
      <Text position={[0, 0, 0.28]} fontSize={0.09} color={INK} anchorX="center">
        Edge crate
      </Text>
    </group>
  );
}

function Conduits({ authority }: { authority: boolean }) {
  const up = useMemo(
    () =>
      [
        new THREE.Vector3(0, 0.22, 0.05),
        new THREE.Vector3(0, 0.72, 0),
        new THREE.Vector3(0, 1.28, 0),
        new THREE.Vector3(0.15, 1.82, 0),
        new THREE.Vector3(0.15, 2.28, 0),
        new THREE.Vector3(0.2, 2.72, 0),
        new THREE.Vector3(0.25, 3.18, 0),
      ],
    [],
  );
  const down = useMemo(
    () =>
      [
        new THREE.Vector3(0.55, 2.72, 0.12),
        new THREE.Vector3(0.5, 2.28, 0.12),
        new THREE.Vector3(0.42, 1.82, 0.12),
        new THREE.Vector3(0.38, 1.28, 0.12),
        new THREE.Vector3(0.32, 0.72, 0.12),
        new THREE.Vector3(0.85, 0.22, 0.18),
      ],
    [],
  );
  const mirror = useMemo(
    () => [new THREE.Vector3(2.15, 0.62, 0.1), new THREE.Vector3(1.05, 1.28, 0.05)],
    [],
  );

  return (
    <group>
      <Line points={up} color={SIGNAL} lineWidth={1.6} transparent opacity={0.7} />
      <Line
        points={down}
        color={LEDGER}
        lineWidth={authority ? 2 : 1.4}
        dashed={!authority}
        dashSize={0.08}
        gapSize={0.06}
        transparent
        opacity={authority ? 0.9 : 0.45}
      />
      {/* SIS mirror OUT only — no reverse segment */}
      <Line
        points={mirror}
        color={VERMILLION}
        lineWidth={1.3}
        dashed
        dashSize={0.07}
        gapSize={0.05}
        transparent
        opacity={0.85}
      />
    </group>
  );
}

function PacketFlow({
  authority,
  reduced,
}: {
  authority: boolean;
  reduced: boolean;
}) {
  const obs = useRef<Group>(null);
  const auth = useRef<Group>(null);
  useFrame((clockState) => {
    if (reduced) return;
    const t = clockState.clock.elapsedTime;
    const u = (t * 0.22) % 1;
    if (obs.current) {
      obs.current.position.set(0.02, 0.3 + u * 2.8, 0.06);
    }
    if (auth.current) {
      const d = authority ? (t * 0.18) % 1 : 0;
      auth.current.position.set(0.42, 2.6 - d * 2.2, 0.14);
      auth.current.visible = authority;
    }
  });
  if (reduced) return null;
  return (
    <group>
      <group ref={obs}>
        <mesh>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color={SIGNAL} roughness={0.4} />
        </mesh>
      </group>
      <group ref={auth} visible={authority}>
        <mesh>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshStandardMaterial color={LEDGER} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Purdue tower + Ignition crates + offset SIS. Shallow camera arc.
 * No inbound SIS line. Edge crate can vanish without moving L0/L1.
 */
export function Scene({
  progress,
  state,
  dispatch,
  accent = SIGNAL,
  reduced = false,
}: SceneProps) {
  const root = useRef<Group>(null);
  const { camera } = useThree();
  const select = (node: SelectedNode) => dispatch({ type: 'SELECT', node });
  const authority = conduitAuthoritySolid(state);

  useFrame(() => {
    const p = reduced ? 0.42 : progress.get();
    const cam = camera as PerspectiveCamera;
    const keys = {
      x: [4.6, 3.8, 2.6, 2.2, 3.1, 3.6],
      y: [1.35, 1.55, 1.85, 2.35, 2.85, 3.15],
      z: [5.4, 4.8, 4.2, 3.8, 4.4, 5.0],
      lookY: [0.45, 0.85, 1.25, 1.85, 2.45, 2.9],
    };
    let u: number;
    if (p <= 0.16) u = smoothstep(0, 0.16, p);
    else if (p <= 0.34) u = 1 + smoothstep(0.16, 0.34, p);
    else if (p <= 0.5) u = 2 + smoothstep(0.34, 0.5, p);
    else if (p <= 0.68) u = 3 + smoothstep(0.5, 0.68, p);
    else if (p <= 0.86) u = 4 + smoothstep(0.68, 0.86, p);
    else u = 5;
    const i0 = Math.min(4, Math.floor(u));
    const i1 = Math.min(5, i0 + 1);
    const f = u - i0;
    cam.position.set(
      lerp(keys.x[i0], keys.x[i1], f),
      lerp(keys.y[i0], keys.y[i1], f),
      lerp(keys.z[i0], keys.z[i1], f),
    );
    const look = new THREE.Vector3(0.15, lerp(keys.lookY[i0], keys.lookY[i1], f), 0);
    cam.lookAt(look);

    // Idle sway removed — the topology holds still between stage changes.
  });

  return (
    <group>
      <color attach="background" args={[GROUND]} />
      <fog attach="fog" args={[GROUND, 10, 22]} />
      <ambientLight intensity={0.42} color="#f2ebe1" />
      <hemisphereLight args={['#f8f2e9', '#1a1612', 0.4]} />
      <directionalLight position={[5.2, 6.2, 4.2]} intensity={0.85} color="#fff8ef" />
      <directionalLight position={[-3.5, 2.2, -2.4]} intensity={0.28} color={accent} />

      <group ref={root}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, -0.02, 0]} receiveShadow>
          <circleGeometry args={[4.6, 48]} />
          <meshStandardMaterial color="#12100e" roughness={0.95} />
        </mesh>

        {/* L0 field pad */}
        <group onClick={() => select('field')}>
          <mesh position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[3.5, 0.08, 2.15]} />
            <meshStandardMaterial color="#2a241e" roughness={0.9} />
            <Edges color={INK} />
          </mesh>
          <FieldMachines />
          <Text position={[0, 0.02, 1.22]} fontSize={0.09} color="#d7c6b0" anchorX="center">
            L0 Field · North Cell
          </Text>
        </group>

        <Slab
          position={[0, 0.72, 0]}
          size={[2.7, 0.16, 1.45]}
          label="L1 PLC · clamp"
          color={LEDGER}
          selected={state.selected === 'plc' || state.selected === 'clamp'}
          onClick={() => select('clamp')}
        />

        <EdgeCrate
          alive={state.edgeAlive}
          selected={state.selected === 'edge'}
          onClick={() => select('edge')}
        />

        <Slab
          position={[0.62, 1.28, 0]}
          size={[0.86, 0.5, 0.56]}
          label="Gateway"
          color={SIGNAL}
          selected={state.selected === 'gateway'}
          onClick={() => select('gateway')}
        />

        <Slab
          position={[-0.55, 1.82, 0]}
          size={[0.92, 0.28, 0.5]}
          label="Perspective"
          color={SIGNAL}
          selected={state.selected === 'clients'}
          onClick={() => select('clients')}
        />
        <Slab
          position={[0.55, 1.82, 0]}
          size={[0.78, 0.28, 0.5]}
          label="Vision"
          color={SIGNAL}
          selected={state.selected === 'clients'}
          onClick={() => select('clients')}
        />

        <Slab
          position={[1.45, 1.28, 0.05]}
          size={[0.62, 0.42, 0.48]}
          label="Historian"
          color={INK}
          selected={state.selected === 'historian'}
          onClick={() => select('historian')}
        />

        <mesh position={[0.1, 2.28, 0]} onClick={() => select('dmz')}>
          <boxGeometry args={[2.15, 0.32, 1.15]} />
          <meshStandardMaterial
            color="#d7c6b0"
            transparent
            opacity={0.28}
            roughness={0.2}
            metalness={0.05}
          />
          <Edges color={INK} />
        </mesh>
        <Text position={[0.1, 2.28, 0.6]} fontSize={0.1} color={INK} anchorX="center">
          L3.5 DMZ
        </Text>

        <Slab
          position={[0, 2.72, 0]}
          size={[1.35, 0.26, 0.72]}
          label="SOP gate"
          color={LEDGER}
          selected={state.selected === 'sop'}
          onClick={() => select('sop')}
        />
        <Slab
          position={[0.15, 3.18, 0]}
          size={[1.05, 0.24, 0.62]}
          label="ERP"
          color={INK}
          selected={state.selected === 'erp'}
          onClick={() => select('erp')}
        />

        {/* SIS island — offset, dashed pedestal, no inbound conduit */}
        <group
          position={[2.35, 0.42, 0.15]}
          onClick={() => select('sis')}
          data-write-path-sis="false"
        >
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.62, 0.62, 0.06, 24]} />
            <meshStandardMaterial color="#2a1810" roughness={0.85} />
          </mesh>
          <RoundedBox args={[0.82, 0.95, 0.55]} radius={0.04} smoothness={2}>
            <meshStandardMaterial
              color={PAPER}
              roughness={0.48}
              emissive={VERMILLION}
              emissiveIntensity={state.selected === 'sis' ? 0.28 : 0.08}
            />
            <Edges color={VERMILLION} />
          </RoundedBox>
          <Text position={[0, 0.18, 0.3]} fontSize={0.11} color={VERMILLION} anchorX="center">
            SIS
          </Text>
          <Text position={[0, -0.02, 0.3]} fontSize={0.07} color={INK} anchorX="center">
            NO WRITE
          </Text>
        </group>

        <Conduits authority={authority} />
        <PacketFlow authority={authority} reduced={reduced} />
      </group>

      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.45}
        scale={10}
        blur={2.4}
        far={6}
      />
    </group>
  );
}
