import Link from 'next/link';
import type { Metadata } from 'next';
import { CSRDReadinessCalculator } from './CSRDReadinessCalculator';

const BASE_URL = 'https://100xai.engineering';

export const metadata: Metadata = {
  title: 'CSRD Compliance Readiness Calculator — Free Assessment | Transient Labs',
  description:
    'Find out if CSRD applies to your company, get your readiness score (0–100), identify your top 5 compliance gaps, and see a cost comparison — free, takes 2 minutes.',
  alternates: {
    canonical: `${BASE_URL}/resources/csrd-readiness-calculator`,
  },
  openGraph: {
    title: 'CSRD Compliance Readiness Calculator — Free Assessment',
    description:
      'Answer 5 questions. Get your CSRD applicability ruling, readiness score, top gaps to fix, and cost comparison — in-house vs consultant vs Transient Labs.',
    url: `${BASE_URL}/resources/csrd-readiness-calculator`,
    siteName: 'Transient Labs',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og/csrd-readiness-calculator.png`,
        width: 1200,
        height: 630,
        alt: 'CSRD Compliance Readiness Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSRD Compliance Readiness Calculator — Free',
    description:
      'Answer 5 questions. Get your CSRD applicability ruling, readiness score, and cost comparison.',
    images: [`${BASE_URL}/og/csrd-readiness-calculator.png`],
  },
};

export default function CSRDReadinessCalculatorPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="h-16" />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-sm text-ink-muted">
            <li><Link href="/" className="hover:text-ink transition-colors">Home</Link></li>
            <li><span className="text-border-dark mx-1">/</span></li>
            <li><Link href="/resources" className="hover:text-ink transition-colors">Resources</Link></li>
            <li><span className="text-border-dark mx-1">/</span></li>
            <li className="text-ink">CSRD Readiness Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3 block">
            Free Interactive Assessment
          </span>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold text-ink mb-3">
            CSRD Compliance Readiness Calculator
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed">
            Answer 5 quick questions. Find out if CSRD applies to your company, get your
            readiness score, your top 5 gaps to fix, and a cost comparison — in under 2 minutes.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              CSRD applicability ruling
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              Readiness score 0–100
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              Top 5 compliance gaps
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              Cost comparison
            </span>
          </div>
        </div>

        {/* Interactive calculator */}
        <CSRDReadinessCalculator />

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">Related Resources</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/solutions/esg-compliance" className="group block border border-border p-4 hover:border-accent/40 transition-colors">
              <p className="font-mono text-sm font-semibold text-ink group-hover:text-accent transition-colors">ESG Compliance Solutions</p>
              <p className="text-xs text-ink-muted mt-1">How we automate CSRD reporting end-to-end</p>
            </Link>
            <Link href="/resources/esg-checklist" className="group block border border-border p-4 hover:border-accent/40 transition-colors">
              <p className="font-mono text-sm font-semibold text-ink group-hover:text-accent transition-colors">ESG Compliance Checklist</p>
              <p className="text-xs text-ink-muted mt-1">Free 25-item pre-submission checklist</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
