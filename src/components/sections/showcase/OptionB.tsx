'use client';

import type { KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { projects } from './projects';
import { cn } from '@/lib/utils';

function PadIndex(i: number) {
    return String(i).padStart(2, '0');
}

function hexToRgb(hex: string) {
    const value = hex.replace('#', '');
    const normalized = value.length === 3
        ? value.split('').map((chunk) => chunk + chunk).join('')
        : value;

    const numeric = parseInt(normalized, 16);
    const r = (numeric >> 16) & 255;
    const g = (numeric >> 8) & 255;
    const b = numeric & 255;

    return `${r}, ${g}, ${b}`;
}

export function OptionB() {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const galleryId = 'case-study-gallery';
    const panelId = `${galleryId}-panel`;
    const prefersReducedMotion = useReducedMotion();
    const activeProject = projects[activeIndex];
    const accentRgb = hexToRgb(activeProject.accent);
    const accentBackground = `linear-gradient(155deg, rgba(${accentRgb}, 0.2) 0%, rgba(255, 255, 255, 0.94) 42%, rgba(244, 236, 226, 0.98) 100%)`;

    const focusTab = (index: number) => {
        setActiveIndex(index);
        tabRefs.current[index]?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            event.preventDefault();
            focusTab((index + 1) % projects.length);
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            event.preventDefault();
            focusTab((index - 1 + projects.length) % projects.length);
        }

        if (event.key === 'Home') {
            event.preventDefault();
            focusTab(0);
        }

        if (event.key === 'End') {
            event.preventDefault();
            focusTab(projects.length - 1);
        }
    };

    return (
        <div className="bg-paper pb-14 md:pb-8">
            <div className="grid gap-4 lg:h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1.28fr)_320px] lg:items-stretch xl:grid-cols-[minmax(0,1.32fr)_340px]">
                <article
                    id={panelId}
                    role="tabpanel"
                    aria-labelledby={`${galleryId}-tab-${activeIndex}`}
                    aria-label={activeProject.title}
                    className="relative overflow-hidden rounded-[32px] border border-border/80 bg-white/80 shadow-[0_26px_90px_-34px_rgba(84,69,56,0.38)] scroll-mt-24 lg:h-full"
                    style={{ background: accentBackground }}
                >
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: `
                                radial-gradient(circle at 14% 18%, rgba(${accentRgb}, 0.18), transparent 30%),
                                radial-gradient(circle at 86% 16%, rgba(255, 255, 255, 0.8), transparent 28%),
                                linear-gradient(180deg, rgba(255, 255, 255, 0.48), transparent 36%)
                            `,
                        }}
                    />
                    <div
                        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
                        style={{ backgroundColor: `rgba(${accentRgb}, 0.22)` }}
                    />

                    <div className="relative p-5 md:p-7 lg:flex lg:h-full lg:flex-col">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/6 pb-4">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                                    Active case study
                                </p>
                                <p className="mt-1 text-sm text-ink">{activeProject.category}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-muted">
                                    {PadIndex(activeIndex + 1)} / {PadIndex(projects.length)}
                                </p>
                                <p className="mt-1 text-sm text-ink-light">{activeProject.label}</p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 lg:flex-1 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_11.5rem] xl:grid-cols-[minmax(0,1fr)_12.5rem]">
                            <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-black/6 bg-white/80 p-4 shadow-[0_20px_70px_-36px_rgba(24,18,13,0.38)] md:min-h-[390px] md:p-5 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
                                <div className="flex items-center gap-2 px-1 pb-4">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                                    <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                                        {activeProject.title}
                                    </span>
                                </div>

                                <div
                                    className="relative h-[calc(100%-2rem)] overflow-hidden rounded-[22px] border border-black/5 bg-white/75 lg:flex-1 lg:min-h-0"
                                    style={{
                                        background: `linear-gradient(180deg, rgba(${accentRgb}, 0.08), rgba(255, 255, 255, 0.9))`,
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        <m.div
                                            key={activeProject.src}
                                            initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
                                            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                                            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12, scale: 0.985 }}
                                            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute inset-0"
                                        >
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_54%)]" />
                                            <div className="absolute inset-0 p-2 md:p-3">
                                                <Image
                                                    src={activeProject.src}
                                                    alt={activeProject.alt}
                                                    fill
                                                    sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 56vw, 100vw"
                                                    className="object-contain drop-shadow-[0_22px_30px_rgba(24,18,13,0.14)]"
                                                    priority={activeIndex < 2}
                                                />
                                            </div>
                                        </m.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between gap-4 lg:min-h-0">
                                <AnimatePresence mode="wait">
                                    <m.div
                                        key={activeProject.title}
                                        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                                        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                                        transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="space-y-3"
                                    >
                                        <span className="inline-flex items-center rounded-full border border-black/6 bg-white/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                                            {activeProject.label}
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-semibold tracking-tight text-ink md:text-[1.7rem]">
                                                {activeProject.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-ink-light">
                                                {activeProject.description}
                                            </p>
                                        </div>
                                    </m.div>
                                </AnimatePresence>

                                <div className="grid gap-2.5">
                                    {activeProject.highlights.map((highlight) => (
                                        <div
                                            key={highlight}
                                            className="rounded-[18px] border border-black/6 bg-white/70 px-4 py-2.5 shadow-[0_12px_35px_-28px_rgba(24,18,13,0.3)]"
                                        >
                                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                                                Highlight
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-ink">{highlight}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <div className="rounded-[28px] border border-border/80 bg-white/70 p-3 shadow-[0_22px_80px_-38px_rgba(84,69,56,0.28)] backdrop-blur-sm lg:flex lg:h-full lg:flex-col">
                    <div className="mb-3 px-2 pt-1 lg:mb-2">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                            Browse the five systems
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-light">
                            Click or use the arrow keys to move through the active case study.
                        </p>
                    </div>

                    <div role="tablist" aria-label="Case study selector" className="grid gap-2.5 lg:flex-1 lg:auto-rows-fr">
                        {projects.map((project, index) => {
                            const selected = index === activeIndex;
                            const projectRgb = hexToRgb(project.accent);

                            return (
                                <button
                                    key={project.title}
                                    id={`${galleryId}-tab-${index}`}
                                    ref={(node) => {
                                        tabRefs.current[index] = node;
                                    }}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls={panelId}
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => setActiveIndex(index)}
                                    onKeyDown={(event) => handleKeyDown(event, index)}
                                    className={cn(
                                        'group relative overflow-hidden rounded-[24px] border text-left transition-all duration-300 ease-out',
                                        selected
                                            ? 'border-ink/12 shadow-[0_18px_38px_-28px_rgba(24,18,13,0.35)]'
                                            : 'border-border/80 hover:-translate-y-0.5 hover:border-border-dark hover:shadow-[0_16px_30px_-26px_rgba(24,18,13,0.24)]',
                                    )}
                                    style={{
                                        background: selected
                                            ? `linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(${projectRgb}, 0.12))`
                                            : 'rgba(255, 255, 255, 0.78)',
                                    }}
                                >
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        style={{
                                            background: `radial-gradient(circle at top right, rgba(${projectRgb}, 0.12), transparent 34%)`,
                                        }}
                                    />
                                    <div className="relative flex min-h-[92px] items-center gap-3 p-3.5 md:p-4 lg:h-full lg:min-h-[76px] lg:px-3.5 lg:py-3">
                                        <div className="flex w-9 shrink-0 justify-center">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                                                {PadIndex(index + 1)}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                                                {project.category}
                                            </p>
                                            <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-ink">
                                                {project.title}
                                            </h3>
                                            <p className="mt-1 text-xs leading-relaxed text-ink-light">
                                                {project.label}
                                            </p>
                                        </div>

                                        <div
                                            className="relative hidden h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-[16px] border border-black/6 md:block"
                                            style={{
                                                background: `linear-gradient(180deg, rgba(${projectRgb}, 0.12), rgba(255, 255, 255, 0.88))`,
                                            }}
                                        >
                                            <Image
                                                src={project.src}
                                                alt=""
                                                fill
                                                sizes="72px"
                                                className={cn(
                                                    'object-contain p-2 transition-transform duration-300 ease-out',
                                                    selected ? 'scale-[1.04]' : 'group-hover:scale-[1.04]',
                                                )}
                                            />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
