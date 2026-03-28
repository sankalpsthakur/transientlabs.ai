'use client';

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Agent {
    id: string;
    name: string;
    role: string;
    color: string;
    colorMuted: string;
    icon: string;
}

interface TaskEvent {
    agentId: string;
    task: string;
    status: "routing" | "active" | "done";
}

const agents: Agent[] = [
    { id: "eng", name: "AI Engineering", role: "Architecture & Build", color: "text-blue-400", colorMuted: "bg-blue-500/15 border-blue-500/25", icon: "⚡" },
    { id: "growth", name: "Growth & Content", role: "SEO & Distribution", color: "text-amber-400", colorMuted: "bg-amber-500/15 border-amber-500/25", icon: "◈" },
    { id: "quality", name: "Quality Monitoring", role: "Evals & Guardrails", color: "text-emerald-400", colorMuted: "bg-emerald-500/15 border-emerald-500/25", icon: "◉" },
    { id: "systems", name: "Systems Architecture", role: "Infra & Compliance", color: "text-violet-400", colorMuted: "bg-violet-500/15 border-violet-500/25", icon: "⬡" },
    { id: "security", name: "Security & Ops", role: "SOC2 & Deploy", color: "text-rose-400", colorMuted: "bg-rose-500/15 border-rose-500/25", icon: "⬢" },
];

const taskSequences: TaskEvent[][] = [
    // Wave 1: Project kickoff
    [
        { agentId: "eng", task: "Scaffolding Next.js + Supabase stack", status: "active" },
        { agentId: "systems", task: "Provisioning edge infra (Oregon)", status: "active" },
    ],
    // Wave 2: Build begins
    [
        { agentId: "eng", task: "Scaffolding Next.js + Supabase stack", status: "done" },
        { agentId: "growth", task: "Generating SEO content matrix", status: "active" },
        { agentId: "quality", task: "Writing eval suite (50 prompts)", status: "active" },
    ],
    // Wave 3: Infra done, security starts
    [
        { agentId: "systems", task: "Provisioning edge infra (Oregon)", status: "done" },
        { agentId: "security", task: "Running OWASP scan on endpoints", status: "active" },
        { agentId: "eng", task: "Building RAG pipeline + embeddings", status: "active" },
    ],
    // Wave 4: Quality finds issue
    [
        { agentId: "quality", task: "Latency regression detected (>500ms)", status: "active" },
        { agentId: "growth", task: "Generating SEO content matrix", status: "done" },
        { agentId: "growth", task: "Publishing 12 programmatic pages", status: "active" },
    ],
    // Wave 5: Fix + resolve
    [
        { agentId: "eng", task: "Deploying Redis cache layer", status: "active" },
        { agentId: "quality", task: "Latency resolved → 120ms p95", status: "done" },
        { agentId: "security", task: "SOC2 evidence collection complete", status: "done" },
    ],
    // Wave 6: Ship
    [
        { agentId: "eng", task: "Building RAG pipeline + embeddings", status: "done" },
        { agentId: "growth", task: "Publishing 12 programmatic pages", status: "done" },
        { agentId: "systems", task: "Zero-downtime deploy to production", status: "active" },
        { agentId: "security", task: "Final pentest — all clear", status: "active" },
    ],
    // Wave 7: All done
    [
        { agentId: "systems", task: "Zero-downtime deploy to production", status: "done" },
        { agentId: "security", task: "Final pentest — all clear", status: "done" },
        { agentId: "eng", task: "Monitoring: all systems nominal", status: "done" },
    ],
];

