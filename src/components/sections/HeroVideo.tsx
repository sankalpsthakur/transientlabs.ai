'use client';

import { m } from 'framer-motion';

export function HeroVideo() {
    return (
        <section className="relative w-full bg-paper py-20 md:py-32 overflow-hidden">
            {/* Subtle gradient overlay for visual continuity */}
            <div className="absolute inset-0 bg-gradient-to-b from-paper via-transparent to-paper pointer-events-none z-10" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <m.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="relative rounded-3xl overflow-hidden border border-border/50 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.15)]"
                >
                    {/* Light overlay to soften the dark video */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none z-10" />

                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto block"
                    >
                        <source src="/videos/hero-video.mp4" type="video/mp4" />
                    </video>
                </m.div>
            </div>
        </section>
    );
}
