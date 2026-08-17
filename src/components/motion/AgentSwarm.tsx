'use client';

const agents = [
    { id: "eng", name: "AI Engineering", role: "Architecture & build" },
    { id: "growth", name: "Growth & Content", role: "SEO & distribution" },
    { id: "quality", name: "Quality Monitoring", role: "Evals & guardrails" },
    { id: "systems", name: "Systems Architecture", role: "Infra & compliance" },
    { id: "security", name: "Security & Ops", role: "SOC 2 & deploy" },
] as const;

export function AgentSwarm() {
    return (
        <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center">
            <div className="relative flex w-full flex-col overflow-hidden rounded-[1.35rem] border border-ink/10 bg-[#0a0a0a]">
                <div className="flex h-10 items-center justify-between border-b border-white/5 bg-[#161616] px-4">
                    <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                        Delivery teams
                    </div>
                    <span className="w-8" />
                </div>

                <div className="flex flex-col gap-2 p-3">
                    {agents.map((agent) => (
                        <div
                            key={agent.id}
                            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="text-[11px] font-semibold tracking-wide text-white/70">
                                    {agent.name}
                                </div>
                                <div className="mt-0.5 truncate text-[10px] text-white/35">
                                    {agent.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
