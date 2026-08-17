'use client';

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";
import { ClickToPlayVideo } from "@/components/video/ClickToPlayVideo";
import { proofVideos } from "@/lib/proof-videos";

/**
 * Client testimonials and case films (see docs/video-production-briefs.md).
 * Renders nothing until proof-videos.ts lists at least one published film,
 * so it can ship ahead of the footage.
 */
export function Proof() {
    if (proofVideos.length === 0) return null;

    return (
        <Section id="proof" className="bg-ink text-paper">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
                    <FadeIn>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-paper/60">
                                On the record
                            </p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                                Clients on camera. Systems on screen.
                            </h2>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.08}>
                        <p className="max-w-2xl text-base leading-7 text-paper/70 lg:justify-self-end">
                            Real operators, real production systems, real numbers — no scripts.
                        </p>
                    </FadeIn>
                </div>

                <Stagger
                    className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2"
                    staggerDelay={0.08}
                >
                    {proofVideos.map((video) => (
                        <StaggerItem key={video.id}>
                            <article className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 md:p-5">
                                <ClickToPlayVideo
                                    id={video.id}
                                    src={video.src}
                                    poster={video.poster}
                                    title={video.headline}
                                    durationLabel={video.durationLabel}
                                />
                                <div className="flex flex-1 flex-col px-1 pt-5">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/55">
                                        {video.kicker}
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                                        {video.headline}
                                    </h3>
                                    {video.person ? (
                                        <p className="mt-2 text-sm text-paper/65">
                                            {video.person.name} · {video.person.role}
                                        </p>
                                    ) : null}
                                    {video.metrics.length > 0 ? (
                                        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 sm:grid-cols-3">
                                            {video.metrics.slice(0, 3).map((metric) => (
                                                <div key={metric.label}>
                                                    <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
                                                        {metric.label}
                                                    </dt>
                                                    <dd className="mt-1 text-base font-semibold text-paper">
                                                        {metric.value}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    ) : null}
                                </div>
                            </article>
                        </StaggerItem>
                    ))}
                </Stagger>
            </Container>
        </Section>
    );
}
