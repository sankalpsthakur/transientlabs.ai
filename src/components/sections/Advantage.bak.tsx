'use client';

import { useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const technicalEdge = [
    {
        title: "RAG that answers with receipts",
        description: "We build retrieval that stays grounded: chunking, re-ranking, and citation-first responses to reduce hallucinations.",
        stats: "Grounded answers · Citations · Fewer hallucinations",
        category: "cost",
    },
    {
        title: "Evals before launch",
        description: "Golden test sets, regression evals, and red-team prompts so quality is measurable (and repeatable) as you iterate.",
        stats: "Regression suite · Measurable quality · Safer iteration",
        category: "reliability",
    },
    {
        title: "Structured outputs + guardrails",
        description: "Schemas, tool-call contracts, and validation loops so agents return clean JSON and your UI doesn't break.",
        stats: "Function schemas · Output validation · Fewer edge-case bugs",
        category: "latency",
    },
    {
        title: "Latency & cost budgets",
        description: "Model routing, streaming, caching, and fallback strategies to keep user experience snappy and spend predictable.",
        stats: "Right-sized models · Caching · Budget enforcement",
        category: "cost",
    },
    {
        title: "Observability built-in",
        description: "Tracing across tool calls and prompts, plus user feedback loops, so you can debug and improve with confidence.",
        stats: "Tracing · Analytics · Continuous improvement",
        category: "reliability",
    },
    {
        title: "Deterministic workflows",
        description: "We replace agent chaos with state, retries, idempotent tools, and guardrails for reliable multi-step execution.",
        stats: "Fewer loops · Predictable outputs · Easier debugging",
        category: "architecture",
    },
];

const howWeWork = [
    {
        week: "Week 1",
        title: "Discovery & Planning",
        deliverables: [
            "Roadmap (scope + milestones)",
            "Wireframes + UX flow",
            "Tech stack selection",
        ],
    },
    {
        week: "Week 2",
        title: "Core Development",
        deliverables: [
            "Core functionality shipped",
            "DB setup + schema",
            "API endpoints + integrations",
        ],
    },
    {
        week: "Week 3",
        title: "Testing, Deployment, Go Live",
        deliverables: [
            "Testing + bug fixes",
            "Production deployment",
            "Live MVP + handoff",
        ],
    },
];

const agents = [
    {
        agent: "AI-ENGINEERING",
        title: "Build & Ship",
        description: "50 skills: training, serving, RAG, quantization, agents, evals—end-to-end AI product engineering.",
    },
    {
        agent: "GROWTH-CONTENT",
        title: "Content & SEO",
        description: "10 skills: content strategy, SEO, paid campaigns, email sequences, and analytics optimization.",
    },
    {
        agent: "QUALITY-MONITORING",
        title: "Evals & Observability",
        description: "6 skills: evaluation benchmarking, tracing, and monitoring via LangSmith, W&B, and MLflow.",
    },
    {
        agent: "SALES-OUTREACH",
        title: "Voice Qualification",
        description: "Automated voice-based lead qualification and follow-up integrated via Retell API.",
    },
];

interface FlowAgent {
    name: string;
    color: string;
}

interface IntegratedFlow {
    id: string;
    title: string;
    agents: FlowAgent[];
    description: string;
    status: 'live' | 'testing';
    metrics?: { label: string; value: string }[];
}

const integratedFlows: IntegratedFlow[] = [
    {
        id: "build-ship",
        title: "Build → Ship",
        agents: [
            { name: "AI-ENG", color: "text-blue-700" },
            { name: "QUALITY", color: "text-emerald-700" },
        ],
        description: "AI engineering skills build the product, quality-monitoring evals and traces validate before deploy.",
        status: "live",
        metrics: [
            { label: "Skills", value: "56" },
            { label: "Evals", value: "Auto" },
        ],
    },
    {
        id: "content-leads",
        title: "Content → Leads",
        agents: [
            { name: "GROWTH", color: "text-amber-800" },
            { name: "SALES", color: "text-cyan-800" },
        ],
        description: "Growth-content publishes SEO and campaigns. Sales-outreach qualifies inbound leads via voice.",
        status: "live",
        metrics: [
            { label: "Channels", value: "5+" },
            { label: "Qualification", value: "Voice" },
        ],
    },
    {
        id: "full-loop",
        title: "Full Loop",
        agents: [
            { name: "AI-ENG", color: "text-blue-700" },
            { name: "GROWTH", color: "text-amber-800" },
            { name: "QUALITY", color: "text-emerald-700" },
            { name: "SALES", color: "text-cyan-800" },
        ],
        description: "All four plugins coordinate end-to-end: build, market, monitor, and sell—as one agentic system.",
        status: "live",
        metrics: [
            { label: "Plugins", value: "4" },
            { label: "Skills", value: "67+" },
        ],
    },
];

const personalization = {
    title: "Adaptive Personalization",
    points: [
        "Segment-specific adapters with routing tool-calls",
        "Continuous extraction of new segments back into traditional ML",
        "Memory stores (mem0, supermemory) for consistent user behavior",
        "Trait-based context injection without bloating prompts",
    ],
};

// ============================================================================
// Sprint Timeline — Horizontal Stepper (no cards)
// ============================================================================

function SprintTimeline() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="mb-24">
            <FadeIn>
                <p className="text-xs text-ink-muted uppercase tracking-wide mb-10">
                    Sprint Timeline
                </p>
            </FadeIn>

            {/* Desktop: horizontal stepper */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-4 right-4 h-px bg-border" />

                    <div className="grid grid-cols-3 gap-8">
                        {howWeWork.map((phase, idx) => (
                            <m.div
                                key={phase.week}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {/* Numbered circle */}
                                <div className="relative flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-mono text-xs font-semibold flex-shrink-0 relative z-10">
                                        {idx + 1}
                                    </div>
                                    <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                                        {phase.week}
                                    </span>
                                </div>

                                {/* Title + deliverables (no card) */}
                                <div className="pl-11">
                                    <h3 className="text-lg font-medium text-ink mb-3">
                                        {phase.title}
                                    </h3>
                                    <ul className="space-y-1.5">
                                        {phase.deliverables.map((d) => (
                                            <li key={d} className="text-sm text-ink-muted">
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </m.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile: vertical stepper with left-edge line */}
            <div className="md:hidden">
                <div className="relative pl-10">
                    {/* Vertical line */}
                    <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-10">
                        {howWeWork.map((phase, idx) => (
                            <m.div
                                key={phase.week}
                                initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-30px" }}
                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                                className="relative"
                            >
                                {/* Numbered circle */}
                                <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center font-mono text-xs font-semibold z-10">
                                    {idx + 1}
                                </div>

                                <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                                    {phase.week}
                                </span>
                                <h3 className="text-lg font-medium text-ink mt-1 mb-2">
                                    {phase.title}
                                </h3>
                                <ul className="space-y-1.5">
                                    {phase.deliverables.map((d) => (
                                        <li key={d} className="text-sm text-ink-muted">
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </m.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Technical Patterns — Expandable Accordion (no cards)
// ============================================================================

function TechnicalPatterns() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const prefersReducedMotion = useReducedMotion();

    const leftColumn = technicalEdge.slice(0, 3);
    const rightColumn = technicalEdge.slice(3);

    const renderItem = (item: typeof technicalEdge[0], globalIdx: number) => (
        <div
            key={item.title}
            className={cn(
                "border-b border-border border-accent-left pl-4 -ml-4 transition-colors duration-300",
                openIndex === globalIdx && "active"
            )}
        >
            <button
                className="w-full py-5 flex items-center justify-between text-left group"
                onClick={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
            >
                <span className="text-ink font-medium pr-4 group-hover:text-ink-light transition-colors">
                    {item.title}
                </span>
                <m.div
                    animate={{ rotate: openIndex === globalIdx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-ink-muted flex-shrink-0" />
                </m.div>
            </button>
            <AnimatePresence>
                {openIndex === globalIdx && (
                    <m.div
                        initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-5">
                            <p className="text-sm text-ink-light leading-relaxed mb-3">
                                {item.description}
                            </p>
                            <p className="text-xs font-medium text-ink-muted">
                                {item.stats}
                            </p>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );

    // Reduced motion: show all expanded
    if (prefersReducedMotion) {
        return (
            <div className="mb-24">
                <p className="text-xs text-ink-muted uppercase tracking-wide mb-8">
                    Technical Patterns
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                    <div className="border-t border-border">
                        {technicalEdge.map((item) => (
                            <div key={item.title} className="border-b border-border py-5">
                                <h3 className="text-ink font-medium mb-2">{item.title}</h3>
                                <p className="text-sm text-ink-light leading-relaxed mb-2">{item.description}</p>
                                <p className="text-xs font-medium text-ink-muted">{item.stats}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-24">
            <FadeIn>
                <p className="text-xs text-ink-muted uppercase tracking-wide mb-8">
                    Technical Patterns
                </p>
            </FadeIn>

            {/* Single column on mobile, two columns on lg */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                <FadeIn className="border-t border-border">
                    {leftColumn.map((item, idx) => renderItem(item, idx))}
                </FadeIn>
                <FadeIn delay={0.1} className="border-t border-border max-lg:border-t-0">
                    {rightColumn.map((item, idx) => renderItem(item, idx + 3))}
                </FadeIn>
            </div>
        </div>
    );
}

// ============================================================================
// Agent Strip — Inline horizontal badges (no card grid)
// ============================================================================

function AgentStrip() {
    const [activeAgent, setActiveAgent] = useState<number | null>(null);
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return (
            <div className="mb-12">
                <div className="flex flex-wrap gap-6">
                    {agents.map((a) => (
                        <div key={a.agent}>
                            <span className="inline-block font-mono text-xs text-white bg-ink px-3 py-1.5 mb-2">
                                {a.agent}
                            </span>
                            <p className="text-xs text-ink-muted">{a.title} — {a.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-12">
            {/* Badge strip — scrollable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                {agents.map((a, idx) => (
                    <div key={a.agent} className="flex items-center flex-shrink-0">
                        <button
                            onMouseEnter={() => setActiveAgent(idx)}
                            onMouseLeave={() => setActiveAgent(null)}
                            onClick={() => setActiveAgent(activeAgent === idx ? null : idx)}
                            className={cn(
                                "font-mono text-xs text-white bg-ink px-3 py-1.5 transition-all duration-200",
                                "hover:bg-ink-light cursor-pointer",
                                activeAgent === idx && "ring-2 ring-ink/30 ring-offset-2"
                            )}
                        >
                            {a.agent}
                        </button>
                        {idx < agents.length - 1 && (
                            <span className="text-ink-muted/40 mx-1 font-light select-none">→</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Expanded description */}
            <AnimatePresence mode="wait">
                {activeAgent !== null && (
                    <m.div
                        key={agents[activeAgent].agent}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 pb-2">
                            <p className="text-sm text-ink-muted">
                                <span className="font-medium text-ink">{agents[activeAgent].title}</span>
                                {" — "}
                                {agents[activeAgent].description}
                            </p>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// Delivery Stack (flow cards — kept as-is, with personalization merged)
// ============================================================================

function FlowConnector({ isAnimating, vertical = false }: { isAnimating: boolean, vertical?: boolean }) {
    if (vertical) {
        return (
            <div className="relative w-4 h-6 flex items-center justify-center my-0.5">
                <svg viewBox="0 0 16 24" className="w-full h-full text-border">
                    <path d="M8 0 L8 24" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
                {isAnimating && (
                    <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-ink animate-data-packet-vertical" />
                )}
            </div>
        );
    }
    return (
        <div className="relative w-8 h-4 flex items-center justify-center mx-1">
            <svg viewBox="0 0 32 16" className="w-full h-full text-border">
                <path d="M0 8 L32 8" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            {isAnimating && (
                <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-ink animate-data-packet" />
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: 'live' | 'testing' }) {
    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-full border",
            "font-mono text-[10px] uppercase tracking-wider",
            status === 'live'
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-amber-50 border-amber-200 text-amber-700"
        )}>
            <span className={cn(
                "relative w-1.5 h-1.5 rounded-full",
                status === 'live' ? "bg-green-500" : "bg-amber-500"
            )}>
                {status === 'live' && (
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse-ring opacity-50" />
                )}
            </span>
            {status}
        </div>
    );
}

function FlowCard({ flow, index }: { flow: IntegratedFlow; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "relative bg-white border border-border p-6",
                "transition-all duration-300 cursor-default group",
                "hover:shadow-md hover:border-ink/20",
                "flex flex-col h-full"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-ink font-mono text-sm font-semibold tracking-wide uppercase">
                    {flow.title}
                </h4>
                <StatusBadge status={flow.status} />
            </div>

            {/* Flow Visualization */}
            <div className="flex-grow flex items-center justify-center mb-6">
                {/* Desktop/Tablet Horizontal Layout */}
                <div className="hidden sm:flex items-center flex-wrap justify-center gap-y-2">
                    {flow.agents.map((agent, idx) => (
                        <div key={agent.name} className="flex items-center">
                            <div className={cn(
                                "px-3 py-1.5 bg-paper-warm border border-border rounded-sm",
                                "font-mono text-xs font-medium tracking-wider",
                                "transition-all duration-200",
                                isHovered && "bg-white border-ink/30 shadow-sm"
                            )}>
                                <span className={agent.color}>{agent.name}</span>
                            </div>
                            {idx < flow.agents.length - 1 && (
                                <FlowConnector isAnimating={isHovered} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Vertical Layout */}
                <div className="flex sm:hidden flex-col items-center">
                    {flow.agents.map((agent, idx) => (
                        <div key={agent.name} className="flex flex-col items-center">
                            <div className={cn(
                                "px-3 py-1.5 bg-paper-warm border border-border rounded-sm relative z-10",
                                "font-mono text-xs font-medium tracking-wider w-full text-center",
                                "transition-all duration-200",
                                isHovered && "bg-white border-ink/30 shadow-sm"
                            )}>
                                <span className={agent.color}>{agent.name}</span>
                            </div>
                            {idx < flow.agents.length - 1 && (
                                <FlowConnector isAnimating={isHovered} vertical={true} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            <p className="text-ink-muted text-xs leading-relaxed mb-4 font-normal border-t border-border pt-4">
                {flow.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
                {flow.metrics && flow.metrics.map((metric) => (
                    <div key={metric.label}>
                        <div className="text-ink font-mono text-sm font-semibold">
                            {metric.value}
                        </div>
                        <div className="text-ink-muted text-[10px] uppercase tracking-wider font-medium">
                            {metric.label}
                        </div>
                    </div>
                ))}
            </div>
        </m.div>
    );
}

// ============================================================================
// Interactive SVG Data Circuit (Replaces old Flow Cards)
// ============================================================================

function InteractiveDataCircuit() {
    const prefersReducedMotion = useReducedMotion();

    const pathDefinition = "M 100 200 C 300 200, 400 50, 500 200 C 600 350, 700 200, 900 200";
    const path2 = "M 100 200 C 200 300, 400 350, 500 200 C 600 50, 800 100, 900 200";

    return (
        <div className="mt-32">
            <FadeIn>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <p className="text-xs text-ink-muted uppercase tracking-widest font-mono">Agentic Data Circuits</p>
                </div>
                <h3 className="text-2xl font-semibold text-ink mb-2">Cross-Agent Memory & Execution</h3>
                <p className="text-ink-light mb-12 max-w-2xl">
                    Our sub-agents don't work in silos. We build interconnected data circuits where the output of AI Engineering is automatically QA'd by Quality Monitoring, and Growth artifacts are directly piped into Sales sequences—all monitored natively in the UI.
                </p>
            </FadeIn>

            <FadeIn delay={0.2}>
                <div className="relative w-full h-[400px] bg-white border border-border/80 shadow-sm rounded-3xl overflow-hidden group">
                    {/* Background grid */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)', backgroundSize: '32px 32px', opacity: 0.5 }} />

                    {/* SVG Canvas */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="circuit-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                            </linearGradient>
                            <linearGradient id="circuit-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Animated Paths */}
                        <m.path
                            d={pathDefinition}
                            stroke="url(#circuit-grad-1)"
                            strokeWidth="3"
                            fill="none"
                            initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                        />
                        <m.path
                            d={path2}
                            stroke="url(#circuit-grad-2)"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            fill="none"
                            initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
                        />

                        {/* Data Packets */}
                        {!prefersReducedMotion && (
                            <>
                                <g filter="url(#glow)">
                                    <circle r="4" fill="#8b5cf6">
                                        <animateMotion dur="4s" repeatCount="indefinite" path={pathDefinition} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                                    </circle>
                                    <circle r="3" fill="#10b981">
                                        <animateMotion dur="4s" repeatCount="indefinite" begin="2s" path={pathDefinition} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                                    </circle>
                                    <circle r="4" fill="#ec4899">
                                        <animateMotion dur="5s" repeatCount="indefinite" begin="1s" path={path2} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                                    </circle>
                                </g>
                            </>
                        )}
                    </svg>

                    {/* HTML Overlay Nodes */}
                    <div className="absolute top-[30%] sm:top-[42%] left-[5%] sm:left-[8%]">
                        <div className="px-4 py-2 bg-paper/90 backdrop-blur border border-border shadow-sm rounded-lg text-xs font-mono font-semibold text-blue-700">
                            Build (AI-ENG)
                        </div>
                    </div>

                    <div className="absolute top-[8%] sm:top-[5%] left-[35%] sm:left-[38%]">
                        <div className="px-4 py-2 bg-paper/90 backdrop-blur border border-border shadow-sm rounded-lg text-xs font-mono font-semibold text-emerald-700">
                            Eval (QUALITY)
                        </div>
                    </div>

                    <div className="absolute top-[65%] sm:top-[75%] left-[35%] sm:left-[38%]">
                        <div className="px-4 py-2 bg-paper/90 backdrop-blur border border-border shadow-sm rounded-lg text-xs font-mono font-semibold text-amber-700">
                            Traffic (GROWTH)
                        </div>
                    </div>

                    <div className="absolute top-[30%] sm:top-[42%] right-[5%] sm:right-[8%]">
                        <div className="px-4 py-2 bg-paper/90 backdrop-blur border border-border shadow-sm rounded-lg text-xs font-mono font-semibold text-cyan-700">
                            Convert (SALES)
                        </div>
                    </div>

                    {/* Central Router Node */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-paper flex items-center justify-center border-2 border-accent shadow-lg z-10 transition-transform duration-500 group-hover:scale-110">
                            <div className="w-8 h-8 rounded-full bg-accent/20 animate-pulse flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="absolute -bottom-8 text-[10px] font-mono font-bold tracking-widest text-ink uppercase text-center w-32">Chief of Staff Routing</span>
                    </div>

                </div>
            </FadeIn>
        </div>
    );
}

// ============================================================================
// Main Advantage Component
// ============================================================================

export function Advantage() {
    return (
        <Section id="edge" className="bg-paper-warm">
            <Container>
                {/* Header */}
                <div className="max-w-3xl mb-20">
                    <FadeIn>
                        <p className="text-sm text-ink-muted mb-4">How we work</p>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink mb-6">
                            Speed with guardrails.
                            <br />
                            <span className="text-ink-muted">Fixed price certainty.</span>
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.15}>
                        <p className="text-ink-light leading-relaxed">
                            We ship MVPs fast without shipping brittle AI. Evals, structured outputs, observability, and cost controls are part of the build—not a retrofit. The market is flooded with wrappers; reliability is the moat.
                        </p>
                    </FadeIn>
                </div>

                {/* A. Sprint Timeline — Horizontal Stepper */}
                <SprintTimeline />

                {/* B. Technical Patterns — Accordion */}
                <TechnicalPatterns />

                {/* C. Interactive SVG Circuit (Replaces IntegratedFlowsSection) */}
                <InteractiveDataCircuit />

            </Container>
        </Section>
    );
}
