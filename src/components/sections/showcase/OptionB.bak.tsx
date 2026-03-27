'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValueEvent } from 'framer-motion';
import { projects } from './projects';

function PadIndex(i: number) {
    return String(i + 1).padStart(2, '0');
}

/** Compute card width dynamically from the actual viewport */
function useViewportDims() {
    const [dims, setDims] = useState({ cardW: 0, viewportW: 0, viewportH: 0, ready: false });

    const measure = useCallback(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Card width: 88% on mobile, 75% on tablet, 65% capped at 1100px on desktop
        let cardW: number;
        if (vw < 640) {
            cardW = vw * 0.88;
        } else if (vw < 1024) {
            cardW = vw * 0.75;
        } else {
            cardW = Math.min(vw * 0.65, 1100);
        }

        setDims({ cardW, viewportW: vw, viewportH: vh, ready: true });
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [measure]);

    return dims;
}

export function OptionB() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const { cardW, viewportW, viewportH, ready } = useViewportDims();

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

    // Compute the exact pixel translation needed based on actual track width
    const [translateEnd, setTranslateEnd] = useState(0);

    useEffect(() => {
        if (!trackRef.current || !ready || !viewportW) return;
        const trackWidth = trackRef.current.scrollWidth;
        setTranslateEnd(Math.max(0, trackWidth - viewportW));
    }, [cardW, viewportW, ready]);

    const rawX = useTransform(scrollYProgress, [0, 1], [0, -translateEnd]);
    const x = useSpring(rawX, { stiffness: 80, damping: 30, mass: 0.5 });

    // Background color transitions through each project's accent
    const inputRange = projects.map((_, i) => i / (projects.length - 1));
    const accentColors = projects.map((p) => p.accent);

    const r = useTransform(scrollYProgress, inputRange, accentColors.map((c) => parseInt(c.slice(1, 3), 16)));
    const g = useTransform(scrollYProgress, inputRange, accentColors.map((c) => parseInt(c.slice(3, 5), 16)));
    const b = useTransform(scrollYProgress, inputRange, accentColors.map((c) => parseInt(c.slice(5, 7), 16)));
    const bgTemplate = useMotionTemplate`rgba(${r}, ${g}, ${b}, 0.03)`;

    // Gap between cards in pixels
    const gap = cardW < 600 ? 16 : 32;

    // Image area height sized to card width at ~16:10 ratio (matches typical screenshots)
    const imageH = Math.round(cardW * 0.58);

    return (
        <div
            ref={containerRef}
            className="bg-paper"
            style={{
                position: "relative",
                height: `${projects.length * 100}vh`,
            }}
        >
            {/* Tint overlay pinned to viewport */}
            <m.div className="sticky top-0 w-full h-screen pointer-events-none z-0" style={{ backgroundColor: bgTemplate }} />

            {/* Sticky viewport — below header, vertically centered */}
            <div className="absolute top-0 w-full h-full pointer-events-none">
                <div className="sticky top-16 overflow-hidden flex items-center pointer-events-auto" style={{ height: 'calc(100vh - 64px)' }}>
                    {/* Counter */}
                    <div className="absolute top-8 right-8 z-[100] font-mono text-sm text-ink-muted">
                        <Counter scrollProgress={scrollYProgress} total={projects.length} />
                    </div>

                    {/* Horizontal track */}
                    <m.div
                        ref={trackRef}
                        style={{ x, gap }}
                        className="flex items-center h-full"
                    >
                        {/* Left spacer — centers first card */}
                        <div className="flex-shrink-0" style={{ width: ready ? (viewportW - cardW) / 2 : '10vw' }} />

                        {projects.map((project, i) => (
                            <ProjectCard
                                key={project.label}
                                project={project}
                                index={i}
                                cardW={cardW}
                                imageH={imageH}
                            />
                        ))}

                        {/* Right spacer — centers last card */}
                        <div className="flex-shrink-0" style={{ width: ready ? (viewportW - cardW) / 2 : '10vw' }} />
                    </m.div>
                </div>
            </div>
        </div>
    );
}

/* ─── Counter ─────────────────────────────────────────────── */

function Counter({
    scrollProgress,
    total,
}: {
    scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
    total: number;
}) {
    const [idx, setIdx] = useState(0);
    useMotionValueEvent(scrollProgress, 'change', (v: number) => {
        const i = Math.min(Math.round(v * (total - 1)), total - 1);
        setIdx(i);
    });
    return (
        <span>
            {PadIndex(idx)} / {PadIndex(total - 1)}
        </span>
    );
}

/* ─── Project Card ────────────────────────────────────────── */

function ProjectCard({
    project,
    index,
    cardW,
    imageH,
}: {
    project: (typeof projects)[number];
    index: number;
    cardW: number;
    imageH: number;
}) {
    return (
        <div
            className="flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-white border border-border"
            style={{ width: cardW }}
        >
            {/* macOS window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-paper-warm border-b border-border">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10" />
                <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10" />
                <span className="ml-3 text-xs font-mono text-ink-muted">{project.label}</span>
            </div>

            {/* Project image — 100% visible, light tinted backdrop */}
            <div className="relative" style={{ height: imageH, backgroundColor: project.accent + '0A' }}>
                <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    sizes={`${Math.round(cardW)}px`}
                    className="object-contain"
                    priority={index === 0}
                />
            </div>

            {/* Compact info bar */}
            <div className="px-5 py-5 bg-white border-t border-border">
                <span className="inline-block px-2.5 py-0.5 mb-2 rounded-full border border-border bg-paper text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                    {project.category}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-ink">{project.title}</h3>
                <p className="text-sm text-ink-light max-w-xl leading-relaxed mt-1">
                    {project.description}
                </p>
            </div>
        </div>
    );
}
