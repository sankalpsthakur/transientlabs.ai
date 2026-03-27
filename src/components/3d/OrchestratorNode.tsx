'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, Html, Tube } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';


// Colors matching the sub-agents from AgentTeams.tsx
const TEAMS = [
    { label: 'AI-ENG', color: '#3b82f6', speed: 0.8, radius: 2.2, tiltX: 0.2, tiltZ: -0.1, yOffset: 0.2 },
    { label: 'GROWTH', color: '#fbbf24', speed: 0.5, radius: 2.8, tiltX: -0.1, tiltZ: 0.2, yOffset: -0.3 },
    { label: 'Q-MON', color: '#10b981', speed: 0.6, radius: 2.5, tiltX: -0.2, tiltZ: -0.2, yOffset: 0.5 },
    { label: 'SALES', color: '#06b6d4', speed: 0.7, radius: 3.1, tiltX: 0.3, tiltZ: 0.1, yOffset: -0.1 },
];

/**
 * Procedural Data Ring
 * Renders a thin glass ring and an animated data packet that orbits along it.
 */
function DataRing({ config, mouseX, mouseY }: { config: typeof TEAMS[0], mouseX: React.MutableRefObject<number>, mouseY: React.MutableRefObject<number> }) {
    const ringGroup = useRef<THREE.Group>(null);
    const packetRef = useRef<THREE.Mesh>(null);

    // Create a smooth tube geometry for the orbital path
    const path = useMemo(() => {
        const curve = new THREE.EllipseCurve(0, 0, config.radius, config.radius, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(64).map(p => new THREE.Vector3(p.x, p.y, 0));
        return new THREE.CatmullRomCurve3(points, true);
    }, [config.radius]);

    useFrame((state) => {
        if (!ringGroup.current) return;

        // Very slow, subtle rotation of the entire ring system
        ringGroup.current.rotation.z = state.clock.getElapsedTime() * 0.05;

        // Interactive Parallax
        const px = mouseX.current * 0.1;
        const py = mouseY.current * 0.1;
        ringGroup.current.position.set(px, config.yOffset + py, 0);

        // Animate the data packet along the ring
        if (packetRef.current) {
            const time = state.clock.getElapsedTime();
            // speed determines how fast it completes a loop
            const progress = (time * config.speed * 0.2) % 1;
            const pt = path.getPointAt(progress);
            packetRef.current.position.set(pt.x, pt.y, pt.z);
        }
    });

    return (
        <group ref={ringGroup} rotation={[Math.PI / 2 + config.tiltX, 0, config.tiltZ]}>
            {/* The Glass Ring */}
            <Tube args={[path, 64, 0.015, 8, true]}>
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.15}
                    transmission={0.9}
                    roughness={0.1}
                    thickness={0.5}
                />
            </Tube>

            {/* The Glowing Data Packet */}
            <mesh ref={packetRef}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color={config.color} toneMapped={false} />

                {/* HTML Label anchored to the data packet */}
                <Html
                    distanceFactor={10} // Scales based on distance
                    zIndexRange={[100, 0]}
                    center
                    className="pointer-events-none"
                >
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-black/80 border border-white/10 backdrop-blur-md rounded shadow-lg transform translate-x-2 -translate-y-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.color, boxShadow: `0 0 8px ${config.color}` }} />
                        <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-white/90">
                            {config.label}
                        </span>
                    </div>
                </Html>
            </mesh>
        </group>
    );
}

/**
 * High-Fidelity Central Data Core
 * Uses complex MeshPhysicalMaterials to look like a machined, glass/metal engine.
 */
function CentralCore({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>, mouseY: React.MutableRefObject<number> }) {
    const coreRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!coreRef.current || !innerRef.current) return;

        // Rotate the outer core slowly
        coreRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        coreRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;

        // Counter-rotate the inner emissive core rapidly
        innerRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
        innerRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;

        // Core parallax
        coreRef.current.position.x = THREE.MathUtils.lerp(coreRef.current.position.x, mouseX.current * 0.3, 0.1);
        coreRef.current.position.y = THREE.MathUtils.lerp(coreRef.current.position.y, mouseY.current * 0.3, 0.1);
    });

    return (
        <group ref={coreRef}>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>

                {/* Outer Glass Shell (Icosahedron) */}
                <mesh>
                    <icosahedronGeometry args={[1.2, 0]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        wireframe={true}
                        transparent
                        opacity={0.1}
                        transmission={0.95}
                        roughness={0.0}
                        ior={1.5}
                        thickness={2.0}
                    />
                </mesh>

                {/* Inner Protective Mesh (Octahedron) */}
                <mesh>
                    <octahedronGeometry args={[0.85, 0]} />
                    <meshPhysicalMaterial
                        color="#1e293b" // Slate 800
                        wireframe={true}
                        transparent
                        opacity={0.4}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* The "Brain" - Emissive Inner Core */}
                <mesh ref={innerRef}>
                    <icosahedronGeometry args={[0.4, 2]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        toneMapped={false}
                    />
                </mesh>
            </Float>
        </group>
    );
}

function Scene() {
    const mouseX = useRef(0);
    const mouseY = useRef(0);

    // Track mouse for interactive parallax
    useFrame((state) => {
        mouseX.current = (state.pointer.x * 2) / state.viewport.width;
        mouseY.current = (state.pointer.y * 2) / state.viewport.height;
    });

    return (
        <group>
            {/* Precision Studio Lighting */}
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, 0, -10]} intensity={1} color="#3b82f6" /> {/* Blue rim light */}

            {/* The Orchestrator Engine */}
            <CentralCore mouseX={mouseX} mouseY={mouseY} />

            {/* Sub-Agent Data Rings */}
            {TEAMS.map((team, i) => (
                <DataRing
                    key={i}
                    config={team}
                    mouseX={mouseX}
                    mouseY={mouseY}
                />
            ))}

            {/* Ground Shadow for grounding the object in space */}
            <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={15} blur={2.5} far={5} color="#000000" />

            {/* HDRI Environment for realistic glass reflections */}
            <Environment preset="studio" />
        </group>
    );
}

export default function OrchestratorNode() {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        // Fallback for reduced motion
        return (
            <div className="w-full h-full flex items-center justify-center bg-paper-warm border border-border/60 shadow-xl rounded-[2rem] p-8 text-center min-h-[400px]">
                <div>
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-accent to-purple-500 blur-xl opacity-50 mb-4" />
                    <p className="text-ink-muted text-sm font-mono whitespace-nowrap">Orchestrator Node Offline (Reduced Motion)</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden border border-border/80 shadow-2xl relative bg-[#050505] cursor-grab active:cursor-grabbing group">
            {/* Darker background with grid to emulate hacker/technical vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }} gl={{ antialias: true, alpha: false }}>
                <color attach="background" args={['#050505']} />
                <Scene />
            </Canvas>

            {/* Overlay Badges */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-2 pointer-events-none">
                <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest text-white/80 uppercase">Control Plane Sync: OK</span>
                </div>
            </div>

            <div className="absolute top-6 right-6 pointer-events-none hidden sm:block">
                <span className="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase">Sys.Orchestrator.v2</span>
            </div>
        </div>
    );
}
