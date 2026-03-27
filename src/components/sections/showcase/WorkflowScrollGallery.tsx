'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { m, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValueEvent, useReducedMotion, MotionValue } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { OpenClawWorkflowTemplate } from './openclawWorkflows';

function PadIndex(i: number) {
    return String(i + 1).padStart(2, '0');
}

function useViewportDims() {
    const [dims, setDims] = useState({ cardW: 0, viewportW: 0, ready: false });

    const measure = useCallback(() => {
        const vw = window.innerWidth;

        let cardW: number;
        if (vw < 640) {
            cardW = vw * 0.88;
        } else if (vw < 1024) {
            cardW = vw * 0.75;
        } else {
            cardW = Math.min(vw * 0.65, 1100);
        }

        setDims({ cardW, viewportW: vw, ready: true });
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [measure]);

    return dims;
}

interface WorkflowScrollGalleryProps {
    workflows: OpenClawWorkflowTemplate[];
}

/**
 * Fade-through gallery: cards crossfade in place as the user scrolls.
 * One card visible at a time with smooth opacity + scale transitions.
 * Provides strong visual contrast to the horizontal-scroll cinema in OptionB.
 */
export function WorkflowScrollGallery({ workflows }: WorkflowScrollGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { cardW, viewportW: _viewportW, ready: _ready } = useViewportDims();
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

    // Background color transitions through each workflow's accent
    const n = workflows.length;
    const inputRange = workflows.map((_, i) => i / (n - 1));
    const rVals = workflows.map((w) => parseInt(w.accent.slice(1, 3), 16));
    const gVals = workflows.map((w) => parseInt(w.accent.slice(3, 5), 16));
    const bVals = workflows.map((w) => parseInt(w.accent.slice(5, 7), 16));
    const r = useTransform(scrollYProgress, inputRange, rVals);
    const g = useTransform(scrollYProgress, inputRange, gVals);
    const b = useTransform(scrollYProgress, inputRange, bVals);
    const bgTemplate = useMotionTemplate`rgba(${r}, ${g}, ${b}, 0.04)`;

    const imageH = Math.round(cardW * 0.58);

    return (
        <m.div
            ref={containerRef}
            className="bg-paper"
            style={{
                position: 'relative',
                // Each card gets 100vh of scroll range
                height: `${n * 100}vh`,
            }}
        >
            {/* Tint overlay pinned to viewport */}
            <m.div className="sticky top-0 w-full h-screen pointer-events-none z-0" style={{ backgroundColor: bgTemplate }} />

            {/* Sticky viewport pinned below the header */}
            <div className="absolute top-0 w-full h-full pointer-events-none">
                <div
                    className="sticky top-16 overflow-hidden flex items-center justify-center pointer-events-auto"
                    style={{ height: 'calc(100vh - 64px)' }}
                >
                    {/* Counter — top right */}
                    <div className="absolute top-8 right-8 z-20 font-mono text-sm text-ink-muted">
                        <WorkflowCounter scrollProgress={scrollYProgress} total={n} />
                    </div>

                    {/* Card stack — all cards occupy the same position, crossfade via opacity */}
                    <div className="relative" style={{ width: cardW || '80vw' }}>
                        {workflows.map((workflow, i) => (
                            <FadeCard
                                key={workflow.label}
                                workflow={workflow}
                                index={i}
                                total={n}
                                cardW={cardW}
                                imageH={imageH}
                                scrollProgress={scrollYProgress}
                                prefersReducedMotion={!!prefersReducedMotion}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </m.div>
    );
}

/* --- Fade Card Wrapper -------------------------------------------------- */

function FadeCard({
    workflow,
    index,
    total,
    cardW,
    imageH,
    scrollProgress,
    prefersReducedMotion,
}: {
    workflow: OpenClawWorkflowTemplate;
    index: number;
    total: number;
    cardW: number;
    imageH: number;
    scrollProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    // Each card owns a segment of the scroll: [segStart, segEnd].
    // Opacity ramps up during the first 15% of the segment and ramps down
    // during the last 15%. The first card starts fully visible; the last
    // card stays fully visible until the end.
    const segSize = 1 / total;
    const segStart = index * segSize;
    const segEnd = segStart + segSize;
    const fadeIn = segSize * 0.15;
    const fadeOut = segSize * 0.15;

    let opacityInput: number[];
    let opacityOutput: number[];

    if (index === 0) {
        // First card: fully visible at start, fade out at segment end
        opacityInput = [segStart, segEnd - fadeOut, segEnd];
        opacityOutput = [1, 1, 0];
    } else if (index === total - 1) {
        // Last card: fade in, then stay visible
        opacityInput = [segStart, segStart + fadeIn, segEnd];
        opacityOutput = [0, 1, 1];
    } else {
        // Middle cards: fade in, hold, fade out
        opacityInput = [segStart, segStart + fadeIn, segEnd - fadeOut, segEnd];
        opacityOutput = [0, 1, 1, 0];
    }

    const opacity = useTransform(scrollProgress, opacityInput, opacityOutput);

    // Subtle scale for depth — slightly smaller when fading in, full size when visible
    const scaleInput = index === 0
        ? [segStart, segEnd]
        : [segStart, segStart + fadeIn, segEnd];
    const scaleOutput = index === 0
        ? [1, 1]
        : [prefersReducedMotion ? 1 : 0.96, 1, 1];
    const rawScale = useTransform(scrollProgress, scaleInput, scaleOutput);
    const springScale = useSpring(rawScale, { stiffness: 200, damping: 30 });
    const scale = prefersReducedMotion ? rawScale : springScale;

    // Subtle vertical shift — cards rise into view
    const yInput = index === 0
        ? [segStart, segEnd]
        : [segStart, segStart + fadeIn, segEnd];
    const yOutput = index === 0
        ? [0, 0]
        : [prefersReducedMotion ? 0 : 30, 0, 0];
    const rawY = useTransform(scrollProgress, yInput, yOutput);
    const springY = useSpring(rawY, { stiffness: 200, damping: 30 });
    const y = prefersReducedMotion ? rawY : springY;

    return (
        <m.div
            style={{
                opacity,
                scale,
                y,
                position: index === 0 ? 'relative' : 'absolute',
                top: index === 0 ? undefined : 0,
                left: index === 0 ? undefined : 0,
                right: index === 0 ? undefined : 0,
                zIndex: total - index,
                pointerEvents: 'auto',
            }}
        >
            <WorkflowCard
                workflow={workflow}
                cardW={cardW}
                imageH={imageH}
            />
        </m.div>
    );
}

/* --- Counter ------------------------------------------------------------ */

function WorkflowCounter({
    scrollProgress,
    total,
}: {
    scrollProgress: MotionValue<number>;
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

/* --- WorkflowCard (unchanged) ------------------------------------------- */

function WorkflowCard({
    workflow,
    cardW,
    imageH,
}: {
    workflow: OpenClawWorkflowTemplate;
    cardW: number;
    imageH: number;
}) {
    return (
        <article
            className="flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-white border border-border"
            style={{ width: cardW }}
        >
            {/* macOS chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-paper-warm border-b border-border">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10" />
                <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10" />
                <span className="ml-3 text-xs font-mono text-ink-muted">{workflow.label}</span>
            </div>

            {/* Image area -> High-Fidelity Node Visualization */}
            <div className="relative overflow-hidden" style={{ height: imageH, backgroundColor: workflow.accent + '1A' }}>
                <WorkflowVisualizer workflow={workflow} />

                {/* Impact stat pinned at bottom right of the widget area */}
                <div className="absolute right-4 bottom-4 md:right-6 md:bottom-5 flex flex-col items-end text-right z-20">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-ink-muted font-mono bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-border">{workflow.impactLabel}</p>
                    <div className="mt-2 bg-white/90 backdrop-blur border border-border px-4 py-2 rounded-xl shadow-sm">
                        <p className="text-xl md:text-2xl font-bold text-ink" style={{ color: workflow.accent }}>{workflow.impactValue}</p>
                        <p className="text-xs text-ink-light font-medium mt-0.5">{workflow.impactMetric}</p>
                    </div>
                </div>
            </div>

            {/* Info section */}
            <div className="px-5 py-5 bg-white border-t border-border">
                <span className="inline-block px-2.5 py-0.5 mb-2 rounded-full border border-border bg-paper text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                    {workflow.category}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-ink">{workflow.title}</h3>
                <p className="text-sm text-ink-light max-w-xl leading-relaxed mt-1">
                    {workflow.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {workflow.integrations.map((integration) => (
                        <span
                            key={integration}
                            className="text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-full border border-border text-ink-muted bg-paper-warm"
                        >
                            {integration}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}

/* --- Category-Specific Bespoke Visualizers -------------------------------- */

function WorkflowVisualizer({ workflow }: { workflow: OpenClawWorkflowTemplate }) {
    const prefersReducedMotion = useReducedMotion();

    const renderVisualizer = () => {
        switch (workflow.category) {
            case "Command Layer":
                return <CommandLayerVisualizer workflow={workflow} prefersReducedMotion={!!prefersReducedMotion} />;
            case "Content & Growth":
                return <ContentGrowthVisualizer workflow={workflow} prefersReducedMotion={!!prefersReducedMotion} />;
            case "Customer Operations":
                return <CustomerOpsVisualizer workflow={workflow} prefersReducedMotion={!!prefersReducedMotion} />;
            case "HR & Security":
                return <HRSecurityVisualizer workflow={workflow} prefersReducedMotion={!!prefersReducedMotion} />;
            case "Sales":
                return <SalesVisualizer workflow={workflow} prefersReducedMotion={!!prefersReducedMotion} />;
            default:
                // Fallback to a sleek generic view
                return <CommandLayerVisualizer workflow={workflow} prefersReducedMotion={!!prefersReducedMotion} />;
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col justify-center bg-[#070709] overflow-hidden">
            {/* Ambient Background Glow */}
            <m.div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${workflow.accent}, transparent 70%)` }}
                animate={{ opacity: [0.1, 0.2, 0.1], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* High-tech Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

            <div className="w-full h-full max-h-[360px] relative z-10 m-4 sm:m-6 md:m-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden font-mono ring-1 ring-white/5">
                {/* Visualizer Top Bar */}
                <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-white/5 shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-[10px] text-white/50 border-l border-white/10 pl-3 hidden sm:block">runtime_{workflow.category.toLowerCase().replace(/ /g, '_')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-white/70">
                        <span className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                        </span>
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 relative overflow-hidden">
                    {renderVisualizer()}
                </div>
            </div>
        </div>
    );
}

// 1. Command Layer: Network Map / Data Routing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CommandLayerVisualizer({ workflow, prefersReducedMotion }: any) {
    const nodes = workflow.integrations.slice(0, 5);
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Micro Grid Pattern Inside Map */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none mix-blend-screen" />

            {/* Central Orchestrator Core */}
            <div className="relative z-20 w-16 h-16 bg-black border border-indigo-500/30 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.2)] flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay" />
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)] animate-pulse" />
                </div>
                {/* Outward pings */}
                {!prefersReducedMotion && (
                    <m.div className="absolute inset-0 border border-indigo-500/50 rounded-2xl" animate={{ scale: [1, 1.8], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
                )}
            </div>

            {/* Orbiting Nodes & Precise Vector Connections */}
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="-180 -180 360 360"
                preserveAspectRatio="xMidYMid meet"
                overflow="visible"
            >
                <g>
                    {/* Concentric tracking rings like radar */}
                    <circle cx="0" cy="0" r="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 6" />
                    <circle cx="0" cy="0" r="150" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                    {nodes.map((node: string, i: number) => {
                        const angle = (i / nodes.length) * Math.PI * 2;
                        const radius = 100;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        const outerX = Math.cos(angle) * (radius + 20);
                        const outerY = Math.sin(angle) * (radius + 20);

                        return (
                            <g key={i}>
                                {/* Crisp connection lines */}
                                <line x1="0" y1="0" x2={x} y2={y} stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
                                <line x1={x} y1={y} x2={outerX} y2={outerY} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                                {/* Data packets travelling along lines */}
                                {!prefersReducedMotion && (
                                    <m.circle
                                        cx="0" cy="0" r="2.5" fill="#818cf8"
                                        style={{ filter: "drop-shadow(0 0 5px #818cf8)" }}
                                        animate={{ x: [0, x], y: [0, y], opacity: [0, 1, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                                    />
                                )}

                                {/* Target Node Terminal */}
                                <g transform={`translate(${outerX}, ${outerY})`}>
                                    <rect x="-35" y="-12" width="70" height="24" rx="3" fill="#0f172a" stroke="rgba(99,102,241,0.3)" />
                                    <circle cx="-25" cy="0" r="3" fill="#34d399" />
                                    <text x="3" y="3" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="600" letterSpacing="0.05em">{node}</text>
                                </g>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}

// 2. Content & Growth: Kanban / Pipeline
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContentGrowthVisualizer({ workflow, prefersReducedMotion }: any) {
    const columns = ["Drafting", "Review", "Publish"];
    return (
        <div className="absolute inset-0 p-6 flex gap-4 relative">
            {/* Background precise grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* SVG Connecting Paths between columns */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 0 }}>
                {/* Lines from Col 1 to Col 2 */}
                <path d="M 33 50 L 36 50 L 36 30 L 66 30" stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="1" strokeLinejoin="round" />
                <path d="M 33 50 L 36 50 L 36 70 L 66 70" stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="1" strokeLinejoin="round" />

                {/* Lines from Col 2 to Col 3 */}
                <path d="M 66 30 L 69 30 L 69 50 L 100 50" stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="1" strokeLinejoin="round" />
                <path d="M 66 70 L 69 70 L 69 50 L 100 50" stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="1" strokeLinejoin="round" />

                {!prefersReducedMotion && (
                    <>
                        <m.path
                            d="M 33 50 L 36 50 L 36 30 L 66 30"
                            stroke={workflow.accent || "#818cf8"} fill="none" strokeWidth="2" strokeLinejoin="round"
                            strokeDasharray="20 100"
                            animate={{ strokeDashoffset: [120, -20] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <m.path
                            d="M 66 70 L 69 70 L 69 50 L 100 50"
                            stroke={workflow.accent || "#34d399"} fill="none" strokeWidth="2" strokeLinejoin="round"
                            strokeDasharray="20 100"
                            animate={{ strokeDashoffset: [120, -20] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "linear" }}
                        />
                    </>
                )}
            </svg>

            {columns.map((col, i) => (
                <div key={col} className="flex-1 bg-black/60 backdrop-blur-md border border-white/10 rounded border-t-indigo-500/30 flex flex-col p-3 relative z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                        <div className="text-[9px] text-white/60 uppercase tracking-widest font-semibold">{col}</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    </div>

                    {/* Items falling into the column */}
                    <div className="flex-1 flex flex-col gap-2 relative">
                        <div className="w-full h-10 bg-white/[0.03] border border-white/5 rounded px-2 flex items-center">
                            <div className="w-1/2 h-1.5 bg-white/10 rounded mr-2" />
                            <div className="flex-1" />
                            <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="text-[7px] text-white/50">{i + 1}</span>
                            </div>
                        </div>
                        <div className="w-full h-10 bg-white/[0.03] border border-white/5 rounded px-2 flex items-center opacity-50">
                            <div className="w-1/3 h-1.5 bg-white/10 rounded mr-2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// 3. Customer Operations: Inbox Triage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomerOpsVisualizer({ _workflow, prefersReducedMotion }: any) {
    return (
        <div className="absolute inset-0 grid grid-cols-[1fr_2fr_1fr] gap-4 p-6">
            <div className="flex flex-col justify-center gap-3 relative z-10">
                <div className="text-[9px] text-white/60 mb-2 font-semibold tracking-wider">INBOUND STREAM</div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-10 border border-white/10 bg-black/60 backdrop-blur rounded px-3 flex items-center shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                        <div className="w-2 h-2 rounded-full bg-red-400 mr-2 shadow-[0_0_5px_rgba(248,113,113,0.5)]" />
                        <div className="w-12 h-1 bg-white/20 rounded" />
                    </div>
                ))}
            </div>

            {/* Agent Routing Engine (Center) */}
            <div className="flex items-center justify-center border-x border-white/5 relative">
                <div className="absolute top-4 text-[9px] text-indigo-400/80 tracking-widest font-bold bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20 rounded">ROUTING ENGINE</div>
                <div className="w-24 h-24 rounded border border-indigo-500/30 bg-[#07070a] shadow-[0_0_40px_rgba(99,102,241,0.1)] flex items-center justify-center relative rotate-45 z-10 transition-transform">
                    <div className="absolute inset-2 border border-indigo-400/20 rounded flex items-center justify-center">
                        <Terminal className="text-indigo-400/80 -rotate-45" size={20} />
                    </div>
                    {!prefersReducedMotion && (
                        <m.div className="absolute inset-[-1px] border border-indigo-500/50 rounded" animate={{ scale: [1, 1.2], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    )}
                </div>

                {/* SVG Path Connections (Inbound to Engine to Outbound) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Base invisible lines for routing */}
                    <path id="route1" d="M 0 25 C 20 25, 30 50, 50 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <path id="route2" d="M 0 50 C 20 50, 30 50, 50 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <path id="route3" d="M 0 75 C 20 75, 30 50, 50 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                    <path id="out1" d="M 50 50 C 70 50, 80 35, 100 35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <path id="out2" d="M 50 50 C 70 50, 80 65, 100 65" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                    {/* Animated packets */}
                    {!prefersReducedMotion && (
                        <>
                            {/* Inbound Red Packets */}
                            <m.path d="M 0 25 C 20 25, 30 50, 50 50" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="5 100" animate={{ strokeDashoffset: [105, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                            <m.path d="M 0 50 C 20 50, 30 50, 50 50" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="5 100" animate={{ strokeDashoffset: [105, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3, ease: "linear" }} />
                            <m.path d="M 0 75 C 20 75, 30 50, 50 50" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="5 100" animate={{ strokeDashoffset: [105, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6, ease: "linear" }} />

                            {/* Outbound Emerald Packets */}
                            <m.path d="M 50 50 C 70 50, 80 35, 100 35" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5 100" animate={{ strokeDashoffset: [105, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 1, ease: "linear" }} />
                            <m.path d="M 50 50 C 70 50, 80 65, 100 65" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5 100" animate={{ strokeDashoffset: [105, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 1.4, ease: "linear" }} />
                        </>
                    )}
                </svg>
            </div>

            <div className="flex flex-col justify-center gap-6 relative z-10">
                <div className="text-[9px] text-white/60 mb-[-12px] font-semibold tracking-wider text-right">RESOLVED</div>
                {[1, 2].map(i => (
                    <div key={i} className="h-10 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur rounded px-3 flex items-center justify-end shadow-[0_0_10px_rgba(52,211,153,0.05)]">
                        <div className="w-10 h-1 bg-emerald-500/30 rounded mr-2" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// 4. HR & Security: Radar Scanner
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HRSecurityVisualizer({ _workflow, prefersReducedMotion }: any) {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Radar Grid */}
            <div className="w-[280px] h-[280px] border border-white/10 rounded-full relative flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                <div className="w-[180px] h-[180px] border border-white/5 rounded-full" />
                <div className="w-[80px] h-[80px] border border-white/5 rounded-full" />
                <div className="absolute w-full h-[1px] bg-white/5" />
                <div className="absolute h-full w-[1px] bg-white/5" />

                {/* Concentric expanding pings */}
                {!prefersReducedMotion && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <m.circle cx="140" cy="140" r="140" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1" animate={{ scale: [0.28, 1], opacity: [0.8, 0] }} style={{ transformOrigin: "140px 140px" }} transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }} />
                        <m.circle cx="140" cy="140" r="140" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1" animate={{ scale: [0.28, 1], opacity: [0.8, 0] }} style={{ transformOrigin: "140px 140px" }} transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: "easeOut" }} />
                    </svg>
                )}

                {/* Scanner sweep */}
                {!prefersReducedMotion && (
                    <m.div
                        className="absolute top-1/2 left-1/2 w-[140px] h-[140px] origin-top-left bg-gradient-to-br from-indigo-500/30 to-transparent mix-blend-screen"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                    />
                )}

                {/* Grid of identified nodes */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2 + (Math.PI / 8);
                    const radius = i % 2 === 0 ? 100 : 65;
                    return (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full border border-slate-500/50 bg-[#0f172a]"
                            style={{
                                left: `calc(50% + ${Math.cos(angle) * radius}px - 4px)`,
                                top: `calc(50% + ${Math.sin(angle) * radius}px - 4px)`
                            }}
                        >
                            {!prefersReducedMotion && (
                                <m.div
                                    className="absolute inset-[1px] rounded-full bg-emerald-400"
                                    style={{ filter: "drop-shadow(0 0 4px #34d399)" }}
                                    animate={{ opacity: [0, 1, 0, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: (angle / (Math.PI * 2)) * 4 }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 5. Sales: Funnel / Data Filter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SalesVisualizer({ _workflow, prefersReducedMotion }: any) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-2 relative">

            {/* SVG Connecting Funnel Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 0 }}>
                {/* Upper Funnel */}
                <path d="M 10 30 L 40 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <path d="M 50 25 L 50 45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <path d="M 90 30 L 60 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                {/* Lower Funnel */}
                <path d="M 50 65 L 50 85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                {/* Animated Data streams */}
                {!prefersReducedMotion && (
                    <>
                        <m.path d="M 10 30 L 40 50" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 20" animate={{ strokeDashoffset: [22, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                        <m.path d="M 50 25 L 50 45" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 20" animate={{ strokeDashoffset: [22, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                        <m.path d="M 90 30 L 60 50" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 20" animate={{ strokeDashoffset: [22, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />

                        {/* Qualified stream */}
                        <m.path d="M 50 65 L 50 85" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 20" animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    </>
                )}
            </svg>

            {/* Funnel Top - wide ingestion point */}
            <div className="w-[200px] h-12 border border-white/10 bg-black/40 rounded-[100%] flex flex-wrap justify-center items-center content-center gap-1.5 p-2 shadow-[0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px]" />
                {Array.from({ length: 24 }).map((_, i) => (
                    <m.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 relative z-10"
                        animate={!prefersReducedMotion ? { y: [0, 30], opacity: [1, 0], scale: [1, 0.5] } : {}}
                        transition={!prefersReducedMotion ? { duration: 1.5, repeat: Infinity, delay: (i % 8) * 0.2 } : {}}
                    />
                ))}
            </div>

            {/* Machine Logic Block (Qualification) */}
            <div className="w-[140px] py-4 bg-[#0a0a0c] border border-indigo-500/40 rounded shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col items-center justify-center mt-2 relative z-10">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
                <div className="text-[9px] text-white/50 mb-2 tracking-widest uppercase font-semibold">Qualification Engine</div>
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center relative">
                    {!prefersReducedMotion && (
                        <m.div className="absolute inset-0 border-2 border-indigo-400/20 rounded-full border-t-indigo-400/80" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                    )}
                    <Terminal className="w-4 h-4 text-indigo-300" />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
            </div>

            {/* Funnel Bottom - crisp qualified outputs */}
            <div className="w-[80px] h-10 border border-emerald-500/30 bg-emerald-500/5 rounded-[100%] flex items-center justify-center gap-2 mt-2 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative z-10">
                {!prefersReducedMotion && (
                    <>
                        <m.div className="w-2.5 h-2.5 rounded border border-emerald-400/50 bg-emerald-400" style={{ filter: "drop-shadow(0 0 5px #34d399)" }} animate={{ y: [-15, 0], opacity: [0, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} />
                        <m.div className="w-2.5 h-2.5 rounded border border-emerald-400/50 bg-emerald-400" style={{ filter: "drop-shadow(0 0 5px #34d399)" }} animate={{ y: [-15, 0], opacity: [0, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                        <m.div className="w-2.5 h-2.5 rounded border border-emerald-400/50 bg-emerald-400" style={{ filter: "drop-shadow(0 0 5px #34d399)" }} animate={{ y: [-15, 0], opacity: [0, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }} />
                    </>
                )}
            </div>
        </div>
    );
}
