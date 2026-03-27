'use client';

import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { easings } from "@/components/ui/Motion";

interface HeroShowcaseProps {
    videoSrc?: string;
    posterSrc?: string;
    className?: string;
}

// Video showcase with parallax effect
export function HeroShowcase({
    videoSrc = "/videos/100x-demo-fast.mp4",
    posterSrc,
    className = "",
}: HeroShowcaseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Parallax scroll effect
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Video moves slower than scroll (parallax depth effect)
    const videoY = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
    const videoOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden ${className}`}
        >
            <m.div
                className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl"
                style={prefersReducedMotion ? {} : {
                    y: videoY,
                    scale: videoScale,
                    opacity: videoOpacity,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                    duration: 0.8,
                    ease: easings.easeOutQuint,
                }}
            >
                {/* Video with parallax */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={posterSrc}
                    className="w-full h-full object-cover"
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                {/* Corner accent */}
                <m.div
                    className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-ink"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                >
                    Live Demo
                </m.div>
            </m.div>
        </div>
    );
}

// Scroll-synced video section for technical patterns
interface ScrollVideoProps {
    videoSrc: string;
    className?: string;
}

export function ScrollSyncedVideo({ videoSrc, className = "" }: ScrollVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Sync video playback with scroll position
    // Note: This is a simplified version - for true scroll-synced video
    // you'd need to use requestAnimationFrame and video.currentTime
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

    return (
        <m.div
            ref={containerRef}
            className={`relative ${className}`}
            style={prefersReducedMotion ? {} : { opacity, scale }}
        >
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-lg"
            >
                <source src={videoSrc} type="video/mp4" />
            </video>
        </m.div>
    );
}

// Hover-reveal video card (for SPECTRE demo)
interface HoverVideoCardProps {
    videoSrc: string;
    title: string;
    description: string;
    className?: string;
}

export function HoverVideoCard({
    videoSrc,
    title,
    description,
    className = "",
}: HoverVideoCardProps) {
    return (
        <m.div
            className={`relative group cursor-pointer ${className}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: easings.easeOutQuint }}
        >
            {/* Static thumbnail / Video container */}
            <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>

                {/* Hover overlay */}
                <m.div
                    className="absolute inset-0 bg-ink/60 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-center text-white p-6">
                        <h4 className="text-lg font-semibold mb-2">{title}</h4>
                        <p className="text-sm text-white/80">{description}</p>
                    </div>
                </m.div>
            </div>
        </m.div>
    );
}
