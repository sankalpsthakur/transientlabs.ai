'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Edges, Line, RoundedBox, Text } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const PLANT = '#1f3f93';
const LEDGER = '#8b5e34';
const EVIDENCE = '#3d5c4a';
const CONTROL = '#18120d';
const PAPER = '#f4eee4';

function Slab({
  position,
  label,
  color,
  size = [1.05, 0.28, 0.72],
}: {
  position: [number, number, number];
  label: string;
  color: string;
  size?: [number, number, number];
}) {
  return (
    <group position={position}>
      <RoundedBox args={size} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color={PAPER}
          roughness={0.5}
          metalness={0.04}
          emissive={color}
          emissiveIntensity={0.05}
        />
        <Edges scale={1.004} color={color} threshold={18} />
      </RoundedBox>
      <Text
        position={[0, 0, size[2] / 2 + 0.02]}
        fontSize={0.11}
        color={CONTROL}
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] - 0.12}
      >
        {label}
      </Text>
    </group>
  );
}

function PlantIsland() {
  const labels = ['Field', 'PLC', 'SCADA', 'MES', 'ERP'];
  return (
    <group position={[-2.55, -0.15, 0]}>
      {labels.map((label, i) => (
        <Slab key={label} position={[0, 1.15 - i * 0.42, 0]} label={label} color={PLANT} />
      ))}
    </group>
  );
}

function FinanceIsland() {
  const rings = useMemo(
    () =>
      [0.55, 0.85, 1.15, 1.45].map((r, i) => {
        const pts = Array.from({ length: 48 }, (_, k) => {
          const a = (k / 48) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * r, 0.02, Math.sin(a) * r);
        });
        pts.push(pts[0].clone());
        return { pts, color: i === 3 ? CONTROL : LEDGER };
      }),
    []
  );

  return (
    <group position={[2.45, -0.05, 0.1]}>
      <Slab position={[0, 0.12, 0]} label="Ledger" color={LEDGER} size={[0.95, 0.32, 0.7]} />
      {rings.map((ring, i) => (
        <Line key={i} points={ring.pts} color={ring.color} lineWidth={1} transparent opacity={0.45} />
      ))}
      {['T1', 'T2', 'T3', 'T4'].map((label, i) => {
        const a = -Math.PI / 2 + i * 0.55;
        const r = 0.55 + i * 0.3;
        return (
          <Text
            key={label}
            position={[Math.cos(a) * r, 0.18, Math.sin(a) * r]}
            fontSize={0.09}
            color={LEDGER}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        );
      })}
      <Slab position={[0, -0.85, 0]} label="Gate" color={CONTROL} size={[0.82, 0.26, 0.55]} />
    </group>
  );
}

function EvidenceIsland() {
  const orbit = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return { label: ['Design', 'Track', 'Verify', 'Defend', 'Retire', 'Lineage'][i], a };
    });
  }, []);

  return (
    <group position={[0, -0.35, -2.15]}>
      <mesh rotation={[Math.PI / 2.4, 0, 0]} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.38, 0.48, 1.15, 16]} />
        <meshStandardMaterial color={PAPER} roughness={0.48} metalness={0.06} emissive={EVIDENCE} emissiveIntensity={0.06} />
        <Edges color={EVIDENCE} />
      </mesh>
      <Text position={[0, 0.95, 0.2]} fontSize={0.11} color={CONTROL} anchorX="center">
        Batch
      </Text>
      {orbit.map((item) => (
        <Text
          key={item.label}
          position={[Math.cos(item.a) * 1.05, 0.35, Math.sin(item.a) * 1.05]}
          fontSize={0.085}
          color={EVIDENCE}
          anchorX="center"
        >
          {item.label}
        </Text>
      ))}
    </group>
  );
}

function ControlNucleus() {
  return (
    <group position={[0, 0.35, 0.35]}>
      <RoundedBox args={[1.35, 0.62, 0.62]} radius={0.1} smoothness={5}>
        <meshStandardMaterial
          color={PAPER}
          roughness={0.42}
          metalness={0.08}
          emissive={CONTROL}
          emissiveIntensity={0.1}
        />
        <Edges color={CONTROL} />
      </RoundedBox>
      <Text position={[0, 0.05, 0.34]} fontSize={0.13} color={CONTROL} anchorX="center" anchorY="middle">
        Approve
      </Text>
    </group>
  );
}

function Dust() {
  const points = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={points}>
      <pointsMaterial color="#c4b49a" size={0.018} transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}

function Packets({ reduced }: { reduced: boolean }) {
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const paths = useMemo(
    () => [
      new THREE.QuadraticBezierCurve3(new THREE.Vector3(-2.55, 0.7, 0), new THREE.Vector3(-1.2, 0.9, 0.4), new THREE.Vector3(0, 0.45, 0.35)),
      new THREE.QuadraticBezierCurve3(new THREE.Vector3(2.45, 0.1, 0.1), new THREE.Vector3(1.2, 0.5, 0.5), new THREE.Vector3(0, 0.25, 0.35)),
      new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.2, -2.15), new THREE.Vector3(0.2, 0.8, -0.8), new THREE.Vector3(0, 0.45, 0.2)),
    ],
    []
  );
  const colors = [PLANT, LEDGER, EVIDENCE];
  const { invalidate } = useThree();

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    paths.forEach((curve, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      curve.getPointAt((t * 0.12 + i * 0.33) % 1, mesh.position);
    });
    invalidate();
  });

  if (reduced) return null;

  return (
    <>
      {paths.map((curve, i) => (
        <group key={i}>
          <Line points={curve.getPoints(20)} color={colors[i]} transparent opacity={0.22} lineWidth={1} />
          <mesh ref={(el) => { refs.current[i] = el; }}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function OrbitalRig({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { camera, invalidate } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!reduced) {
      const az = t * 0.08;
      const el = 0.42 + Math.sin(t * 0.17) * 0.08;
      const r = 7.6;
      camera.position.set(Math.cos(az) * r, 1.15 + Math.sin(el) * 1.4, Math.sin(az) * r);
      camera.lookAt(0, 0.05, 0);
      if (group.current) {
        group.current.rotation.y = Math.sin(t * 0.05) * 0.08;
      }
    }
    invalidate();
  });

  return (
    <group ref={group}>
      <Dust />
      <PlantIsland />
      <FinanceIsland />
      <EvidenceIsland />
      <ControlNucleus />
      <Packets reduced={reduced} />
      <ContactShadows position={[0, -2.15, 0]} opacity={0.18} scale={16} blur={2.8} far={7} />
    </group>
  );
}

export function HeroWorkflow() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [5.4, 2.1, 5.8], fov: 40 }}
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[6, 8, 4]} intensity={0.55} />
        <directionalLight position={[-4, 2, -3]} intensity={0.2} />
        <OrbitalRig reduced={reduced} />
      </Canvas>
    </div>
  );
}
