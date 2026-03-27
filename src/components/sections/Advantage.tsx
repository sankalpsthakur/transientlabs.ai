'use client';

import { m, useReducedMotion } from "framer-motion";
import { CommandCenter } from "@/components/motion/CommandCenter";
import { FadeIn } from "@/components/ui/Motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const technicalEdge = [
    {
        title: "Grounded retrieval",
        description: "Chunking, re-ranking, and citations keep answers tied to source material.",
        stats: "Citations first · Less drift",
        category: "knowledge",
    },
    {
        title: "Evals before launch",
        description: "Golden sets, regression checks, and red-team prompts keep quality measurable.",
        stats: "Regression suite · Safer iteration",
        category: "quality",
    },
    {
        title: "Structured outputs",
        description: "Schemas, tool contracts, and validation loops keep agent output predictable.",
        stats: "Schemas · Validation · Stable UI",
        category: "product",
    },
    {
        title: "Latency and cost budgets",
        description: "Routing, streaming, caching, and fallbacks keep spend and latency in check.",
        stats: "Routing · Caching · Budget caps",
        category: "budget",
    },
    {
        title: "Tracing built in",
        description: "Prompt and tool traces make debugging and iteration much faster.",
        stats: "Tracing · Feedback loops",
        category: "observability",
    },
    {
        title: "Deterministic workflows",
        description: "State, retries, and idempotent tools keep multi-step runs reliable.",
        stats: "Retries · Idempotency · Fewer loops",
        category: "reliability",
    },
];

const processProof = [
    {
        label: "Timeline",
        value: "3 weeks",
        detail: "from discovery to live MVP",
    },
    {
        label: "Commercials",
        value: "Fixed price",
        detail: "scope locked before build expands",
    },
    {
        label: "Guardrails",
        value: "Built in",
        detail: "retrieval, evals, tracing, budgets",
    },
];

const howWeWork = [
    {
        week: "Week 1",
        title: "Frame the product",
        summary: "We lock scope, user flow, and system shape before code starts branching.",
        deliverables: ["Roadmap", "UX flow", "Technical plan"],
    },
    {
        week: "Week 2",
        title: "Ship the core loop",
        summary: "The MVP turns real: product logic, schema, integrations, and the main user path.",
        deliverables: ["Core build", "Data model", "Integrations"],
    },
    {
        week: "Week 3",
        title: "Harden and launch",
        summary: "We run the checks, deploy production, and hand over something usable on day one.",
        deliverables: ["Regression pass", "Production deploy", "Live handoff"],
    },
];

const dashboardNotes = [
    {
        id: "01",
        title: "Trace every handoff",
        detail: "Prompts, tools, and memory changes stay visible when runs hop between agents.",
    },
    {
        id: "02",
        title: "See the system in motion",
        detail: "Queues, latency, and active jobs are readable while the product is running.",
    },
    {
        id: "03",
        title: "Recover without guesswork",
        detail: "Retries, fallbacks, and budgets are designed into the runtime instead of added later.",
    },
];

const dashboardMetrics = [
    {
        label: "Shared memory",
        value: "Cross-agent context stays attached",
    },
    {
        label: "Runtime trace",
        value: "Prompts, tools, and jobs in one view",
    },
    {
        label: "Control layer",
        value: "Latency and cost boundaries stay explicit",
    },
];

const categoryStyles: Record<string, string> = {
    knowledge: "border-blue-500/20 bg-blue-500/8 text-blue-700",
    quality: "border-emerald-500/20 bg-emerald-500/8 text-emerald-700",
    product: "border-indigo-500/20 bg-indigo-500/8 text-indigo-700",
    budget: "border-amber-500/20 bg-amber-500/8 text-amber-700",
    observability: "border-cyan-500/20 bg-cyan-500/8 text-cyan-700",
    reliability: "border-rose-500/20 bg-rose-500/8 text-rose-700",
};

