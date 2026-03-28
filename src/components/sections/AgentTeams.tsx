'use client';

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/Motion";

const specializedTeams = [
    {
        name: "AI Engineering",
        accent: "#7fb0ff",
    },
    {
        name: "Growth & Content",
        accent: "#f4c56b",
    },
    {
        name: "Quality Monitoring",
        accent: "#5cd3a7",
    },
    {
        name: "Systems Architecture",
        accent: "#a6a7ff",
    },
];

const governanceTokens = [
    "Shared context",
    "Permissioned teams",
    "Compliant data plane",
];

const dataPlaneTokens = [
    "Access control",
    "Audit trail",
    "Unified memory",
];

const orchestrationCapabilities = [
    {
        name: "Task routing",
        description: "Right team, right boundary.",
    },
    {
        name: "Shared context",
        description: "Memory and handoff intact.",
    },
    {
        name: "Policy enforcement",
        description: "Governance by default.",
    },
];

function ArchitectureDiagram() {
    return (
        <FadeIn className="relative isolate h-full w-full">
            <div
                aria-label="Architecture diagram"
                className="relative w-full overflow-hidden rounded-[2.6rem] border border-paper/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_34px_90px_rgba(0,0,0,0.4)]"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_42%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.13]" />

                <div className="relative flex items-center justify-between px-7 pb-5 pt-7 text-[10px] font-mono uppercase tracking-[0.28em] text-paper/46 md:px-8">
                    <span>Architecture diagram</span>
                    <span>Governed multi-agent runtime</span>
                </div>

                <div className="relative px-5 pb-5 md:px-8 md:pb-8">
                    <svg viewBox="0 0 740 520" className="w-full" fill="none" role="presentation">
                        <g data-testid="diagram-top-layer">
                            <rect x="22" y="20" width="420" height="260" rx="28" fill="rgba(14,11,10,0.36)" stroke="rgba(255,255,255,0.12)" />
                            <text x="50" y="48" fill="rgba(165,180,252,0.95)" fontSize="11" letterSpacing="3.2" fontFamily="ui-monospace, SFMono-Regular, monospace">LAYER 01</text>
                            <text x="50" y="82" fill="rgba(255,255,255,0.94)" fontSize="20" fontWeight="700">Specialized Teams</text>
                            <rect x="182" y="45" width="142" height="36" rx="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />
                            <text x="212" y="67" fill="rgba(255,255,255,0.56)" fontSize="10" letterSpacing="2.8" fontFamily="ui-monospace, SFMono-Regular, monospace">DOMAIN EXECUTION</text>

                            {specializedTeams.map((team, index) => {
                                const positions = [
                                    { x: 44, y: 102 },
                                    { x: 238, y: 102 },
                                    { x: 44, y: 192 },
                                    { x: 238, y: 192 },
                                ];
                                const pos = positions[index];
                                return (
                                    <g key={team.name}>
                                        <rect x={pos.x} y={pos.y} width="172" height="72" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
                                        <rect x={pos.x + 16} y={pos.y + 16} width="28" height="28" rx="8" fill={`${team.accent}20`} stroke={team.accent} />
                                        <text x={pos.x + 58} y={pos.y + 34} fill="rgba(255,255,255,0.92)" fontSize="14" fontWeight="600">{team.name}</text>
                                        <text x={pos.x + 58} y={pos.y + 54} fill="rgba(255,255,255,0.48)" fontSize="10" letterSpacing="1.8" fontFamily="ui-monospace, SFMono-Regular, monospace">Dedicated lane</text>
                                    </g>
                                );
                            })}

                            <rect x="466" y="20" width="252" height="260" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
                            <text x="486" y="48" fill="rgba(255,255,255,0.54)" fontSize="11" letterSpacing="3.2" fontFamily="ui-monospace, SFMono-Regular, monospace">SYSTEM GUARANTEE</text>
                            <text x="486" y="80" fill="rgba(255,255,255,0.94)" fontSize="17" fontWeight="700">Governed coordination</text>
                            <text x="486" y="106" fill="rgba(255,255,255,0.62)" fontSize="11.5">Routing, context, and policy stay</text>
                            <text x="486" y="122" fill="rgba(255,255,255,0.62)" fontSize="11.5">centralized.</text>
                            {governanceTokens.map((token, index) => (
                                <g key={token}>
                                    <rect x="486" y={148 + index * 34} width="210" height="26" rx="13" fill="rgba(14,11,10,0.36)" stroke="rgba(255,255,255,0.1)" />
                                    <text x="506" y={165 + index * 34} fill="rgba(255,255,255,0.66)" fontSize="10" letterSpacing="2.2" fontFamily="ui-monospace, SFMono-Regular, monospace">{token.toUpperCase()}</text>
                                </g>
                            ))}
                        </g>

                        <path d="M340 280 L340 310" stroke="rgba(129,140,248,0.7)" strokeWidth="2" strokeDasharray="4 4" />

                        <g data-testid="diagram-middle-layer">
                            <rect x="110" y="312" width="460" height="102" rx="28" fill="rgba(62,63,149,0.14)" stroke="rgba(129,140,248,0.28)" />
                            <text x="138" y="340" fill="rgba(199,210,254,0.94)" fontSize="11" letterSpacing="3.2" fontFamily="ui-monospace, SFMono-Regular, monospace">LAYER 02</text>
                            <text x="138" y="372" fill="rgba(255,255,255,0.96)" fontSize="26" fontWeight="700">Orchestrator Factory</text>
                            <rect x="386" y="326" width="154" height="28" rx="14" fill="rgba(129,140,248,0.12)" stroke="rgba(129,140,248,0.24)" />
                            <text x="406" y="344" fill="rgba(199,210,254,0.84)" fontSize="10" letterSpacing="2.2" fontFamily="ui-monospace, SFMono-Regular, monospace">CENTRAL CONTROL PLANE</text>
                            {orchestrationCapabilities.map((capability, index) => (
                                <g key={capability.name}>
                                    <rect x={138 + index * 142} y="380" width="128" height="24" rx="12" fill="rgba(14,11,10,0.36)" stroke="rgba(255,255,255,0.1)" />
                                    <text x={154 + index * 142} y="396" fill="rgba(255,255,255,0.84)" fontSize="11">{capability.name}</text>
                                </g>
                            ))}
                        </g>

                        <path d="M340 414 L340 440" stroke="rgba(129,140,248,0.68)" strokeWidth="2" strokeDasharray="4 4" />

                        <g data-testid="diagram-bottom-layer">
                            <rect x="62" y="444" width="656" height="60" rx="24" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
                            <text x="88" y="466" fill="rgba(255,255,255,0.54)" fontSize="11" letterSpacing="3.2" fontFamily="ui-monospace, SFMono-Regular, monospace">LAYER 03</text>
                            <text x="88" y="490" fill="rgba(255,255,255,0.96)" fontSize="20" fontWeight="700">Universal Data Plane</text>
                            {dataPlaneTokens.map((token, index) => (
                                <g key={token}>
                                    <rect x={380 + index * 100} y="461" width="92" height="26" rx="13" fill="rgba(14,11,10,0.36)" stroke="rgba(255,255,255,0.1)" />
                                    <text x={426 + index * 100} y="478" textAnchor="middle" fill="rgba(255,255,255,0.66)" fontSize="9" letterSpacing="1.0" fontFamily="ui-monospace, SFMono-Regular, monospace">{token.toUpperCase()}</text>
                                </g>
                            ))}
                        </g>
                    </svg>
                </div>
            </div>
        </FadeIn>
    );
}

