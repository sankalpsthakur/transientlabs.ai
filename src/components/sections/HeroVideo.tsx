'use client';

import { m, useReducedMotion } from 'framer-motion';

export function HeroVideo() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section
            aria-label="Transient Labs in motion"
            className="relative w-full bg-paper overflow-hidden"
        >
            <m.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className="block w-full h-auto object-cover"
                >
                    <source src="/videos/studio-reel.mp4" type="video/mp4" />
                </video>
            </m.div>
        </section>
    );
}
