'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Edges, Line, RoundedBox, Text } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type NodeSpec = {
  id: string;
  label: string;
  position: THREE.Vector3;
  color: string;
};

type EdgeSpec = {
  from: number;
  to: number;
  color: string;
  phase: number;
};

function WorkflowScene() {
  const groupRef = useRef<THREE.Group>(null);
  const packetRefs = useRef<Array<THREE.Mesh | null>>([]);
  const { invalidate } = useThree();

  const nodes: NodeSpec[] = useMemo(
    () => [
      { id: 'strategy', label: 'Strategy', position: new THREE.Vector3(-2.35, 1.35, 0.18), color: '#0ea5e9' },
      { id: 'design', label: 'Design', position: new THREE.Vector3(-0.2, 1.75, -0.18), color: '#22c55e' },
      { id: 'engineering', label: 'Engineering', position: new THREE.Vector3(2.05, 1.0, 0.1), color: '#a855f7' },
      { id: 'ai', label: 'AI', position: new THREE.Vector3(2.2, -0.95, -0.12), color: '#f59e0b' },
      { id: 'qa', label: 'QA', position: new THREE.Vector3(0.15, -1.75, 0.12), color: '#ef4444' },
      { id: 'deploy', label: 'Deploy', position: new THREE.Vector3(-2.1, -0.85, -0.08), color: '#6366f1' },
    ],
    []
  );

  const edges: EdgeSpec[] = useMemo(
    () => [
      { from: 0, to: 1, color: '#0ea5e9', phase: 0.0 },
      { from: 1, to: 2, color: '#22c55e', phase: 0.18 },
      { from: 2, to: 3, color: '#a855f7', phase: 0.36 },
      { from: 3, to: 4, color: '#f59e0b', phase: 0.54 },
      { from: 4, to: 5, color: '#ef4444', phase: 0.72 },
    ],
    []
  );

  const curves = useMemo(() => {
    return edges.map((edge) => {
      const from = nodes[edge.from].position;
      const to = nodes[edge.to].position;
      const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
      // Pull the curve slightly "forward" and "up" for depth + readability.
      const lift = 0.35 + Math.abs(from.x - to.x) * 0.06;
      mid.z += 0.35;
      mid.y += lift;

      const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
      return curve;
    });
  }, [edges, nodes]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.08;
    }

    curves.forEach((curve, i) => {
      const phase = (t * 0.25 + edges[i].phase) % 1;
      const packet = packetRefs.current[i];
      if (!packet) return;
      curve.getPointAt(phase, packet.position);
      packet.position.y += Math.sin(t * 2.0 + i) * 0.03;
    });

    invalidate();
  });

  return (
    <group ref={groupRef}>
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.25}
        scale={12}
        blur={2.8}
        far={6}
      />

      {/* Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.position}>
          <RoundedBox args={[1.1, 0.66, 0.38]} radius={0.10} smoothness={6}>
            <meshStandardMaterial
              color={new THREE.Color('#f7f7f7')}
              roughness={0.42}
              metalness={0.08}
              emissive={new THREE.Color(node.color)}
              emissiveIntensity={0.08}
              transparent
              opacity={0.96}
            />
            <Edges scale={1.01} color={node.color} opacity={0.55} transparent />
          </RoundedBox>

          <Text
            position={[0, 0, 0.22]}
            fontSize={0.14}
            color="#111111"
            anchorX="center"
            anchorY="middle"
            maxWidth={0.95}
            outlineWidth={0.012}
            outlineColor="rgba(255,255,255,0.75)"
          >
            {node.label}
          </Text>
        </group>
      ))}

      {/* Connections + packets */}
      {edges.map((edge, idx) => {
        const curve = curves[idx];
        const points = curve.getPoints(18);
        return (
          <group key={`${edge.from}-${edge.to}`}>
            <Line
              points={points}
              color={edge.color}
              lineWidth={1}
              transparent
              opacity={0.28}
            />
            <mesh
              ref={(el) => {
                packetRefs.current[idx] = el;
              }}
            >
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial
                color={edge.color}
                emissive={edge.color}
                emissiveIntensity={0.65}
                roughness={0.35}
                metalness={0.15}
                transparent
                opacity={0.95}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function HeroWorkflow() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.25, 7], fov: 45 }}
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[6, 7, 4]} intensity={0.55} />
        <directionalLight position={[-5, -4, 6]} intensity={0.28} />
        <pointLight position={[0, 2.2, 2.8]} intensity={0.45} />
        <WorkflowScene />
      </Canvas>
    </div>
  );
}
