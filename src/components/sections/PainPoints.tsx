'use client';

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";

const painPoints = [
    {
        title: "Edge deployment constraints",
        badge: "Deployment",
        desc: "Local TTS and VLM quality lag behind cloud, and multilingual coverage stays uneven for privacy-first teams.",
        signal: "The first compromise shows up in quality, coverage, and trust.",
    },
    {
        title: "Latency budget misses",
        badge: "Runtime",
        desc: "Cold starts and multi-hop pipelines blow latency budgets, making real-time experiences feel unstable.",
        signal: "Fast demos become slow products the moment load rises.",
    },
    {
        title: "Orchestration reliability",
        badge: "Workflow",
        desc: "Agentic flows loop or break because outputs are not deterministic. Debugging turns into archaeology.",
        signal: "The system looks clever until one branch starts to drift.",
    },
    {
        title: "Static evaluation metrics",
        badge: "Measurement",
        desc: "Teams want evals that reflect user feedback and business KPIs, not only offline accuracy scores.",
        signal: "Without live signals, teams optimize the wrong thing.",
    },
    {
        title: "Provider API instability",
        badge: "Vendor risk",
        desc: "Provider APIs ignore parameters and rate-limit unpredictably. Fallbacks stop being optional.",
        signal: "Reliability depends on contracts you do not control.",
    },
    {
        title: "Content drift",
        badge: "Brand risk",
        desc: "Generative UI and content pipelines drift toward hallucinations without tight constraints.",
        signal: "Loose generation erodes consistency faster than teams expect.",
    },
];

const proofNotes = [
    "Design for the edge, not the demo.",
    "Budget latency before features.",
    "Treat evals as a live operating system.",
];

export function PainPoints() {
    return (
        <Section
            id="approach"
            className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f1e6_0%,#f3eadf_100%)] lg:pt-16 lg:pb-24"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.55),transparent_28%)]"
            />
            <Container className="relative">
                <div className="grid gap-10 lg:grid-cols-[minmax(17rem,0.68fr)_minmax(0,1.32fr)] lg:items-start lg:gap-8">
                    <div className="lg:sticky lg:top-24 lg:max-w-md lg:pr-4">
                        <FadeIn>
                            <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">
                                AI MVP Reality
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.08}>
                            <h2 className="mt-3 max-w-md text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-[4rem] lg:leading-[0.94]">
                                Where AI products crack under pressure
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.14}>
                            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-light">
                                Demos are easy. Shipping AI users can trust takes guardrails, evals, and latency budgets that hold up outside the lab.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div className="mt-6 max-w-sm rounded-[1.8rem] border border-border/80 bg-white/80 p-4 shadow-[0_18px_45px_rgba(10,10,10,0.06)] backdrop-blur-sm lg:mt-5">
                                <div className="text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                    What breaks first
                                </div>
                                <div className="mt-3 divide-y divide-border/60">
                                    {proofNotes.map((note) => (
                                        <div
                                            key={note}
                                            className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
                                        >
                                            <span className="mt-1.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(31,63,147,0.12)]" />
                                            <p className="text-sm leading-relaxed text-ink">{note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    <div className="relative lg:pl-10">
                        <div
                            aria-hidden="true"
                            className="absolute left-4 top-4 hidden h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-accent/50 via-border/80 to-transparent lg:block"
                        />
                        <Stagger className="space-y-4 lg:space-y-3" staggerDelay={0.08}>
                            {painPoints.map((item, idx) => (
                                <StaggerItem key={item.title} className="relative lg:pl-6">
                                    <div
                                        aria-hidden="true"
                                        className="absolute left-[0.65rem] top-8 hidden h-3 w-3 rounded-full border border-accent/30 bg-paper shadow-[0_0_0_5px_rgba(31,63,147,0.08)] lg:block"
                                    />
                                    <article className="group relative overflow-hidden rounded-[1.7rem] border border-border/80 bg-white/82 p-5 shadow-[0_10px_30px_rgba(10,10,10,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_22px_55px_rgba(10,10,10,0.08)] lg:grid lg:grid-cols-[3.35rem_minmax(0,1.32fr)_minmax(11.5rem,0.78fr)] lg:items-start lg:gap-5 lg:px-5 lg:py-4">
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                                        />
                                        <div className="flex items-start justify-between gap-4 lg:block">
                                            <div className="min-w-0 lg:hidden">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="rounded-full border border-border/80 bg-paper-warm/70 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                                        {item.badge}
                                                    </span>
                                                    <h3 className="text-xl font-semibold tracking-tight text-ink md:text-[1.3rem]">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="font-mono text-[2.4rem] leading-none text-ink/10" aria-hidden="true">
                                                0{idx + 1}
                                            </div>
                                        </div>

                                        <div className="mt-4 min-w-0 lg:mt-0">
                                            <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-3">
                                                <span className="rounded-full border border-border/80 bg-paper-warm/70 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-ink-muted">
                                                    {item.badge}
                                                </span>
                                                <h3 className="text-[1.15rem] font-semibold tracking-tight text-ink">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p className="max-w-2xl text-sm leading-relaxed text-ink-light md:text-[0.95rem] lg:mt-3 lg:max-w-none">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <div className="mt-4 rounded-[1.2rem] border border-border/80 bg-paper-warm/55 px-4 py-3 lg:mt-0 lg:min-h-full lg:rounded-none lg:border-0 lg:border-l lg:border-accent/20 lg:bg-transparent lg:px-0 lg:py-0 lg:pl-5">
                                            <p className="text-sm leading-relaxed text-ink-light italic lg:text-[0.92rem]">
                                                    {item.signal}
                                            </p>
                                        </div>
                                    </article>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
