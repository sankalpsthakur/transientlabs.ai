'use client';

import { useState, useEffect } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity, Cpu, Globe, Layers, Server, Zap } from "lucide-react";

// Mock data streams
const systemMetrics = [
    { label: "CPU Usage", value: "42%", trend: "+2.4%" },
    { label: "Memory", value: "8.4GB", trend: "0.1G" },
    { label: "Active Nodes", value: "112", trend: "+4" },
    { label: "Network I/O", value: "840MB/s", trend: "-12%" },
];

const connectionLogs = [
    { id: 1, time: "14:22:01.043", source: "10.4.12.99", dest: "api.anthropic.com", latency: "114ms", status: "200 OK" },
    { id: 2, time: "14:22:01.892", source: "10.4.12.42", dest: "db-main-read-replica", latency: "4ms", status: "200 OK" },
    { id: 3, time: "14:22:02.115", source: "worker-pool-a", dest: "sqs.us-east-1", latency: "22ms", status: "202 ACCEPTED" },
    { id: 4, time: "14:22:03.441", source: "10.4.12.99", dest: "api.stripe.com", latency: "189ms", status: "200 OK" },
    { id: 5, time: "14:22:04.005", source: "cron-runner", dest: "api.resend.com", latency: "88ms", status: "200 OK" },
];

const agentTasks = [
    { id: "tk_99x", agent: "AI-ENG", task: "Generate Prisma schema from AST", status: "running", progress: 68 },
    { id: "tk_42a", agent: "QUALITY", task: "Run regression suite (50 prompts)", status: "pending", progress: 0 },
    { id: "tk_88z", agent: "GROWTH", task: "Extract SEO keywords from transcript", status: "completed", progress: 100 },
];

// Helper to generate random hex strings

