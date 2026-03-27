'use client';

import { m, useReducedMotion } from "framer-motion";
import { LineChart, BarChart3, Activity, PieChart, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardSimulation() {
    const prefersReducedMotion = useReducedMotion();
    const [co2Data, setCo2Data] = useState(42.5);

    useEffect(() => {
        if (prefersReducedMotion) return;
        const i = setInterval(() => {
            setCo2Data(prev => prev + (Math.random() * 0.4 - 0.2));
        }, 1500);
        return () => clearInterval(i);
    }, [prefersReducedMotion]);

    return (
        <div className="w-full h-full bg-[#f8fafc] text-slate-800 p-4 sm:p-6 font-sans overflow-hidden border border-slate-200/50 shadow-inner flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                        <Activity className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Scope3 ESG Platform</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                    </div>
                    <button className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-medium rounded-md">Export Report</button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Scope 1 Emissions", value: "1,240 tCO2e", trend: "-2.4%", icon: PieChart },
                    { label: "Scope 2 Emissions", value: "890 tCO2e", trend: "-5.1%", icon: BarChart3 },
                    { label: "Scope 3 (Supply Chain)", value: `${co2Data.toFixed(1)}k tCO2e`, trend: "+1.2%", icon: LineChart },
                ].map((stat, i) => (
                    <m.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <stat.icon className="w-4 h-4 text-slate-400" />
                            <span className={`text-[10px] font-medium ${stat.trend.startsWith('-') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mb-1">{stat.label}</div>
                        <div className="text-lg font-bold text-slate-800 tracking-tight">{stat.value}</div>
                    </m.div>
                ))}
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-700">Live Supplier Ingestion</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> API Sync Active
                    </div>
                </div>

                <div className="flex-1 border-b border-l border-slate-100 relative mt-2">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-slate-50 border-dashed" />)}
                    </div>

                    {/* Animated chart line */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                        <m.path
                            d="M 0 100 Q 50 80, 100 120 T 200 60 T 300 90 T 400 30 T 500 70"
                            stroke="#4f46e5"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="drop-shadow-sm"
                        />
                        <m.path
                            d="M 0 100 Q 50 80, 100 120 T 200 60 T 300 90 T 400 30 T 500 70 L 500 200 L 0 200 Z"
                            fill="url(#chartGrad)"
                            className="opacity-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            transition={{ delay: 1 }}
                        />
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4f46e5" />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Scanning cursor */}
                    {!prefersReducedMotion && (
                        <m.div
                            className="absolute top-0 bottom-0 w-[1px] bg-indigo-400 shadow-[0_0_8px_rgba(79,70,229,0.5)] z-10"
                            animate={{ x: ['0%', '100%', '0%'] }}
                            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                        />
                    )}
                </div>
                <div className="flex justify-between mt-2 text-[8px] text-slate-400 font-mono">
                    <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                </div>
            </div>
        </div>
    );
}
