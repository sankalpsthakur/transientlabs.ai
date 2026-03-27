'use client';

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/Motion";
import { SplitText } from "@/components/motion/SplitText";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useContactModal } from "@/lib/contact-modal-context";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

// Company logos as inline SVGs for performance
const logos = {
    microsoft: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623" />
        </svg>
    ),
    paypal: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
        </svg>
    ),
    // IIT (ISM) Dhanbad - Official emblem (simplified)
    iitism: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#000080">
            <path d="M12 2L4 6v4c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 2.18l6 3v3.82c0 4.53-3.13 8.76-6 9.82-2.87-1.06-6-5.29-6-9.82V7.18l6-3z" />
            <path d="M12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-2 0-4 1-4 2v1h8v-1c0-1-2-2-4-2z" />
        </svg>
    ),
    // WorldQuant - Official wordmark
    worldquant: (
        <svg viewBox="0 0 120 24" className="h-5 w-auto" fill="currentColor">
            <g transform="translate(0, 4) scale(0.048)">
                <path fill="#87746A" d="M74.1,270h6.4l7.3-20.4l7.4,20.4h6.4l14.5-40.1h-3.7l-11.9,32.6L88.3,230h-7.6l5.3,14.5l-6.6,17.9L67.2,230H55.8v1.2c4.4,0.7,4.4,0.9,5.7,4.3L74.1,270z" />
                <path fill="#87746A" d="M133.5,228.5c-14.2,0-18.1,8.3-18.1,21.6c0,13.3,3.9,21.3,18.1,21.3c13.5,0,17.7-8,17.7-21.3C151,236.9,147,228.5,133.5,228.5z M133.5,268.4c-8.9,0-9.6-10.3-9.6-18.4c0-8.3,0.7-18.4,9.6-18.4c8.7,0,9.2,10.5,9.2,18.4C142.7,258,142.2,268.4,133.5,268.4z" />
                <path fill="#87746A" d="M176.6,251.4c6.4-0.7,9.9-4.1,9.9-10.8c0-10.6-12.4-10.6-16.8-10.6h-13.1V270h7.8v-37.2h5c5,0,8.7,1.8,8.7,8.2c0,7.3-5.5,8.7-9.2,8.7h-1.1l12.8,20.4h8.5L176.6,251.4z" />
                <path fill="#87746A" d="M206,267.2c-4.1,0-4.1,0-4.1-4.4V230h-7.8V270h23.8v-2.8H206z" />
                <path fill="#87746A" d="M236.3,230h-13.8V270h11.9c11.7,0,21.6-1.2,21.6-20.2C256,233,247.7,230,236.3,230z M234.6,267.2c-4.1,0-4.1-1.6-4.1-3.9v-30.5h5c11.2,0,12.4,6.7,12.4,17.2C247.7,262.1,245.4,267.2,234.6,267.2z" />
                <path fill="#F8981D" d="M279.1,268.4c-8.9,0-9.6-10.3-9.6-18.4c0-8.3,0.7-18.4,9.6-18.4c8.7,0,9.2,10.5,9.2,18.4C288.3,258,287.8,268.4,279.1,268.4z M296.8,250.2c0-13.3-4.1-21.6-17.7-21.6c-14.2,0-18.1,8.3-18.1,21.6c0,13.3,3.9,21.3,18.1,21.3h19.5v-1.2c-4.4-0.7-7.8-1.4-5.9-4.1C295.8,262.2,296.8,256.9,296.8,250.2" />
                <path fill="#F8981D" d="M328.7,230V256c0,6-0.2,12.6-10.1,12.6c-8.5,0-8.5-6.6-8.5-12.6V230h-7.8v27.7c0,10.8,5.9,13.8,16.3,13.8c14.2,0,14.4-8.9,14.4-16.8V230H328.7z" />
                <path fill="#F8981D" d="M370.8,230l-4.6,12.6h-14.7l-4.8-12.6h-11.3v1.2c4.4,0.7,4.4,0.9,5.7,4.3l12.6,34.6h6.4l14.7-40.1C374.7,230,370.8,230,370.8,230z M358.9,262.6l-6.4-17.2h12.8L358.9,262.6z" />
                <path fill="#F8981D" d="M408.9,230V270H402l-19.7-33.9h-0.2V270h-3.7V230h7.8l18.8,32.5h0.2V230H408.9z" />
                <path fill="#F8981D" d="M431.9,232.8V270h-7.8v-37.2h-12.2V230h32.3v2.8H431.9z" />
            </g>
        </svg>
    ),
    // Hygenco - Official green G mark with wordmark
    hygenco: (
        <svg viewBox="0 0 66 45" className="h-6 w-auto" fill="currentColor">
            <g>
                <path fill="#99CA3C" d="M 46.050781 6.984375 L 46.050781 24.382812 C 47.714844 21.894531 48.683594 18.902344 48.683594 15.683594 C 48.683594 12.464844 47.714844 9.472656 46.050781 6.984375 Z" />
                <path fill="#99CA3C" d="M 39.972656 13.40625 L 39.972656 1.632812 C 37.875 0.585938 35.503906 0 33 0 C 24.335938 0 17.316406 7.023438 17.316406 15.683594 C 17.316406 24.347656 24.335938 31.367188 33 31.367188 C 35.503906 31.367188 37.871094 30.78125 39.972656 29.738281 L 39.972656 18.410156 L 28.238281 18.34375 L 31.738281 19.800781 L 31.804688 24.386719 C 31.84375 26.363281 30.035156 26.351562 30.035156 26.351562 L 25.71875 26.351562 L 25.71875 6.863281 C 25.71875 5.070312 27.222656 4.964844 27.222656 4.964844 L 31.730469 4.964844 L 31.730469 13.40625 Z" />
            </g>
        </svg>
    ),
};

