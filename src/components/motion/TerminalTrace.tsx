'use client';

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { FileCode, Activity, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogLine {
    id: string;
    type: "info" | "success" | "warn" | "system" | "code";
    timestamp: string;
    content: React.ReactNode;
}

const traceSequence = [
    { delay: 400, type: "system", text: "Initializing Chief of Staff Engine v4.2.0..." },
    { delay: 800, type: "system", text: "Mounting persistent memory buffers [mem0]..." },
    { delay: 1200, type: "success", text: "Memory stores linked. Context window: 128k tokens." },
    { delay: 1800, type: "info", text: "Incoming request: Build & Ship MVP (Scope: RAG + Copilot)" },
    { delay: 2400, type: "info", text: "Routing to department: AI_ENGINEERING" },
    { delay: 3200, type: "code", text: ">> AI_ENG: Generating Next.js + Supabase architecture..." },
    { delay: 3500, type: "info", text: "Deploying Vercel edge functions. Provisioning Postgres DB." },
    { delay: 4100, type: "success", text: "Infrastructure provisioned (0.8s)" },
    { delay: 4800, type: "info", text: "Routing to department: QUALITY_MONITORING" },
    { delay: 5500, type: "code", text: ">> QUALITY: Running regression suite on 50 golden prompts..." },
    { delay: 6200, type: "warn", text: "Latency budget exceeded on ToolCall: fetch_user_data (>500ms)" },
    { delay: 6900, type: "code", text: ">> AI_ENG: Implementing Redis cache layer..." },
    { delay: 7400, type: "success", text: "Cache hit ratio: 94%. Latency resolved (120ms)" },
    { delay: 8100, type: "info", text: "Validating structured outputs against JSON schema..." },
    { delay: 8800, type: "success", text: "All systems green. Deployment ready." },
    { delay: 10000, type: "system", text: "Awaiting approval to push to production..." }
];

const getIconForType = (type: string) => {
    switch (type) {
        case "system": return <Cpu className="w-3 h-3 text-accent" />;
        case "success": return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
        case "warn": return <ShieldAlert className="w-3 h-3 text-amber-500" />;
        case "code": return <FileCode className="w-3 h-3 text-blue-400" />;
        case "info":
        default: return <Activity className="w-3 h-3 text-ink-muted" />;
    }
};

const getColorForType = (type: string) => {
    switch (type) {
        case "system": return "text-accent";
        case "success": return "text-emerald-400";
        case "warn": return "text-amber-400";
        case "code": return "text-blue-300";
        case "info":
        default: return "text-ink-muted";
    }
};

export function TerminalTrace() {
    const [lines, setLines] = useState<LogLine[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Auto-scroll to bottom when new lines are added
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [lines]);

    useEffect(() => {
        if (prefersReducedMotion) {
            // If reduced motion, just show the final state or a subset immediately
            const allLines = traceSequence.map((step, idx) => ({
                id: `line-${idx}`,
                type: step.type as LogLine["type"],
                timestamp: new Date(Date.now() - (traceSequence.length - idx) * 1000).toISOString().substr(11, 8),
                content: step.text
            }));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLines(allLines.slice(-8)); // Show last 8 lines
            return;
        }

        if (currentIndex < traceSequence.length) {
            const step = traceSequence[currentIndex];
            const timer = setTimeout(() => {
                const now = new Date();
                const timestamp = now.toISOString().substr(11, 8) + "." + now.getMilliseconds().toString().padStart(3, '0');

                setLines(prev => [...prev, {
                    id: `line-${currentIndex}-${Date.now()}`,
                    type: step.type as LogLine["type"],
                    timestamp,
                    content: step.text
                }]);

                setCurrentIndex(prev => prev + 1);
            }, currentIndex === 0 ? step.delay : step.delay - traceSequence[currentIndex - 1].delay);

            return () => clearTimeout(timer);
        } else {
            // Loop the sequence after a long pause
            const resetTimer = setTimeout(() => {
                setLines([]);
                setCurrentIndex(0);
            }, 8000);
            return () => clearTimeout(resetTimer);
        }
    }, [currentIndex, prefersReducedMotion]);

    return (
        <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center drop-shadow-2xl">
            {/* Ambient Backlight */}
            <div className="absolute inset-x-8 inset-y-10 -z-10 rounded-full bg-gradient-to-tr from-accent/18 to-emerald-500/8 blur-[90px]" />

            <div className="relative flex h-[430px] w-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)] xl:h-[450px]">

                {/* Terminal Header */}
                <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-ink-muted uppercase">
                        Execution Trace // Platform_v4
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Live</span>
                    </div>
                </div>

                {/* Terminal Body */}
                <div
                    ref={containerRef}
                    className="scrollbar-hide flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed sm:p-5 sm:text-sm"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <AnimatePresence initial={false}>
                        {lines.map((line) => (
                            <m.div
                                key={line.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "flex items-start gap-3 mb-2.5 group",
                                    getColorForType(line.type)
                                )}
                            >
                                <div className="flex shrink-0 w-[85px] text-[10px] sm:text-xs text-white/30 tracking-tight pt-0.5 select-none">
                                    [{line.timestamp}]
                                </div>
                                <div className="mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                    {getIconForType(line.type)}
                                </div>
                                <div className="flex-1 break-words opacity-90 group-hover:opacity-100 transition-opacity">
                                    {line.content}
                                </div>
                            </m.div>
                        ))}
                    </AnimatePresence>

                    {/* Blinking Cursor */}
                    {currentIndex < traceSequence.length && !prefersReducedMotion && (
                        <div className="flex items-start gap-3 mb-2">
                            <div className="shrink-0 w-[85px]" />
                            <div className="w-2 h-4 bg-accent animate-pulse" />
                        </div>
                    )}
                </div>

                {/* Glitch Overlay Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-4 animate-scanline" />
            </div>
        </div>
    );
}
