import Link from 'next/link';
import type { Metadata } from "next";
import { AIMVPCostEstimator } from "./AIMVPCostEstimator";

export const metadata: Metadata = {
  title: "AI MVP Cost Estimator — Free Interactive Tool | Transient Labs",
  description:
    "Find out what your AI MVP would cost to build. Compare in-house hiring, freelancers, and the Transient Labs Sprint — takes 2 minutes, free.",
};

export default function AIMVPCostEstimatorPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="h-16" />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-1 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            </li>
            <li>
              <span className="text-border-dark mx-1">/</span>
            </li>
            <li>
              <a href="/resources" className="hover:text-ink transition-colors">
                Resources
              </a>
            </li>
            <li>
              <span className="text-border-dark mx-1">/</span>
            </li>
            <li className="text-ink">AI MVP Cost Estimator</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3 block">
            Free Interactive Tool
          </span>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold text-ink mb-3">
            AI MVP Cost Estimator
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed">
            Answer 4 quick questions. Get a real estimate of what your AI product would cost
            to build — in-house, via freelancers, or with our 3-week sprint.
          </p>
        </div>

        {/* Interactive estimator (client component) */}
        <AIMVPCostEstimator />
      </main>
    </div>
  );
}