export function CommandCenter() {
    const prefersReducedMotion = useReducedMotion();
    const [logs, setLogs] = useState<{ id: number; time: string; source: string; dest: string; latency: string; status: string; }[]>(connectionLogs);
    const [tasks, setTasks] = useState(agentTasks);
    const [graphData, setGraphData] = useState(Array.from({ length: 40 }, () => 50));

    // Simulate live data streams
    useEffect(() => {
        if (prefersReducedMotion) return;

        // Update logs
        const logInterval = setInterval(() => {
            setLogs((prev: { id: number; time: string; source: string; dest: string; latency: string; status: string; }[]) => {
                const newLog = {
                    id: Date.now(),
                    time: new Date().toISOString().substr(11, 12),
                    source: `10.4.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    dest: ['api.github.com', 'db-shard-2', 'redis-cache', 'worker-b'][Math.floor(Math.random() * 4)],
                    latency: `${Math.floor(Math.random() * 200 + 5)}ms`,
                    status: Math.random() > 0.95 ? "503 WAIT" : "200 OK"
                };
                return [newLog, ...prev.slice(0, 4)];
            });
        }, 800);

        // Update tasks progress
        const taskInterval = setInterval(() => {
            setTasks(prev => prev.map(t => {
                if (t.status === 'completed') return t;
                if (t.status === 'pending' && Math.random() > 0.7) return { ...t, status: 'running', progress: 5 };

                const newProgress = Math.min(100, t.progress + Math.floor(Math.random() * 15));
                return {
                    ...t,
                    progress: newProgress,
                    status: newProgress === 100 ? 'completed' : 'running'
                };
            }));
        }, 1200);

        // Update mini-graph
        const graphInterval = setInterval(() => {
            setGraphData(prev => [...prev.slice(1), Math.random() * 100]);
        }, 100);

        return () => {
            clearInterval(logInterval);
            clearInterval(taskInterval);
            clearInterval(graphInterval);
        };
    }, [prefersReducedMotion]);

    return (
        <div className="w-full bg-[#050505] rounded-xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-white/80 filter drop-shadow-2xl">
            {/* Top Bar */}
            <div className="h-8 bg-[#111] border-b border-white/5 flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] text-white/40 tracking-wider">COMMAND_CENTER // V4.2</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] text-white/40">
                        <Zap className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px]">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-500 tracking-wider">SYSTEM OPTIMAL</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/5 p-px h-[600px] md:h-[450px]">

                {/* Left Column: Metrics & Graph */}
                <div className="col-span-1 md:col-span-3 bg-[#0a0a0a] flex flex-col gap-px">
                    <div className="bg-[#0f0f0f] p-4 flex-1">
                        <h3 className="text-[10px] text-white/50 mb-4 tracking-widest uppercase flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Core Telemetry
                        </h3>
                        <div className="space-y-4">
                            {systemMetrics.map(m => (
                                <div key={m.label} className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[9px] text-white/40 mb-1 tracking-wider uppercase">{m.label}</div>
                                        <div className="text-sm text-white/90">{m.value}</div>
                                    </div>
                                    <div className={cn("text-[9px]", m.trend.startsWith('+') ? "text-emerald-400" : "text-amber-400")}>
                                        {m.trend}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Graph */}
                    <div className="bg-[#0f0f0f] p-4 h-32 flex flex-col justify-end relative overflow-hidden">
                        <div className="absolute top-2 left-2 text-[9px] text-white/30 tracking-widest uppercase">Request Volume</div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
                        <div className="flex items-end h-full gap-[1px] opacity-60 z-10 w-full">
                            {graphData.map((val, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-accent/40 rounded-t-sm transition-all duration-75"
                                    style={{ height: `${val}%` }}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle Column: Active Agents / Workload */}
                <div className="col-span-1 md:col-span-5 bg-[#0a0a0a] flex flex-col">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="text-[10px] text-white/50 mb-4 tracking-widest uppercase flex items-center gap-2">
                            <Layers className="w-3 h-3" /> Agent Workload Matrix
                        </h3>

                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div key={task.id} className="bg-white/[0.02] border border-white/5 rounded p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase",
                                                task.agent === "AI-ENG" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                    task.agent === "QUALITY" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                        "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                            )}>{task.agent}</span>
                                            <span className="text-[10px] text-white/60">{task.id}</span>
                                        </div>
                                        <span className={cn(
                                            "text-[9px] uppercase tracking-wider",
                                            task.status === "completed" ? "text-emerald-500" :
                                                task.status === "running" ? "text-accent animate-pulse" : "text-white/30"
                                        )}>{task.status}</span>
                                    </div>
                                    <div className="text-xs text-white/80 mb-3 truncate">{task.task}</div>

                                    {/* Progress Bar */}
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <m.div
                                            className="h-full bg-accent"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${task.progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Agent Topology mapping */}
                    <div className="p-4 flex-1 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute top-2 left-2 text-[10px] text-white/50 tracking-widest uppercase flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Topology Hub
                        </div>

                        <div className="relative w-full h-full max-w-[200px] max-h-[200px] mt-4">
                            {/* Center Node */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded bg-ink border border-white/20 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                <Cpu className="w-5 h-5 text-white/80" />
                            </div>

                            {/* Orbiting nodes */}
                            <m.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-white/5 border-dashed"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-[8px] text-blue-400">ENG</div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-[8px] text-emerald-400">QA</div>
                                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded bg-amber-900/50 border border-amber-500/30 flex items-center justify-center text-[8px] text-amber-400">MKT</div>
                                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center text-[8px] text-cyan-400">SLS</div>
                            </m.div>

                            {/* Center Pulse */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border border-accent/20 animate-pulse-ring pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Network Logs */}
                <div className="col-span-1 md:col-span-4 bg-[#0a0a0a] p-4 flex flex-col">
                    <h3 className="text-[10px] text-white/50 mb-4 tracking-widest uppercase flex items-center gap-2">
                        <Server className="w-3 h-3" /> Network Trace
                    </h3>

                    <div className="flex-1 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10" />
                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />

                        <div className="flex flex-col gap-2 relative z-0">
                            <AnimatePresence>
                                {logs.map((log) => (
                                    <m.div
                                        key={log.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="text-[9px] sm:text-[10px] leading-tight flex flex-col gap-0.5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/30">{log.time}</span>
                                            <span className="text-accent">{log.source}</span>
                                            <span className="text-white/30">→</span>
                                            <span className="text-white/70 truncate flex-1">{log.dest}</span>
                                        </div>
                                        <div className="flex items-center gap-3 pl-[72px]">
                                            <span className={cn(
                                                log.status.includes('200') ? "text-emerald-500" :
                                                    log.status.includes('503') ? "text-red-400" : "text-amber-400"
                                            )}>{log.status}</span>
                                            <span className="text-white/40">{log.latency}</span>
                                        </div>
                                    </m.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Fake Terminal Prompt */}
                    <div className="mt-4 pt-4 border-t border-white/5 text-[10px] flex items-center gap-2 text-white/50">
                        <span className="text-accent">root@sys-core:~#</span>
                        <span className="w-1.5 h-3 bg-white/50 animate-pulse" />
                    </div>
                </div>

            </div>
        </div>
    );
}
