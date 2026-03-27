'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BitsToAtoms() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Slow, heavy rotation - feels like a massive physical object
        meshRef.current.rotation.y += 0.001;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    });

    return (
        <group position={[2.5, 0, 0]}>
            {/* 
        Sculptural Object: Matte Carbon Icosahedron 
        No wireframe, just pure form.
      */}
            <mesh ref={meshRef} scale={1.2}>
                <icosahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.4}
                    roughness={0.7}
                    flatShading={true} // Enhances the "low poly" industrial look
                />
            </mesh>

            {/* Subtle Halo behind */}
            <mesh scale={1.25} position={[0, 0, -0.5]}>
                <icosahedronGeometry args={[1.5, 1]} />
                <meshBasicMaterial
                    color="#ff3300"
                    wireframe={true}
                    transparent
                    opacity={0.05}
                />
            </mesh>
        </group>
    );
}
