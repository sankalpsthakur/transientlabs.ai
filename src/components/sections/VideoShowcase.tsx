'use client';

import { useRef, useState } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Target, Activity, GitBranch, Shield } from 'lucide-react';
import { DemoVsProduction } from '@/components/motion/DemoVsProduction';
import { PainPointVisual, type PainPointKind } from '@/components/motion/PainPointVisual';
import { cn } from '@/lib/utils';
import { AgentDiagram, type AgentId } from '@/components/motion/AgentDiagram';
import { IntegratedFlowsSection, integratedFlows } from '@/components/sections/IntegratedFlowsSection';
import { ProgressVideo } from '@/components/video/ProgressVideo';

const challengeIntroAria =
    'Building AI products that work reliably in the real world requires addressing challenges that most teams underestimate.';

const challenges: Array<{ title: string; desc: string; kind: PainPointKind }> = [
    {
        title: 'Privacy and compliance',
        desc: 'Balancing AI capabilities with data privacy requirements and regulatory compliance.',
        kind: 'privacy',
    },
    {
        title: 'Performance at scale',
        desc: 'Maintaining fast response times and predictable costs as usage grows.',
        kind: 'scale',
    },
    {
        title: 'Reliable automation',
        desc: 'Building AI workflows that work consistently, not just in controlled demos.',
        kind: 'automation',
    },
    {
        title: 'Measuring success',
        desc: 'Connecting AI performance to business outcomes that actually matter.',
        kind: 'success',
    },
    {
        title: 'Vendor dependencies',
        desc: 'Avoiding lock-in while maintaining reliability across AI providers.',
        kind: 'vendor',
    },
    {
        title: 'Quality over time',
        desc: 'Ensuring AI outputs stay accurate and on-brand as systems evolve.',
        kind: 'quality',
    },
];

const agents = [
    {
        id: 'sniper',
        name: 'SNIPER',
        tagline: 'Research → PRD',
        description:
            'Turns messy inputs into a crisp PRD with competitors, user stories, and edge cases',
        color: '#f59e0b',
        icon: Target,
        gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
        glow: 'shadow-amber-500/30',
    },
    {
        id: 'pulse',
        name: 'PULSE',
        tagline: 'Customer Insights',
        description:
            'Captures feedback and requirements from calls and support logs',
        color: '#06b6d4',
        icon: Activity,
        gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
        glow: 'shadow-cyan-500/30',
    },
    {
        id: 'vector',
        name: 'VECTOR',
        tagline: 'Orchestration',
        description:
            'Deterministic tool-calling with budget enforcement and human review gates',
        color: '#3b82f6',
        icon: GitBranch,
        gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
        glow: 'shadow-blue-500/30',
    },
    {
        id: 'spectre',
        name: 'SPECTRE',
        tagline: 'Adversarial QA',
        description: 'Stress-tests UIs and flows with multiple personas',
        color: '#ef4444',
        icon: Shield,
        gradient: 'from-red-500/20 via-rose-500/10 to-transparent',
        glow: 'shadow-red-500/30',
    },
];

