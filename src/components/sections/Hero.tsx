'use client';

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/Motion";
import { SplitText } from "@/components/motion/SplitText";
import { AgentSwarm } from "@/components/motion/AgentSwarm";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useContactModal } from "@/lib/contact-modal-context";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { siteBrand } from "@/lib/site-brand";
import Image from "next/image";
import Link from "next/link";

import { m, useReducedMotion } from "framer-motion";

const engineersFromLogos = [
    { name: "IIT Bombay", src: "/images/logos/Indian_Institute_of_Technology_Bombay_Logo.svg.png", dark: true, url: "https://www.iitb.ac.in", width: 1280, height: 1248 },
    { name: "Stanford", src: "/images/logos/Stanford-University-Logo.png", dark: false, url: "https://www.stanford.edu", width: 1129, height: 1288, className: "h-10" },
    { name: "WorldQuant", src: "/images/logos/worldquant.svg", dark: false, url: "https://www.worldquant.com" },
    { name: "OpenAI x Bain", src: "/images/logos/openai-bain.png", dark: true, url: "https://openai.com" },
];

const clientLogos: { name: string; src: string; dark: boolean; url?: string }[] = [
    { name: "Climitra", src: "/images/logos/climitra.svg", dark: true },
    { name: "Visusta", src: "/images/logos/visusta.png", dark: false },
    { name: "Alan Scott Automation", src: "/images/logos/automation-logo.svg", dark: true },
    { name: "Alan Scott LearniX", src: "/images/logos/learnix-logo.svg", dark: true },
    { name: "Alan Scott Retail", src: "/images/logos/retail-logo.svg", dark: true },
    { name: "Satwik Himalayan Products", src: "/images/logos/satwik-logo.svg", dark: true },
];

const trustSignals = [
    "Free quote in 24h",
    "Dedicated senior team",
    "15+ projects delivered",
    "100% IP ownership",
];

const heroStats = [
    { value: "$15,000", label: "Fixed sprint" },
    { value: "6 weeks", label: "Delivery window" },
    { value: "$3,000", label: "SOC 2 readiness" },
];