function AgentRow({ agent, task, status }: { agent: Agent; task: string | null; status: "idle" | "routing" | "active" | "done" }) {
    return (
        <div className={cn(
            "group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500",
            status === "active" ? agent.colorMuted : "bg-white/[0.03] border-white/[0.06]",
            status === "done" && "bg-emerald-500/[0.06] border-emerald-500/[0.12]",
        )}>
            {/* Agent icon */}
            <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all duration-500",
                status === "active" ? `${agent.colorMuted} ${agent.color}` : "bg-white/[0.06] text-white/40",
                status === "done" && "bg-emerald-500/10 text-emerald-400",
            )}>
                {agent.icon}
            </div>

            {/* Agent info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                        "text-[11px] font-semibold tracking-wide transition-colors duration-300",
                        status === "active" ? agent.color : "text-white/60",
                        status === "done" && "text-emerald-400/80",
                    )}>
                        {agent.name}
                    </span>
                    {/* Status indicator */}
                    <div className="flex items-center gap-1.5">
                        {status === "active" && (
                            <m.div
                                className={cn("h-1.5 w-1.5 rounded-full", agent.color.replace("text-", "bg-"))}
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                            />
                        )}
                        {status === "done" && (
                            <m.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-[10px] text-emerald-400"
                            >
                                ✓
                            </m.span>
                        )}
                    </div>
                </div>
                <div className="mt-0.5 truncate text-[10px] text-white/35 transition-colors duration-300">
                    {task ? (
                        <m.span
                            key={task}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                status === "active" && "text-white/55",
                                status === "done" && "text-emerald-400/50",
                            )}
                        >
                            {task}
                        </m.span>
                    ) : (
                        <span className="text-white/20">{agent.role}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export function AgentSwarm() {
    const [waveIndex, setWaveIndex] = useState(-1);
    const [agentStates, setAgentStates] = useState<Record<string, { task: string | null; status: "idle" | "routing" | "active" | "done" }>>(
        Object.fromEntries(agents.map(a => [a.id, { task: null, status: "idle" as const }]))
    );
    const [completedCount, setCompletedCount] = useState(0);
    const prefersReducedMotion = useReducedMotion();

    const processWave = useCallback((index: number) => {
        if (index >= taskSequences.length) return;
        const wave = taskSequences[index];

        setAgentStates(prev => {
            const next = { ...prev };
            let doneCount = 0;
            for (const event of wave) {
                next[event.agentId] = { task: event.task, status: event.status };
            }
            for (const state of Object.values(next)) {
                if (state.status === "done") doneCount++;
            }
            setCompletedCount(doneCount);
            return next;
        });
    }, []);

    useEffect(() => {
        if (prefersReducedMotion) {
            // Show final state
            const finalStates: Record<string, { task: string | null; status: "idle" | "routing" | "active" | "done" }> = {};
            for (const agent of agents) {
                finalStates[agent.id] = { task: "All systems nominal", status: "done" };
            }
            setAgentStates(finalStates);
            setCompletedCount(5);
            return;
        }

        // Start animation sequence
        const startDelay = setTimeout(() => {
            setWaveIndex(0);
        }, 600);

        return () => clearTimeout(startDelay);
    }, [prefersReducedMotion]);

    useEffect(() => {
        if (waveIndex < 0 || prefersReducedMotion) return;

        processWave(waveIndex);

        if (waveIndex < taskSequences.length - 1) {
            const timer = setTimeout(() => {
                setWaveIndex(prev => prev + 1);
            }, 2200);
            return () => clearTimeout(timer);
        } else {
            // Reset after showing final state
            const resetTimer = setTimeout(() => {
                setAgentStates(Object.fromEntries(agents.map(a => [a.id, { task: null, status: "idle" as const }])));
                setCompletedCount(0);
                setWaveIndex(-1);
                // Restart
                setTimeout(() => setWaveIndex(0), 1200);
            }, 6000);
            return () => clearTimeout(resetTimer);
        }
    }, [waveIndex, processWave, prefersReducedMotion]);

    const activeCount = Object.values(agentStates).filter(s => s.status === "active").length;
    const totalTasks = completedCount + activeCount;

    return (
        <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center drop-shadow-2xl">
            <div className="absolute inset-x-8 inset-y-10 -z-10 rounded-full bg-gradient-to-tr from-accent/18 to-emerald-500/8 blur-[90px]" />

            <div className="relative flex w-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                    </div>
                    <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                        Agent Swarm // 5 Teams
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Live</span>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2">
                    <div className="flex items-center gap-4">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                            Active <span className={cn("ml-1 font-semibold", activeCount > 0 ? "text-blue-400" : "text-white/20")}>{activeCount}</span>
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                            Done <span className={cn("ml-1 font-semibold", completedCount > 0 ? "text-emerald-400" : "text-white/20")}>{completedCount}</span>
                        </div>
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                        Tasks <span className="ml-1 font-semibold text-white/50">{totalTasks}</span>
                    </div>
                </div>

                {/* Agent Grid */}
                <div className="flex flex-col gap-2 p-3">
                    <AnimatePresence mode="sync">
                        {agents.map((agent) => {
                            const state = agentStates[agent.id];
                            return (
                                <m.div
                                    key={agent.id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <AgentRow
                                        agent={agent}
                                        task={state?.task ?? null}
                                        status={state?.status ?? "idle"}
                                    />
                                </m.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Orchestrator status line */}
                <div className="border-t border-white/5 bg-white/[0.02] px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-accent" />
                        <span className="text-[10px] font-mono text-white/40 tracking-wide">
                            Orchestrator routing tasks across {agents.length} teams
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                            <m.div
                                className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-500"
                                animate={{ width: `${(completedCount / agents.length) * 100}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Noise overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>
        </div>
    );
}
