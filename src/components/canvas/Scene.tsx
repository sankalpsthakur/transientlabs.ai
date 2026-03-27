'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';

interface SceneProps {
    children?: ReactNode;
    className?: string;
}

export default function Scene({ children, className, ...props }: SceneProps) {
    return (
        <div className='fixed inset-0 z-0 pointer-events-none'>
            <Canvas
                className={className}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 0, 6], fov: 45 }}
                {...props}
            >
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            </Canvas>
        </div>
    );
}