export function Hero() {
    const { open } = useContactModal();
    const prefersReducedMotion = useReducedMotion();

    return (
        <section
            id="hero"
            className="relative flex min-h-[calc(100svh-4rem)] items-start overflow-hidden bg-transparent pt-20 pb-14 sm:pt-[5.25rem] sm:pb-16 lg:pt-20 lg:pb-18 xl:pt-[5.25rem] xl:pb-20"
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
            <div className="absolute left-[-10rem] top-[5.5rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(31,63,147,0.12),transparent_68%)] blur-3xl sm:left-[-12rem] sm:top-[6rem] sm:h-[28rem] sm:w-[28rem] lg:left-[-14rem] lg:top-[7rem] lg:h-[30rem] lg:w-[30rem]" />
            <div className="absolute right-[-12rem] top-[12rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(24,18,13,0.07),transparent_66%)] blur-3xl lg:right-[-14rem] lg:top-[10rem] lg:h-[28rem] lg:w-[28rem]" />

            <Container className="relative z-10">
                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] lg:gap-12 xl:gap-14">
                    <div className="max-w-3xl lg:max-w-[42rem]">
                        <FadeIn delay={0}>
                            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-ink-muted shadow-[0_8px_20px_rgba(24,18,13,0.04)] backdrop-blur-sm sm:gap-3 sm:text-[11px] sm:tracking-[0.22em]">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                <span className="sm:hidden whitespace-nowrap">Eternal Transience</span>
                                <span className="hidden whitespace-nowrap sm:inline">{siteBrand.tagline}</span>
                                <span className="hidden text-ink/30 sm:inline">•</span>
                                <span className="whitespace-nowrap font-[var(--font-signature)] text-[15px] normal-case tracking-normal text-ink sm:text-[18px]">
                                    Transient Labs
                                </span>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <h1 className="mt-5 max-w-[18ch] text-balance text-[2.85rem] leading-[0.96] tracking-[-0.06em] text-ink sm:mt-6 sm:max-w-[12ch] sm:text-[3.3rem] md:max-w-[14ch] md:text-[3.95rem] lg:mt-6 lg:max-w-none lg:text-[4.2rem] xl:text-[4.5rem]">
                                <span className="lg:hidden">
                                    <span className="block">
                                        <SplitText
                                            delay={0.08}
                                            staggerDelay={0.025}
                                            trigger="mount"
                                            className="font-sans font-semibold"
                                        >
                                            We ship
                                        </SplitText>{" "}
                                        <SplitText
                                            delay={0.18}
                                            staggerDelay={0.025}
                                            trigger="mount"
                                            className="font-sans font-semibold text-accent"
                                        >
                                            AI Agents
                                        </SplitText>
                                    </span>

                                    <span className="mt-3 block text-ink-light">
                                        <SplitText
                                            delay={0.28}
                                            staggerDelay={0.025}
                                            trigger="mount"
                                            className="font-sans font-semibold"
                                        >
                                            that boost margins in weeks, not months.
                                        </SplitText>
                                    </span>
                                </span>

                                <span className="hidden lg:block">
                                    <span className="block">
                                        <SplitText
                                            delay={0.08}
                                            staggerDelay={0.025}
                                            trigger="mount"
                                            className="font-sans font-semibold"
                                        >
                                            We ship
                                        </SplitText>
                                    </span>
                                    <span className="block text-accent">
                                        <SplitText
                                            delay={0.18}
                                            staggerDelay={0.025}
                                            trigger="mount"
                                            className="font-sans font-semibold text-accent"
                                        >
                                            AI Agents
                                        </SplitText>
                                    </span>
                                    <span className="mt-2 block text-ink-light">
                                        <SplitText
                                            delay={0.28}
                                            staggerDelay={0.025}
                                            trigger="mount"
                                            className="font-sans font-semibold"
                                        >
                                            that boost margins
                                        </SplitText>
                                    </span>
                                    <span className="block text-ink-light">
                                        <SplitText
                                            delay={0.38}
                                            staggerDelay={0.025}
                                            trigger="mount"
                                            className="font-sans font-semibold"
                                        >
                                            in weeks, not months.
                                        </SplitText>
                                    </span>
                                </span>
                            </h1>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-light md:text-xl lg:max-w-[35rem] lg:text-[1.08rem]">
                                A senior product team for founders who need the full build: UX, full-stack, AI, evals, guardrails, deployment, and SOC2 readiness.
                            </p>
                            <p className="mt-4 max-w-2xl text-sm font-medium tracking-wide text-ink-muted md:text-base lg:hidden">
                                6-week sprint $15,000 · SOC 2 readiness $3,000 · Industrial sprint $40,000
                            </p>
                            <div className="mt-5 hidden lg:inline-flex items-center overflow-hidden rounded-full border border-border bg-white/70 p-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted shadow-[0_10px_24px_rgba(24,18,13,0.05)] backdrop-blur-sm">
                                <span className="rounded-full px-4 py-2">6-week sprint $15,000</span>
                                <span className="h-4 w-px bg-border" />
                                <span className="rounded-full px-4 py-2">SOC 2 readiness $3,000</span>
                                <span className="h-4 w-px bg-border" />
                                <span className="rounded-full px-4 py-2">Industrial sprint $40,000</span>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
                                <Button variant="primary" size="lg" onClick={() => { trackEvent('cta_click', { cta_text: 'Request a Call', cta_location: 'hero' }); open(); }}>
                                    Request a Call
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                                <Button variant="secondary" size="lg" asChild animate={false}>
                                    <Link href="/industrial-energy-automation" onClick={() => trackEvent('cta_click', { cta_text: 'Explore Industrial Automation', cta_location: 'hero' })}>
                                        Explore Industrial Automation
                                    </Link>
                                </Button>
                                <Button
                                    variant="text"
                                    size="md"
                                    className="sm:hidden px-0 h-auto min-w-0"
                                    onClick={() => { trackEvent('cta_click', { cta_text: 'See Pricing', cta_location: 'hero' }); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}
                                >
                                    See Pricing
                                </Button>
                            </div>
                            <div
                                className="mt-4 flex flex-wrap gap-2"
                                tabIndex={0}
                                role="region"
                                aria-label="Trust signals"
                            >
                                {trustSignals.map((signal) => (
                                    <div
                                        key={signal}
                                        className="rounded-full border border-border bg-white/65 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-ink-muted shadow-[0_8px_18px_rgba(24,18,13,0.03)] backdrop-blur-sm"
                                    >
                                        {signal}
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.35}>
                            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:hidden">
                                {heroStats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-[1.5rem] border border-border bg-white/60 p-4 shadow-[0_12px_30px_rgba(24,18,13,0.04)] backdrop-blur-sm"
                                    >
                                        <div className="text-2xl font-semibold tracking-[-0.04em] text-ink md:text-[1.75rem]">
                                            {stat.value}
                                        </div>
                                        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <div className="mt-10 space-y-5 rounded-[2rem] border border-border bg-white/55 p-5 shadow-[0_18px_46px_rgba(24,18,13,0.04)] backdrop-blur-sm md:p-6 lg:mt-14">
                                <div>
                                    <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                                        Engineers from
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {engineersFromLogos.map((logo) => {
                                            const pill = (
                                                <div className="flex h-10 items-center rounded-lg border border-border/60 bg-white/60 px-3 transition-[background-color,box-shadow] duration-300 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(24,18,13,0.06)]">
                                                    <Image
                                                        src={logo.src}
                                                        alt={logo.name}
                                                        width={logo.width ?? 160}
                                                        height={logo.height ?? 36}
                                                        sizes="160px"
                                                        className={cn(
                                                            "h-8 w-auto max-w-[160px] object-contain brightness-0 opacity-75 transition-opacity hover:opacity-100",
                                                            logo.className
                                                        )}
                                                    />
                                                </div>
                                            );
                                            return logo.url ? (
                                                <a key={logo.name} href={logo.url} target="_blank" rel="noopener noreferrer">{pill}</a>
                                            ) : (
                                                <div key={logo.name}>{pill}</div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                                        Built for
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {clientLogos.map((logo) => {
                                            const pill = (
                                                <div className="flex h-10 items-center rounded-lg border border-border/60 bg-white/60 px-3 transition-[background-color,box-shadow] duration-300 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(24,18,13,0.06)]">
                                                    <Image
                                                        src={logo.src}
                                                        alt={logo.name}
                                                        width={160}
                                                        height={32}
                                                        sizes="150px"
                                                        className={cn(
                                                            "h-7 w-auto max-w-[150px] object-contain brightness-0 opacity-75 transition-opacity hover:opacity-100"
                                                        )}
                                                    />
                                                </div>
                                            );
                                            return logo.url ? (
                                                <a key={logo.name} href={logo.url} target="_blank" rel="noopener noreferrer">{pill}</a>
                                            ) : (
                                                <div key={logo.name}>{pill}</div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.5} className="relative hidden lg:block lg:pt-2 xl:pt-3">
                        <div className="rounded-[2.25rem] border border-border/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,242,233,0.96))] p-4 shadow-[0_32px_90px_rgba(24,18,13,0.08)] backdrop-blur-sm">
                            <AgentSwarm />
                        </div>
                    </FadeIn>
                </div>
            </Container>

            {/* Scroll-down indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
                {prefersReducedMotion ? (
                    <ChevronDown className="w-6 h-6 text-ink-muted opacity-40" />
                ) : (
                    <m.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-6 h-6 text-ink-muted opacity-40" />
                    </m.div>
                )}
            </div>
        </section>
    );
}
