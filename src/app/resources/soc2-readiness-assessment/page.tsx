import Link from 'next/link';
import type { Metadata } from "next";
import { SOC2ReadinessAssessment } from "./SOC2ReadinessAssessment";

const BASE_URL = "https://100xai.engineering";
const PAGE_PATH = "/resources/soc2-readiness-assessment";

export const metadata: Metadata = {
  title: "SOC2 Readiness Assessment — Free Interactive Tool | Transient Labs",
  description:
    "Find out how SOC2-ready your startup is. Answer 6 questions and get a readiness score, estimated timeline, cost comparison (DIY vs platform vs Transient Labs), and your top 5 priority actions.",
  alternates: {
    canonical: `${BASE_URL}${PAGE_PATH}`,
  },
  openGraph: {
    title: "SOC2 Readiness Assessment — Free Interactive Tool",
    description:
      "Answer 6 quick questions and get a personalized SOC2 readiness score, timeline, cost breakdown, and action plan. Free — no signup required to start.",
    url: `${BASE_URL}${PAGE_PATH}`,
    siteName: "Transient Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOC2 Readiness Assessment — Free Interactive Tool",
    description:
      "Answer 6 questions. Get your SOC2 readiness score, timeline, cost comparison, and top 5 actions. Free tool by Transient Labs.",
  },
};

export default function SOC2ReadinessAssessmentPage() {
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
            <li><span className="text-border-dark mx-1">/</span></li>
            <li>
              <Link href="/resources" className="hover:text-ink transition-colors">Resources</Link>
            </li>
            <li><span className="text-border-dark mx-1">/</span></li>
            <li className="text-ink">SOC2 Readiness Assessment</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3 block">
            Free Interactive Tool
          </span>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold text-ink mb-3">
            SOC2 Readiness Assessment
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed">
            Answer 6 quick questions. Get your readiness score, estimated timeline, cost
            comparison (DIY vs compliance platform vs Transient Labs), and your top 5 priority actions.
          </p>
        </div>

        {/* Interactive assessment (client component) */}
        <SOC2ReadinessAssessment />
      </main>
    </div>
  );
}
