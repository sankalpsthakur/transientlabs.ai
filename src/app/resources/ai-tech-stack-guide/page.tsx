import Link from 'next/link';
import type { Metadata } from 'next';
import { AITechStackGuide } from './AITechStackGuide';

export const metadata: Metadata = {
  title: 'AI Tech Stack Decision Guide — Free Interactive Tool | Transient Labs',
  description:
    'Answer 5 quick questions and get a personalized AI tech stack recommendation: LLM provider, framework, vector DB, hosting, and estimated monthly cost. Free.',
  alternates: {
    canonical: 'https://transientlabs.ai/resources/ai-tech-stack-guide',
  },
  openGraph: {
    title: 'AI Tech Stack Decision Guide — Find the Right Stack for Your AI Product',
    description:
      'Not sure which LLM, framework, or vector DB to use? Answer 5 questions and get a personalized recommendation based on your use case, scale, budget, and team.',
    url: 'https://transientlabs.ai/resources/ai-tech-stack-guide',
    siteName: 'Transient Labs',
    type: 'website',
    images: [
      {
        url: 'https://transientlabs.ai/og/ai-tech-stack-guide.png',
        width: 1200,
        height: 630,
        alt: 'AI Tech Stack Decision Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tech Stack Decision Guide — Free Interactive Tool',
    description:
      'Answer 5 questions. Get a personalized LLM provider, framework, vector DB, and hosting recommendation — plus estimated monthly cost.',
    images: ['https://transientlabs.ai/og/ai-tech-stack-guide.png'],
  },
};

export default function AITechStackGuidePage() {
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
            <li className="text-ink">AI Tech Stack Guide</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3 block">
            Free Interactive Tool
          </span>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold text-ink mb-3">
            AI Tech Stack Decision Guide
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed">
            Answer 5 quick questions about your use case, data sensitivity, scale, and budget.
            Get a personalized recommendation for LLM provider, framework, vector DB, hosting,
            and estimated monthly cost.
          </p>
        </div>

        {/* Interactive guide (client component) */}
        <AITechStackGuide />
      </main>
    </div>
  );
}