function DeliveryProofBoard() {
    return (
        <FadeIn delay={0.2}>
            <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(247,240,231,0.94))] p-6 shadow-[0_24px_70px_-52px_rgba(24,24,24,0.48)] lg:p-7">
                <div className="pointer-events-none absolute -left-10 top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(34,34,34,0.12),transparent_68%)] blur-2xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 bg-[linear-gradient(135deg,rgba(34,34,34,0.08),transparent_62%)]" />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-5">
                    <div className="relative border-b border-border/75 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-ink-muted">
                            <span>Delivery proof</span>
                            <span className="hidden sm:inline">Before the first sprint slips</span>
                        </div>
                        <div className="mt-5 flex items-end gap-3">
                            <span className="font-mono text-[4.6rem] leading-none tracking-[-0.08em] text-ink lg:text-[5.2rem]">
                                03
                            </span>
                            <div className="pb-2">
                                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-ink-muted">
                                    Week sprint
                                </p>
                                <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
                                    Brief, build, and launch.
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-light">
                            The commercial frame, delivery pace, and operating guardrails are set before the build starts stretching.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        {processProof.map((item, idx) => (
                            <div
                                key={item.label}
                                className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-[1.35rem] border border-border/75 bg-white/65 px-4 py-3"
                            >
                                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                                    0{idx + 1}
                                </span>
                                <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-ink-muted">
                                    {item.label}
                                </p>
                                <span className="font-semibold tracking-tight text-ink">
                                    {item.value}
                                </span>
                                <p className="text-sm leading-relaxed text-ink-light">
                                    {item.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 grid gap-2 border-t border-border/75 pt-4 sm:grid-cols-3">
                    {howWeWork.map((phase) => (
                        <div key={phase.week} className="rounded-[1.15rem] bg-paper-warm/70 px-3 py-3">
                            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-ink-muted">
                                {phase.week}
                            </p>
                            <p className="mt-2 text-sm font-medium leading-snug text-ink">
                                {phase.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </FadeIn>
    );
}

function SprintTimeline() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="mb-16 lg:mb-18">
            <FadeIn>
                <div className="mb-8 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-[0.28em] text-ink-muted">
                            Sprint rhythm
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                            The build reads left to right.
                        </h3>
                    </div>
                    <p className="max-w-xl text-sm leading-relaxed text-ink-light">
                        Fewer meetings, fewer mystery phases. Each week has a visible job and a visible outcome.
                    </p>
                </div>
            </FadeIn>

            <div className="hidden lg:block">
                <div className="relative">
                    <div className="absolute left-5 right-5 top-5 h-px bg-border/80" />

                    <div className="grid grid-cols-3 gap-10">
                        {howWeWork.map((phase, idx) => (
                            <m.article
                                key={phase.week}
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ delay: idx * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                className="relative"
                            >
                                <div className="relative z-10 mb-8 flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-paper-warm text-sm font-semibold text-ink shadow-[0_10px_30px_-24px_rgba(24,24,24,0.45)]">
                                        {idx + 1}
                                    </div>
                                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                        {phase.week}
                                    </span>
                                </div>

                                <div className="border-l border-border/80 pl-6">
                                    <div className="mb-4 flex items-end gap-3">
                                        <span className="font-mono text-[54px] leading-none text-ink/[0.14]">
                                            0{idx + 1}
                                        </span>
                                        <h4 className="pb-1 text-[1.55rem] font-semibold leading-[1.05] tracking-tight text-ink">
                                            {phase.title}
                                        </h4>
                                    </div>
                                    <p className="max-w-sm text-sm leading-relaxed text-ink-light">
                                        {phase.summary}
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {phase.deliverables.map((deliverable) => (
                                            <span
                                                key={deliverable}
                                                className="rounded-full border border-border bg-white/70 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-ink"
                                            >
                                                {deliverable}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </m.article>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-10 lg:hidden">
                {howWeWork.map((phase, idx) => (
                    <m.article
                        key={phase.week}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -14 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ delay: idx * 0.1, duration: 0.45 }}
                        className="relative pl-12"
                    >
                        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />
                        <div className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                            {idx + 1}
                        </div>

                        <div className="space-y-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                {phase.week}
                            </span>
                            <h4 className="text-xl font-semibold tracking-tight text-ink">
                                {phase.title}
                            </h4>
                            <p className="text-sm leading-relaxed text-ink-light">
                                {phase.summary}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {phase.deliverables.map((deliverable) => (
                                    <span
                                        key={deliverable}
                                        className="rounded-full border border-border bg-white/70 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-ink"
                                    >
                                        {deliverable}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </m.article>
                ))}
            </div>
        </div>
    );
}

function TechnicalPatterns() {
    return (
        <div className="mb-14 rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(246,238,228,0.95))] p-5 shadow-[0_22px_70px_-48px_rgba(24,24,24,0.2)] backdrop-blur-sm lg:mb-16 lg:p-6">
            <FadeIn>
                <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-[0.28em] text-ink-muted">
                            Built into the sprint
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                            The AI work stays operable.
                        </h3>
                    </div>
                    <p className="max-w-xl text-sm leading-relaxed text-ink-light">
                        These are not add-ons after launch. They are part of the delivery baseline.
                    </p>
                </div>
            </FadeIn>

            <div className="space-y-3">
                {technicalEdge.map((item, idx) => (
                    <FadeIn key={item.title} delay={idx * 0.04}>
                        <article className="grid gap-3 rounded-[1.35rem] border border-border/75 bg-white/74 px-4 py-3 shadow-[0_10px_24px_-22px_rgba(24,24,24,0.18)] transition-all duration-300 hover:border-ink/15 hover:shadow-[0_18px_36px_-28px_rgba(24,24,24,0.22)] md:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_minmax(11rem,0.62fr)] xl:items-center">
                            <div className="flex items-center gap-3">
                                <span className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] ${categoryStyles[item.category] ?? "border-border bg-paper-warm/70 text-ink-muted"}`}>
                                    {item.category}
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted xl:hidden">
                                    0{idx + 1}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <h4 className="text-[1.02rem] font-semibold leading-[1.08] tracking-tight text-ink">
                                        {item.title}
                                    </h4>
                                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted xl:inline">
                                        0{idx + 1}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-ink-light">
                                    {item.description}
                                </p>
                            </div>
                            <div className="border-t border-border/70 pt-3 text-sm leading-relaxed text-ink xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
                                {item.stats}
                            </div>
                        </article>
                    </FadeIn>
                ))}
            </div>
        </div>
    );
}

function OperationsDashboard() {
    return (
        <div className="mt-14 lg:mt-16">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:items-start">
                <FadeIn>
                    <div className="xl:pt-2">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                            <p className="text-xs font-mono uppercase tracking-[0.28em] text-ink-muted">
                                Operations dashboard
                            </p>
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                            The operating view, not a slide.
                        </h3>
                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-light">
                            Shared memory, live traces, and runtime signals make the system legible while it is running.
                        </p>

                        <div className="mt-8 space-y-5">
                            {dashboardNotes.map((note) => (
                                <div key={note.id} className="border-t border-border/80 pt-4">
                                    <div className="mb-2 flex items-baseline gap-3">
                                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                            {note.id}
                                        </span>
                                        <h4 className="text-base font-medium text-ink">
                                            {note.title}
                                        </h4>
                                    </div>
                                    <p className="max-w-md text-sm leading-relaxed text-ink-light">
                                        {note.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.15}>
                    <div className="relative xl:pl-2">
                        <div className="pointer-events-none absolute inset-x-8 top-10 h-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(17,17,17,0.18),transparent_72%)] blur-3xl" />
                        <div className="rounded-[28px] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(247,240,231,0.9))] p-3 shadow-[0_28px_80px_-56px_rgba(24,24,24,0.55)] sm:p-4 lg:p-5">
                            <div className="mb-4 flex flex-wrap gap-2">
                                {dashboardMetrics.map((item) => (
                                    <span
                                        key={item.label}
                                        className="rounded-full border border-border bg-paper-warm/80 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-muted"
                                    >
                                        {item.label}
                                    </span>
                                ))}
                            </div>

                            <div className="relative">
                                <CommandCenter />
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            {dashboardMetrics.map((item) => (
                                <div key={`${item.label}-detail`} className="border-t border-border/80 pt-3">
                                    <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-ink-muted">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-ink">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

export function Advantage() {
    return (
        <Section id="edge" className="bg-paper-warm py-20 md:py-24">
            <Container>
                <div className="mb-14 rounded-[2.2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.36),rgba(247,240,231,0.28))] px-5 py-8 shadow-[0_24px_80px_-68px_rgba(24,24,24,0.55)] sm:px-6 lg:mb-16 lg:px-8 lg:py-8">
                    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.92fr)] xl:items-start">
                        <div className="max-w-3xl">
                            <FadeIn>
                                <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-ink-muted">
                                    <span>How we work</span>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <span>Fixed scope</span>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <span>Production ready in 3 weeks</span>
                                </div>
                            </FadeIn>
                            <FadeIn delay={0.1}>
                                <h2 className="mb-5 max-w-2xl text-3xl font-semibold tracking-tight text-ink md:text-4xl xl:text-[3.35rem] xl:leading-[0.96]">
                                    Speed with guardrails.
                                    <br />
                                    <span className="text-ink-muted">Fixed price certainty.</span>
                                </h2>
                            </FadeIn>
                            <FadeIn delay={0.15}>
                                <p className="max-w-xl text-base leading-relaxed text-ink-light">
                                    We ship MVPs fast without brittle AI. Retrieval, evals, observability, and cost controls are part of the build.
                                </p>
                            </FadeIn>

                            <FadeIn delay={0.18}>
                                <div className="mt-6 grid gap-2 sm:grid-cols-3 xl:max-w-[42rem]">
                                    <div className="rounded-[1.15rem] border border-border/75 bg-white/65 px-4 py-3">
                                        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-muted">
                                            Scope lock
                                        </p>
                                        <p className="mt-2 text-sm font-medium leading-snug text-ink">
                                            Plan and commercial frame get nailed before delivery expands.
                                        </p>
                                    </div>
                                    <div className="rounded-[1.15rem] border border-border/75 bg-white/65 px-4 py-3">
                                        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-muted">
                                            Core ship
                                        </p>
                                        <p className="mt-2 text-sm font-medium leading-snug text-ink">
                                            Real product logic, integrations, and data model land in week two.
                                        </p>
                                    </div>
                                    <div className="rounded-[1.15rem] border border-border/75 bg-white/65 px-4 py-3">
                                        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-muted">
                                            Live handoff
                                        </p>
                                        <p className="mt-2 text-sm font-medium leading-snug text-ink">
                                            Launch, regression pass, and production-ready transfer happen in week three.
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        <DeliveryProofBoard />
                    </div>

                    <FadeIn delay={0.22}>
                        <div className="mt-7 grid gap-3 border-t border-border/70 pt-4 lg:grid-cols-[auto_1fr] lg:items-center">
                            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-ink-muted">
                                Proof-first delivery
                            </p>
                            <div className="grid gap-2 sm:grid-cols-3">
                                <div className="rounded-full border border-border/70 bg-paper-warm/70 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-ink">
                                    Week 1: scope, UX, architecture
                                </div>
                                <div className="rounded-full border border-border/70 bg-paper-warm/70 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-ink">
                                    Week 2: core build and integrations
                                </div>
                                <div className="rounded-full border border-border/70 bg-paper-warm/70 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-ink">
                                    Week 3: launch, hardening, handoff
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                <SprintTimeline />
                <TechnicalPatterns />
                <OperationsDashboard />
            </Container>
        </Section>
    );
}