function AnimatedGrid() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Primary grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />
            {/* Secondary finer grid */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                }}
            />
            {/* Radial vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
        </div>
    );
}

interface AgentSectionProps {
    agent: (typeof agents)[0];
    index: number;
    progress: ReturnType<typeof useTransform<number, number>>;
}

function AgentSection({ agent, index, progress }: AgentSectionProps) {
    const Icon = agent.icon;
    const reduced = useReducedMotion();
    const [videoOk, setVideoOk] = useState(false);

    // Calculate section-specific scroll progress (0 to 1 for each section)
    const sectionStart = index / agents.length;
    const sectionEnd = (index + 1) / agents.length;

    const sectionProgress = useTransform(
        progress,
        [sectionStart, sectionEnd],
        [0, 1]
    );

    // Content animations based on section progress
    const contentOpacity = useTransform(sectionProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const contentY = useTransform(sectionProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);

    // Video placeholder animations
    const videoScale = useTransform(sectionProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
    const videoOpacity = useTransform(sectionProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
    const videoRotateX = useTransform(sectionProgress, [0, 0.3], [10, 0]);

    // Text reveal animations
    const titleX = useTransform(sectionProgress, [0, 0.4], [-40, 0]);
    const _descX = useTransform(sectionProgress, [0.1, 0.5], [40, 0]);

    return (
        <div
            className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
            style={{ zIndex: index + 1 }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

            <Container className="relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Video Placeholder */}
                    <m.div
                        style={{
                            scale: videoScale,
                            opacity: videoOpacity,
                            rotateX: videoRotateX,
                        }}
                        className={`relative aspect-video rounded-xl overflow-hidden ${
                            index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
                        } group outline-none focus-visible:ring-2 focus-visible:ring-white/20`}
                        tabIndex={0}
                        aria-label={agent.description}
                    >
                        {/* Animated gradient background */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} animate-pulse`}
                            style={{
                                backgroundSize: '200% 200%',
                                animation: 'gradientShift 8s ease infinite',
                            }}
                        />

                        {/* Grid pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: `
                                    linear-gradient(${agent.color}20 1px, transparent 1px),
                                    linear-gradient(90deg, ${agent.color}20 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        {/* Glow effect */}
                        <div
                            className={`absolute inset-0 shadow-[inset_0_0_100px_${agent.color}20]`}
                        />

                        {/* Agent process diagram (replaces description text) */}
                        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
                            <div
                                className="w-full h-full rounded-lg border backdrop-blur-sm flex items-center justify-center"
                                style={{
                                    borderColor: `${agent.color}25`,
                                    backgroundColor: `${agent.color}08`,
                                }}
                            >
                                {/* Progressive enhancement: Remotion MP4 (scroll-synced), with SVG fallback */}
                                {!reduced && (
                                    <ProgressVideo
                                        src={`/videos/agent-${agent.id}.mp4`}
                                        progress={sectionProgress}
                                        durationSeconds={15}
                                        className={cn(
                                            "absolute inset-0 w-full h-full object-cover",
                                            "transition-opacity duration-300",
                                            videoOk ? "opacity-100" : "opacity-0"
                                        )}
                                        onStatusChange={(s) => setVideoOk(s === 'ready')}
                                    />
                                )}
                                <AgentDiagram
                                    agentId={agent.id as AgentId}
                                    progress={sectionProgress}
                                    ariaLabel={agent.description}
                                    className="max-w-[520px] w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Tooltip for the removed description text */}
                        <div
                            role="tooltip"
                            className={cn(
                                "pointer-events-none absolute left-4 right-4 bottom-4",
                                "rounded-lg border border-white/10 bg-black/75 px-3 py-2",
                                "text-xs text-white/70 leading-relaxed",
                                "opacity-0 translate-y-1 transition-all duration-200",
                                "group-hover:opacity-100 group-hover:translate-y-0",
                                "group-focus-within:opacity-100 group-focus-within:translate-y-0"
                            )}
                        >
                            {agent.description}
                        </div>

                        {/* Corner accents */}
                        <div
                            className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2"
                            style={{ borderColor: agent.color }}
                        />
                        <div
                            className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2"
                            style={{ borderColor: agent.color }}
                        />
                        <div
                            className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2"
                            style={{ borderColor: agent.color }}
                        />
                        <div
                            className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2"
                            style={{ borderColor: agent.color }}
                        />
                    </m.div>

                    {/* Text Content */}
                    <m.div
                        style={{ opacity: contentOpacity, y: contentY }}
                        className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}
                    >
                        {/* Agent badge */}
                        <m.div
                            style={{ x: titleX }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${agent.color}15` }}
                            >
                                <Icon className="w-6 h-6" style={{ color: agent.color }} />
                            </div>
                            <div
                                className="h-px flex-1 max-w-[100px]"
                                style={{
                                    background: `linear-gradient(90deg, ${agent.color}40, transparent)`,
                                }}
                            />
                        </m.div>

                        {/* Agent name */}
                        <m.h3
                            style={{ x: titleX }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2"
                        >
                            <span style={{ color: agent.color }}>{agent.name}</span>
                        </m.h3>

                        {/* Tagline */}
                        <m.p
                            style={{ x: titleX }}
                            className="text-xl md:text-2xl text-white/60 font-mono tracking-wider uppercase mb-6"
                        >
                            {agent.tagline}
                        </m.p>

                        <span className="sr-only">{agent.description}</span>
                    </m.div>
                </div>
            </Container>
        </div>
    );
}

export function VideoShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Header animation based on overall scroll
    const headerOpacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
    const headerY = useTransform(scrollYProgress, [0, 0.18], [0, -60]);
    const headerPointerEvents = useTransform(scrollYProgress, [0, 0.17, 0.18], ['auto', 'auto', 'none']);

    // Progress bar
    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <>
            <section
                ref={containerRef}
                id="showcase"
                className="relative bg-black"
                style={{ minHeight: `${agents.length * 100}vh` }}
            >
            {/* Fixed background grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <AnimatedGrid />
            </div>

            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
                <m.div
                    className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 via-blue-500 to-red-500"
                    style={{ width: progressWidth }}
                />
            </div>

            {/* Section Header */}
            <m.div
                style={{ opacity: headerOpacity, y: headerY, pointerEvents: headerPointerEvents }}
                className="sticky top-0 h-screen flex items-center justify-center z-10 px-4"
            >
                <div className="w-full max-w-6xl mx-auto">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
                        <span className="text-sm font-mono uppercase tracking-widest text-white/50">
                            The Challenge
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
                    </m.div>

                    <m.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-center text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6"
                    >
                        AI that works in{' '}
                        <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                            production
                        </span>
                    </m.h2>

                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-8"
                    >
                        <DemoVsProduction ariaLabel={challengeIntroAria} className="mx-auto max-w-5xl" />
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
                    >
                        {challenges.map((item) => (
                            <div
                                key={item.title}
                                tabIndex={0}
                                className={cn(
                                    'group relative rounded-xl border border-white/10 bg-white/[0.03] p-5',
                                    'outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60'
                                )}
                                aria-label={`${item.title}. ${item.desc}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-white/90 font-medium tracking-tight">
                                        {item.title}
                                    </h3>
                                    <div className="h-2 w-2 rounded-full bg-white/30 mt-2 flex-shrink-0" aria-hidden="true" />
                                </div>

                                <div className="mt-4">
                                    <PainPointVisual kind={item.kind} ariaLabel={item.desc} />
                                </div>

                                <div
                                    role="tooltip"
                                    className={cn(
                                        'pointer-events-none absolute left-4 right-4 bottom-4',
                                        'rounded-lg border border-white/10 bg-black/80 px-3 py-2',
                                        'text-xs text-white/70 leading-relaxed',
                                        'opacity-0 translate-y-1 transition-all duration-200',
                                        'group-hover:opacity-100 group-hover:translate-y-0',
                                        'group-focus-within:opacity-100 group-focus-within:translate-y-0'
                                    )}
                                >
                                    {item.desc}
                                </div>
                            </div>
                        ))}
                    </m.div>

                    {/* Scroll indicator */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-14 flex flex-col items-center gap-2"
                    >
                        <span className="text-xs font-mono uppercase tracking-widest text-white/30">
                            Scroll
                        </span>
                        <m.div
                            className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
                            animate={{ y: [0, 5, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <m.div
                                className="w-1 h-2 bg-white/40 rounded-full"
                                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        </m.div>
                    </m.div>
                </div>
            </m.div>

            {/* Agent Sections */}
            <div className="relative z-20">
                {agents.map((agent, index) => (
                    <AgentSection
                        key={agent.id}
                        agent={agent}
                        index={index}
                        progress={scrollYProgress}
                    />
                ))}
            </div>

            {/* End section spacer */}
            <div className="h-[50vh] relative z-10 flex items-center justify-center">
                <m.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <p className="text-white/30 font-mono text-sm uppercase tracking-widest mb-4">
                        Ready to deploy?
                    </p>
                    <div
                        className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                </m.div>
            </div>
            </section>

            <section className="bg-black py-24">
                <Container>
                    <IntegratedFlowsSection flows={integratedFlows} />
                </Container>
            </section>
        </>
    );
}
