'use client';

import { m, useReducedMotion } from "framer-motion";
import { Play, Pause, SkipBack, Scissors, Copy, Layers, Video, Volume2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function TerminalEditorSimulation() {
    const prefersReducedMotion = useReducedMotion();
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (prefersReducedMotion || !isPlaying) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0;
                return prev + 0.5;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isPlaying, prefersReducedMotion]);

    return (
        <div className="w-full h-full bg-[#09090b] text-zinc-300 font-sans p-4 flex flex-col overflow-hidden border border-zinc-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
                        <Video className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium tracking-wide">ReelGen Studio</span>
                </div>

                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs rounded transition-colors flex items-center gap-1.5 border border-zinc-700">
                        <Sparkles className="w-3 h-3 text-purple-400" /> Auto-Cut
                    </button>
                    <button className="px-4 py-1 bg-white text-black hover:bg-zinc-200 text-xs font-medium rounded transition-colors">
                        Export
                    </button>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 bg-black rounded-lg border border-zinc-800 overflow-hidden relative mb-4 flex items-center justify-center group">
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono select-none">
                    00:00:{(progress / 10).toFixed(1).padStart(4, '0')}
                </div>

                {/* Simulated Video Content */}
                <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                    <m.div
                        className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/20"
                        animate={{ filter: `hue-rotate(${progress * 3.6}deg)` }}
                    />

                    {/* Abstract moving shapes representing video subject */}
                    <m.div
                        className="w-32 h-32 rounded-full bg-white/10 blur-xl"
                        animate={{
                            x: Math.sin(progress / 10) * 50,
                            y: Math.cos(progress / 15) * 30,
                            scale: 1 + Math.sin(progress / 5) * 0.2
                        }}
                    />

                    {/* AI Bounding Box overlay (simulating object tracking) */}
                    <m.div
                        className="absolute border border-green-500/50 rounded-sm"
                        style={{
                            width: 140, height: 180,
                        }}
                        animate={{
                            x: Math.sin(progress / 10) * 50,
                            y: Math.cos(progress / 15) * 30,
                            opacity: progress % 20 < 10 ? 1 : 0.4
                        }}
                    >
                        <div className="absolute top-[-16px] left-0 bg-green-500/80 text-black text-[8px] px-1 font-mono uppercase">
                            Subject: 99%
                        </div>
                        <div className="w-1.5 h-1.5 border-t border-l border-green-500 absolute top-0 left-0" />
                        <div className="w-1.5 h-1.5 border-t border-r border-green-500 absolute top-0 right-0" />
                        <div className="w-1.5 h-1.5 border-b border-l border-green-500 absolute bottom-0 left-0" />
                        <div className="w-1.5 h-1.5 border-b border-r border-green-500 absolute bottom-0 right-0" />
                    </m.div>

                    {/* Play Overlay when paused */}
                    {!isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center pl-1">
                                <Play className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/80 backdrop-blur py-1.5 px-3 rounded-full border border-zinc-700/50 flex items-center gap-3">
                    <button className="hover:text-white" onClick={() => setProgress(0)}><SkipBack className="w-3.5 h-3.5" /></button>
                    <button className="hover:text-white" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white fill-white" />}
                    </button>
                    <button className="hover:text-white"><Volume2 className="w-3.5 h-3.5" /></button>
                </div>
            </div>

            {/* Timeline */}
            <div className="h-24 bg-zinc-900 rounded-lg border border-zinc-800 p-2 flex flex-col text-[10px] font-mono">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-2 px-1 text-zinc-500">
                    <div className="flex gap-2">
                        <button className="hover:text-zinc-300"><Scissors className="w-3 h-3" /></button>
                        <button className="hover:text-zinc-300"><Copy className="w-3 h-3" /></button>
                        <button className="hover:text-zinc-300"><Layers className="w-3 h-3" /></button>
                    </div>
                </div>

                {/* Tracks */}
                <div className="flex-1 relative bg-zinc-950 rounded border border-zinc-800 overflow-hidden group">
                    {/* Playhead */}
                    <m.div
                        className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
                        style={{ left: `${progress}%` }}
                    >
                        <div className="w-2 h-2 bg-red-500 absolute -top-1 -left-1 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    </m.div>

                    {/* Track 1: Video */}
                    <div className="h-1/2 border-b border-zinc-800/50 relative flex">
                        <div className="w-12 bg-zinc-900 border-r border-zinc-800 shrink-0 flex items-center justify-center text-zinc-600">
                            V1
                        </div>
                        <div className="flex-1 relative py-1 px-1 flex gap-1 items-center">
                            <div className="h-full w-[40%] bg-blue-900/40 border border-blue-500/30 rounded-sm relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
                            </div>
                            <div className="h-full w-[25%] bg-purple-900/40 border border-purple-500/30 rounded-sm relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                    <Sparkles className="w-3 h-3 text-purple-400" />
                                </div>
                            </div>
                            <div className="h-full w-[35%] bg-blue-900/40 border border-blue-500/30 rounded-sm" />
                        </div>
                    </div>

                    {/* Track 2: Audio */}
                    <div className="h-1/2 relative flex">
                        <div className="w-12 bg-zinc-900 border-r border-zinc-800 shrink-0 flex items-center justify-center text-zinc-600">
                            A1
                        </div>
                        <div className="flex-1 relative py-1 px-1 flex gap-1 items-center">
                            <div className="h-full w-[65%] bg-emerald-900/20 border border-emerald-500/20 rounded-sm flex items-center px-1 overflow-hidden">
                                <svg className="w-full h-full opacity-30 text-emerald-400" preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0,5 Q5,1 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5" stroke="currentColor" fill="none" strokeWidth="0.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
