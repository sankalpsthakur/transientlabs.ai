'use client';

import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

function SampleBlock({
    title,
    className,
    sample,
}: {
    title: string;
    className?: string;
    sample: string;
}) {
    return (
        <div className="rounded-2xl border border-border bg-white p-6">
            <div className="text-xs uppercase tracking-wide text-ink-muted mb-3">
                {title}
            </div>
            <div className={cn('text-3xl md:text-5xl leading-[1.05] tracking-tight text-ink', className)}>
                {sample}
            </div>
        </div>
    );
}

export default function FontSpecimenPage() {
    return (
        <main className="min-h-screen bg-paper py-16">
            <Container>
                <div className="max-w-3xl">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                        Signature font specimen
                    </h1>
                    <p className="mt-3 text-ink-muted leading-relaxed">
                        This page compares body text (system sans) vs our custom “100x Signature” display face.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6">
                    <SampleBlock
                        title="Body (sans)"
                        sample="Ship a production-grade AI product. In weeks, not months."
                    />
                    <SampleBlock
                        title="Signature (display)"
                        className="font-[var(--font-signature)] tracking-[-0.01em]"
                        sample="Ship a production-grade AI product. In weeks, not months."
                    />
                    <div className="rounded-2xl border border-border bg-white p-6">
                        <div className="text-xs uppercase tracking-wide text-ink-muted mb-4">
                            Glyph coverage
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-sm text-ink-muted mb-2">Sans</div>
                                <div className="text-lg text-ink leading-relaxed">
                                    ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                                    abcdefghijklmnopqrstuvwxyz<br />
                                    0123456789 . , - &apos; :
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-ink-muted mb-2">Signature</div>
                                <div className="text-lg text-ink leading-relaxed font-[var(--font-signature)]">
                                    ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                                    abcdefghijklmnopqrstuvwxyz<br />
                                    0123456789 . , - &apos; :
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}