export function AgentTeams() {
    return (
        <Section
            id="agent-teams"
            className="relative scroll-mt-24 overflow-x-clip bg-[linear-gradient(180deg,#16110d_0%,#110d09_100%)] py-10 text-paper md:scroll-mt-28 md:py-12 lg:py-8"
        >
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute left-[-8rem] top-16 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_68%)] blur-3xl" />
            <div className="absolute right-[-10rem] top-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_68%)] blur-3xl" />

            <Container className="relative">
                <div
                    data-testid="agent-teams-layout"
                    className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:items-center lg:gap-10"
                >
                    <div className="order-2 lg:order-1">
                        <ArchitectureDiagram />
                    </div>

                    <div className="order-1 lg:order-2 lg:pr-4">
                        <FadeIn>
                            <p className="mb-4 text-sm font-mono uppercase tracking-[0.28em] text-indigo-300">
                                Structure & Governance
                            </p>
                            <h2 className="mb-5 max-w-[15.5ch] text-3xl font-semibold tracking-tight text-paper md:text-[3.6rem] md:leading-[0.92]">
                                Enterprise Foundation. <br />
                                <span className="text-paper/52">Unified Orchestration.</span>
                            </h2>
                            <p className="max-w-[34rem] text-base leading-relaxed text-paper/72 md:text-[1.05rem]">
                                We architect your AI infrastructure using a multi-layered approach. A central orchestrator directs specialized teams operating on top of a unified, compliant data plane.
                            </p>
                        </FadeIn>

                    </div>
                </div>
            </Container>
        </Section>
    );
}
