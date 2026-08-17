'use client';

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Cpu, Factory, Gauge, Leaf, ShoppingCart, Wrench } from "lucide-react";
import { INDUSTRY_NAMES } from '@/lib/industries';

const contexts = [
    {
        name: INDUSTRY_NAMES[0],
        signal: "Kiln batches, buyer evidence, carbon receipts.",
        detail: "MRV, feedstock intake, batch evidence, buyer workflows, and carbon-credit reporting.",
        icon: Leaf,
    },
    {
        name: INDUSTRY_NAMES[1],
        signal: "Dealer queues and field service made visible.",
        detail: "Dealer operations, service telemetry, warranty intelligence, and field-team dashboards.",
        icon: Gauge,
    },
    {
        name: INDUSTRY_NAMES[2],
        signal: "Demand signals instead of stale reports.",
        detail: "Inventory copilots, CRM automation, demand signals, and store-level operating views.",
        icon: ShoppingCart,
    },
    {
        name: INDUSTRY_NAMES[3],
        signal: "BOM changes, routings, and station work made executable.",
        detail: "Forge-style systems for EBOM-to-MBOM handoff, ECO review, supplier impact, routing release, line readiness, traveler signoff, and signed audit trails.",
        icon: Wrench,
    },
    {
        name: INDUSTRY_NAMES[4],
        signal: "Plant-floor exceptions with owners attached.",
        detail: "Ops dashboards, audit trails, maintenance workflows, and manager-facing control planes.",
        icon: Factory,
    },
    {
        name: INDUSTRY_NAMES[5],
        signal: "Agentic products with runtime truth built in.",
        detail: "Agents, RAG, evals, observability, billing, roles, and production app architecture.",
        icon: Cpu,
    },
];

export function Industries() {
    return (
        <Section id="industries" className="border-y border-border bg-paper-warm/45">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
                    <FadeIn>
                        <div>
                            <p className="text-sm text-ink-muted">Industries we work with</p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                                Built close to the work.
                            </h2>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.08}>
                        <p className="max-w-2xl text-base leading-7 text-ink-light lg:justify-self-end">
                            Biochar kilns, pump dealerships, retail aisles, hardware programs, plant floors, and AI SaaS runtimes all have different truths.
                        </p>
                    </FadeIn>
                </div>

                <Stagger className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mt-12 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:gap-6" staggerDelay={0.06}>
                    {contexts.map((context) => {
                        const Icon = context.icon;
                        return (
                            <StaggerItem key={context.name} className="min-w-[82vw] snap-start md:min-w-0">
                                <article className="group flex h-full flex-col rounded-[1.5rem] border border-border bg-white/75 p-6 shadow-[0_18px_48px_-38px_rgba(84,69,56,0.34)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_64px_-32px_rgba(84,69,56,0.45)] focus-within:-translate-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-paper text-ink transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <h3 className="text-xl font-semibold tracking-tight text-ink">{context.name}</h3>
                                    </div>
                                    <p className="mt-4 text-sm font-medium leading-6 text-ink">{context.signal}</p>
                                    <p className="mt-2 text-sm leading-6 text-ink-light">{context.detail}</p>
                                </article>
                            </StaggerItem>
                        );
                    })}
                </Stagger>
            </Container>
        </Section>
    );
}