const brands = [
    { name: "IIT (ISM)", logo: logos.iitism, style: "" },
    { name: "WorldQuant", logo: logos.worldquant, style: "" },
    { name: "Hygenco", logo: logos.hygenco, style: "" },
    { name: "PayPal", logo: logos.paypal, style: "" },
    { name: "Microsoft", logo: logos.microsoft, style: "" },
];

const trustSignals = [
    "Free quote within 24h",
    "Dedicated team",
    "15+ Projects Delivered",
    "100% Client Satisfaction",
    "AI-Accelerated Development",
    "Unparalleled Post-Delivery Support",
];

export function Hero() {
    const { open } = useContactModal();
    const prefersReducedMotion = useReducedMotion();

    return (
        <section id="hero" className="relative min-h-screen flex items-center pt-16 bg-paper overflow-hidden">
            {/* Soft ambient background glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-900/10 via-emerald-900/5 to-transparent rounded-full blur-[120px] -z-10" />

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="max-w-3xl lg:max-w-none">
                        <FadeIn delay={0}>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-sm text-ink-muted font-mono tracking-wider uppercase">
                                    AI MVP Sprint · 3 weeks · $4,999 · Limited slots
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-8 text-ink">
                                <span className="block">
                                    <SplitText
                                        delay={0.08}
                                        staggerDelay={0.03}
                                        trigger="mount"
                                        className="font-sans font-extrabold uppercase tracking-[-0.02em]"
                                    >
                                        Ship
                                    </SplitText>
                                </span>

                                <span className="block -mt-1 text-ink-muted">
                                    <SplitText
                                        delay={0.18}
                                        staggerDelay={0.02}
                                        trigger="mount"
                                        className="inline-block font-[var(--font-signature)] font-medium -skew-x-12 tracking-[-0.01em]"
                                    >
                                        a production-grade
                                    </SplitText>
                                </span>

                                <span className="block">
                                    <SplitText
                                        delay={0.28}
                                        staggerDelay={0.03}
                                        trigger="mount"
                                        className="font-sans font-extrabold tracking-[-0.02em] text-signal"
                                    >
                                        AI
                                    </SplitText>{" "}
                                    <SplitText
                                        delay={0.34}
                                        staggerDelay={0.03}
                                        trigger="mount"
                                        className="inline-block font-[var(--font-signature)] font-medium -skew-x-12 tracking-[-0.01em]"
                                    >
                                        product.
                                    </SplitText>
                                </span>

                                <span className="block mt-6 text-2xl md:text-3xl lg:text-4xl leading-tight">
                                    <span className="inline-block font-[var(--font-signature)] -skew-x-12 text-ink-muted">
                                        in
                                    </span>{" "}
                                    <span className="font-sans font-extrabold">weeks</span>{" "}
                                    <span className="inline-block font-[var(--font-signature)] -skew-x-12 text-ink-muted">
                                        not
                                    </span>{" "}
                                    <span className="font-sans font-semibold text-ink-muted line-through opacity-60" aria-hidden="true">
                                        months
                                    </span>
                                    .
                                </span>
                            </h1>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <p className="text-xl md:text-2xl text-ink-light mb-8 leading-relaxed max-w-xl font-light">
                                A senior product team that ships the full product: UX, full-stack, and the AI layer (RAG, copilots, and agents) with evals, guardrails, and cost/latency budgets.
                                <br />
                                <span className="text-base text-ink-muted mt-2 block">Sprint: $4,999 · Weekly demos · Post-launch bug-fix window · Fractional CTO: $9,999/mo</span>
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Button variant="primary" size="lg" className="group" onClick={open}>
                                    Request a Call
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                                <Button variant="text" size="lg" className="sm:hidden" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                                    See Pricing
                                </Button>
                                <Button variant="secondary" size="lg" className="hidden sm:inline-flex" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                                    See Pricing
                                </Button>
                            </div>
                            <div className="flex overflow-x-auto gap-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-10 sm:gap-y-2 mt-1 text-xs text-ink-muted font-mono uppercase tracking-wider" tabIndex={0} role="region" aria-label="Trust signals">
                                {trustSignals.map((signal) => (
                                    <div key={signal} className="flex items-center gap-2 whitespace-nowrap shrink-0 snap-start sm:whitespace-normal sm:shrink">
                                        <span className="text-accent">/</span>
                                        <span>{signal}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.35}>
                            <div className="flex gap-4 sm:gap-8 md:gap-12 mb-12 border-l-2 border-accent/20 pl-6">
                                <div>
                                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-ink">$4,999</div>
                                    <div className="text-[10px] sm:text-xs text-ink-muted font-mono uppercase tracking-wider mt-1">Fixed Sprint</div>
                                </div>
                                <div>
                                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-ink">3 Weeks</div>
                                    <div className="text-[10px] sm:text-xs text-ink-muted font-mono uppercase tracking-wider mt-1">Time to Launch</div>
                                </div>
                                <div>
                                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-ink">100%</div>
                                    <div className="text-[10px] sm:text-xs text-ink-muted font-mono uppercase tracking-wider mt-1">IP Ownership</div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <div className="mt-24 pt-8 border-t border-border">
                                <p className="text-xs text-ink-muted mb-2 font-mono uppercase tracking-widest">
                                    Built internal tools for $10M+ valuation startups and unicorn teams
                                </p>
                                <p className="text-xs text-ink-muted mb-6 font-mono uppercase tracking-widest">
                                    Engineers from
                                </p>
                                <div className="flex flex-wrap items-center gap-x-8 md:gap-x-12 gap-y-8 grayscale hover:grayscale-0 transition-all duration-500">
                                    {brands.map((brand) => (
                                        <div
                                            key={brand.name}
                                            className="flex items-center gap-2 text-ink-light hover:text-ink transition-colors duration-200"
                                        >
                                            {brand.logo && (
                                                <span className="opacity-90 [&>svg]:w-4 [&>svg]:h-4">{brand.logo}</span>
                                            )}
                                            <span className={`text-sm ${brand.style} ${!brand.logo ? 'text-base' : ''}`}>
                                                {brand.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Connecting Noodles */}
                    <svg className="absolute hidden lg:block inset-0 pointer-events-none w-full h-full z-0 overflow-visible">
                        <defs>
                            <linearGradient id="noodle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                                <stop offset="20%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                <stop offset="80%" stopColor="#10b981" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="noodle-swarm" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
                                <stop offset="45%" stopColor="#34d399" stopOpacity="0.8" />
                                <stop offset="55%" stopColor="#34d399" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Top curve to image top */}
                        <path
                            id="noodle-top"
                            d="M 500 150 C 700 150, 800 100, 950 150"
                            stroke="url(#noodle-gradient)"
                            strokeWidth="3"
                            fill="none"
                            style={{ filter: 'blur(1px)' }}
                            className="opacity-60"
                        />
                        {!prefersReducedMotion && (
                            <path
                                d="M 500 150 C 700 150, 800 100, 950 150"
                                stroke="url(#noodle-swarm)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="none"
                                className="noodle-dash opacity-60"
                                pathLength={100}
                                strokeDasharray="8 92"
                            />
                        )}
                        {/* Middle curve to image center */}
                        <path
                            id="noodle-mid"
                            d="M 500 350 C 700 350, 750 300, 900 350"
                            stroke="url(#noodle-gradient)"
                            strokeWidth="2"
                            style={{ filter: 'blur(2px)' }}
                            fill="none"
                            className="opacity-40"
                        />
                        {!prefersReducedMotion && (
                            <path
                                d="M 500 350 C 700 350, 750 300, 900 350"
                                stroke="url(#noodle-swarm)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="none"
                                className="noodle-dash opacity-40"
                                pathLength={100}
                                strokeDasharray="10 90"
                                style={{ animationDelay: "0.6s" }}
                            />
                        )}
                        {/* Bottom curve to image bottom */}
                        <path
                            id="noodle-bot"
                            d="M 500 550 C 650 550, 700 600, 950 550"
                            stroke="url(#noodle-gradient)"
                            strokeWidth="2.5"
                            style={{ filter: 'blur(1px)' }}
                            fill="none"
                            className="opacity-50"
                        />
                        {!prefersReducedMotion && (
                            <path
                                d="M 500 550 C 650 550, 700 600, 950 550"
                                stroke="url(#noodle-swarm)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="none"
                                className="noodle-dash opacity-50"
                                pathLength={100}
                                strokeDasharray="7 93"
                                style={{ animationDelay: "0.25s" }}
                            />
                        )}

                        {!prefersReducedMotion && (
                            <g className="opacity-80">
                                {/* Swarm particles: small dots moving along the paths in staggered waves */}
                                <circle r="3" fill="#34d399" opacity="0.65">
                                    <animateMotion dur="3.8s" repeatCount="indefinite" begin="0s" keySplines="0.22 1 0.36 1" keyTimes="0;1" calcMode="spline">
                                        <mpath href="#noodle-top" />
                                    </animateMotion>
                                </circle>
                                <circle r="2" fill="#c084fc" opacity="0.45">
                                    <animateMotion dur="4.6s" repeatCount="indefinite" begin="0.7s" keySplines="0.22 1 0.36 1" keyTimes="0;1" calcMode="spline">
                                        <mpath href="#noodle-mid" />
                                    </animateMotion>
                                </circle>
                                <circle r="2.5" fill="#8b5cf6" opacity="0.5">
                                    <animateMotion dur="4.2s" repeatCount="indefinite" begin="1.4s" keySplines="0.22 1 0.36 1" keyTimes="0;1" calcMode="spline">
                                        <mpath href="#noodle-bot" />
                                    </animateMotion>
                                </circle>
                                <circle r="1.75" fill="#facc15" opacity="0.32">
                                    <animateMotion dur="5.4s" repeatCount="indefinite" begin="0.35s" keySplines="0.22 1 0.36 1" keyTimes="0;1" calcMode="spline">
                                        <mpath href="#noodle-top" />
                                    </animateMotion>
                                </circle>
                            </g>
                        )}
                    </svg>

                    <FadeIn delay={0.5} className="relative hidden lg:block z-10">
                        <div className="relative w-full aspect-square max-w-2xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-full blur-[100px] -z-10" />
                            <Image
                                src="/images/hero-v4.png"
                                alt="Transient Labs - MVP Sprint Studio"
                                fill
                                priority
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
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
