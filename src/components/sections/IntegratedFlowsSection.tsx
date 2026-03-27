'use client';

import { useState, type ComponentType } from "react";
import { m } from "framer-motion";
import { easings } from "@/components/ui/Motion";
import { CountUp } from "@/components/motion/CountUp";
import { ProgressRing } from "@/components/motion/ProgressRing";
import { cn } from "@/lib/utils";
import { BarChart3, Compass, MessageSquare, Rocket, ShieldCheck } from "lucide-react";

interface FlowAgent {
    name: string;
    color: string;
}

export interface IntegratedFlow {
    id: string;
    title: string;
    agents: FlowAgent[];
    description: string;
    status: 'live' | 'testing';
    metrics?: { label: string; value: string }[];
}

export const integratedFlows: IntegratedFlow[] = [
    {
        id: "discovery-to-demo",
        title: "Discovery to Demo",
        agents: [
            { name: "PULSE", color: "text-cyan-800" },
            { name: "VECTOR", color: "text-blue-700" },
            { name: "SPECTRE", color: "text-red-700" },
        ],
        description: "Customer conversations automatically inform product demos and prototypes.",
        status: "live",
        metrics: [
            { label: "Time Saved", value: "80%" },
            { label: "Accuracy", value: "94%" },
        ],
    },
    {
        id: "content-insights",
        title: "Content Intelligence",
        agents: [
            { name: "SNIPER", color: "text-amber-800" },
            { name: "PULSE", color: "text-cyan-800" },
        ],
        description: "Content performance automatically informs product roadmap and positioning.",
        status: "live",
        metrics: [
            { label: "Signals", value: "12+" },
            { label: "Segments", value: "5" },
        ],
    },
    {
        id: "continuous-qa",
        title: "Continuous Quality",
        agents: [
            { name: "VECTOR", color: "text-blue-700" },
            { name: "SPECTRE", color: "text-red-700" },
        ],
        description: "Every deployment is automatically tested and validated before going live.",
        status: "live",
        metrics: [
            { label: "Test Coverage", value: "95%" },
            { label: "Issues Caught", value: "127+" },
        ],
    },
];

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

function parseMetricValue(value: string): { kind: 'percent' | 'count'; num: number; suffix: string } {
    const trimmed = value.trim();
    if (trimmed.endsWith('%')) {
        const num = Number.parseFloat(trimmed.replace('%', ''));
        return { kind: 'percent', num: Number.isFinite(num) ? num : 0, suffix: '%' };
    }
    if (trimmed.endsWith('+')) {
        const num = Number.parseFloat(trimmed.replace('+', ''));
        return { kind: 'count', num: Number.isFinite(num) ? num : 0, suffix: '+' };
    }
    const num = Number.parseFloat(trimmed);
    return { kind: 'count', num: Number.isFinite(num) ? num : 0, suffix: '' };
}

const flowIcons: Record<string, { start: ComponentType<{ className?: string }>; end: ComponentType<{ className?: string }> }> = {
    "discovery-to-demo": { start: MessageSquare, end: Rocket },
    "content-insights": { start: BarChart3, end: Compass },
    "continuous-qa": { start: Rocket, end: ShieldCheck },
};

