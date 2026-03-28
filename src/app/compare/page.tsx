import type { Metadata } from "next";
import Link from "next/link";
import { getAllComparisons } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
    title: "Compare",
    description: "Detailed comparisons of AI engineering platforms, frameworks, and deployment approaches.",
    openGraph: {
        title: "Compare | Transient Labs",
        description: "Detailed comparisons of AI engineering platforms, frameworks, and deployment approaches.",
        url: "https://transientlabs.ai/compare",
    },
    alternates: {
        canonical: "https://transientlabs.ai/compare",
    },
};

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function CompareIndex() {
    const comparisons = getAllComparisons();

    return (
        <div className="min-h-screen bg-paper text-ink">
            <div className="h-16" />
            <Container>
                <div className="py-16 sm:py-24">
                    {/* Header */}
                    <header className="mb-16">
                        <span className="font-mono text-xs uppercase tracking-widest text-accent">
                            Compare
                        </span>
                        <h1 className="font-mono text-4xl sm:text-5xl font-bold text-ink mt-3 mb-4">
                            Platform & Architecture Analysis
                        </h1>
                        <p className="text-lg text-ink-muted max-w-xl">
                            In-depth evaluations of tools, frameworks, and architectural decisions to help you choose the right stack for production AI.
                        </p>
                    </header>

                    {/* Comparisons list */}
                    {comparisons.length === 0 ? (
                        <p className="text-ink-muted">No comparisons yet — check back soon.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {comparisons.map((post) => (
                                <article
                                    key={post.slug}
                                    className="bg-paper-warm border border-border group hover:border-accent hover:shadow-lg transition-all rounded-xl overflow-hidden flex flex-col"
                                >
                                    <Link
                                        href={`/compare/${post.slug}`}
                                        className="flex flex-col h-full p-6 sm:p-8"
                                    >
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            {post.category && (
                                                <span className="font-mono text-[10px] uppercase tracking-widest text-accent bg-accent/5 px-2 py-1 rounded-sm border border-accent/10">
                                                    {post.category}
                                                </span>
                                            )}
                                            <time
                                                dateTime={post.date}
                                                className="text-xs text-ink-muted"
                                            >
                                                {formatDate(post.date)}
                                            </time>
                                        </div>
                                        <h2 className="font-mono text-xl font-bold text-ink group-hover:text-accent transition-colors mb-3 leading-snug">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-ink-muted leading-relaxed line-clamp-3 mb-6 flex-grow">
                                            {post.description}
                                        </p>
                                        <div className="flex items-center text-sm font-semibold text-accent mt-auto group-hover:translate-x-1 transition-transform">
                                            Read Analysis <span className="ml-2">→</span>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