function FlowCard({ flow, index }: { flow: IntegratedFlow; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const icons = flowIcons[flow.id];
    const StartIcon = icons?.start;
    const EndIcon = icons?.end;

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: easings.easeOutQuint }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                y: -4,
            }}
            className={cn(
                "relative bg-white border border-border p-6",
                "transition-colors duration-300 cursor-default group",
                "hover:border-ink/20",
                "flex flex-col h-full outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            )}
            tabIndex={0}
            aria-label={`${flow.title}. ${flow.description}`}
        >
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-ink font-mono text-sm font-semibold tracking-wide uppercase">
                    {flow.title}
                </h4>
                <StatusBadge status={flow.status} />
            </div>

            <div className="flex-grow flex items-center justify-center mb-6">
                <div className="hidden sm:flex items-center">
                    {StartIcon && (
                        <div className="flex items-center mr-2 text-ink-muted" aria-hidden="true">
                            <StartIcon className="w-4 h-4" />
                            <FlowConnector isAnimating={isHovered} />
                        </div>
                    )}
                    {flow.agents.map((agent, idx) => (
                        <div key={agent.name} className="flex items-center">
                            <m.div
                                className={cn(
                                    "px-3 py-1.5 bg-paper-warm border border-border rounded-sm",
                                    "font-mono text-xs font-medium tracking-wider",
                                    "transition-colors duration-200",
                                    isHovered && "bg-white border-ink/30 shadow-sm"
                                )}
                                animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className={agent.color}>{agent.name}</span>
                            </m.div>
                            {idx < flow.agents.length - 1 && (
                                <FlowConnector isAnimating={isHovered} />
                            )}
                        </div>
                    ))}
                    {EndIcon && (
                        <div className="flex items-center ml-2 text-ink-muted" aria-hidden="true">
                            <FlowConnector isAnimating={isHovered} />
                            <EndIcon className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="flex sm:hidden flex-col items-center">
                    {StartIcon && (
                        <div className="flex flex-col items-center text-ink-muted mb-2" aria-hidden="true">
                            <StartIcon className="w-4 h-4" />
                            <FlowConnector isAnimating={isHovered} vertical={true} />
                        </div>
                    )}
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
                    {EndIcon && (
                        <div className="flex flex-col items-center text-ink-muted mt-2" aria-hidden="true">
                            <FlowConnector isAnimating={isHovered} vertical={true} />
                            <EndIcon className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </div>

            <div
                role="tooltip"
                className={cn(
                    "pointer-events-none absolute left-4 right-4 top-20",
                    "rounded-lg border border-border bg-white px-3 py-2 shadow-lg",
                    "text-xs text-ink-muted leading-relaxed",
                    "opacity-0 translate-y-1 transition-all duration-200",
                    "group-hover:opacity-100 group-hover:translate-y-0",
                    "group-focus-within:opacity-100 group-focus-within:translate-y-0"
                )}
            >
                {flow.description}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {flow.metrics && flow.metrics.map((metric, idx) => (
                    <m.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                    >
                        {(() => {
                            const parsed = parseMetricValue(metric.value);
                            if (parsed.kind === 'percent') {
                                return (
                                    <ProgressRing
                                        value={parsed.num}
                                        label={metric.label}
                                        size={44}
                                        strokeWidth={6}
                                    />
                                );
                            }

                            return (
                                <div className="flex items-center gap-3">
                                    <div className="text-ink font-mono text-lg font-semibold leading-none">
                                        <CountUp
                                            end={parsed.num}
                                            suffix={parsed.suffix}
                                            duration={1.6}
                                            delay={0.15}
                                        />
                                    </div>
                                    <div className="text-ink-muted text-[10px] uppercase tracking-wider font-medium">
                                        {metric.label}
                                    </div>
                                </div>
                            );
                        })()}
                    </m.div>
                ))}
            </div>
        </m.div>
    );
}

export function IntegratedFlowsSection({ flows }: { flows: IntegratedFlow[] }) {
    return (
        <div className="bg-paper-warm/50 rounded-xl p-6 md:p-10 border border-border/50">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-3">
                        <span className="relative w-2 h-2 rounded-full bg-ink">
                            <span className="absolute inset-0 rounded-full bg-ink animate-ping opacity-20" />
                        </span>
                        <p className="text-ink font-mono text-xs uppercase tracking-widest font-semibold">
                            Delivery Stack
                        </p>
                    </div>
                    <p className="text-ink-light text-sm max-w-lg leading-relaxed">
                        Internal agents compress research → build → QA, while guardrails keep execution deterministic and budgeted.
                    </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono text-ink-muted border px-3 py-1.5 rounded-full bg-white border-border">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>OPERATIONAL</span>
                    </div>
                    <span className="text-border">|</span>
                    <span>Active Agents: 4</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {flows.map((flow, idx) => (
                    <FlowCard key={flow.id} flow={flow} index={idx} />
                ))}
            </div>
        </div>
    );
}
