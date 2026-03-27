import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Zap, Brain, Code2, Package } from "lucide-react";

const BASE_URL = "https://100xai.engineering";

export const metadata: Metadata = {
  title: "About Us | Transient Labs",
  description:
    "Transient Labs was founded in 2024 to help founders go from idea to working AI MVP in 3 weeks. Based in Dubai and Bangalore with deep expertise in AI/ML, full-stack, and product.",
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "About Transient Labs",
    description:
      "We help founders ship working AI products in 3 weeks — not 3 months. Learn about our story, team, and mission.",
    url: `${BASE_URL}/about`,
    type: "website",
  },
};

const expertise = [
  {
    icon: Brain,
    title: "AI / ML",
    description:
      "LLM integration, RAG pipelines, fine-tuning, vector search, agentic systems, and production-grade AI infrastructure.",
  },
  {
    icon: Code2,
    title: "Full-Stack",
    description:
      "Next.js, React, Node, Python, PostgreSQL, Supabase — we own the entire stack so nothing falls through the cracks.",
  },
  {
    icon: Package,
    title: "Product",
    description:
      "We think like founders. Every build decision is weighed against user value, time-to-market, and what actually matters at MVP stage.",
  },
];

const locations = [
  {
    city: "Dubai",
    flag: "🇦🇪",
    detail: "DIFC & Business Bay — serving MENA, Europe, and global clients.",
  },
  {
    city: "Bangalore",
    flag: "🇮🇳",
    detail: "India's tech capital — deep AI/ML engineering talent, 24/7 build capacity.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="h-16" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <div className="mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
            About Us
          </span>
          <h1 className="font-mono text-4xl sm:text-5xl font-bold text-ink leading-tight mb-6">
            We build AI MVPs.{" "}
            <span className="text-accent">Fast.</span>
          </h1>
          <p className="text-lg text-ink-muted max-w-2xl leading-relaxed">
            Transient Labs was founded in 2024 with one obsession: help founders
            ship working AI products in weeks — not quarters. No 6-month roadmaps,
            no bloated teams, no guesswork. Just rapid, production-grade AI delivery.
          </p>
        </div>

        {/* Story */}
        <section className="mb-20">
          <h2 className="font-mono text-2xl font-bold text-ink mb-6">Our story</h2>
          <div className="space-y-4 text-ink-muted leading-relaxed">
            <p>
              We&apos;ve watched too many founders spend 6+ months and $100k+ building AI
              products that could have been validated in 3 weeks. The problem isn&apos;t
              ambition — it&apos;s execution infrastructure.
            </p>
            <p>
              Most agencies are too slow. Hiring in-house takes too long. Freelancers
              don&apos;t think in systems. We built Transient Labs to be the third option:
              a tight-knit team of engineers who move like founders, ship like a
              product studio, and treat your deadline as our deadline.
            </p>
            <p>
              Our flagship offer is a{" "}
              <strong className="text-ink">3-week AI MVP sprint for $4,999</strong> — a
              fixed-scope, fixed-price engagement that gets you from idea to deployed
              product. Everything from LLM integration to frontend to infrastructure is
              handled by us.
            </p>
          </div>
        </section>

        {/* Expertise */}
        <section className="mb-20">
          <h2 className="font-mono text-2xl font-bold text-ink mb-8">Team expertise</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {expertise.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="border border-border rounded-2xl p-6 bg-white"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-mono font-bold text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Locations */}
        <section className="mb-20">
          <h2 className="font-mono text-2xl font-bold text-ink mb-8">Where we are</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {locations.map(({ city, flag, detail }) => (
              <div
                key={city}
                className="border border-border rounded-2xl p-6 bg-white flex gap-4"
              >
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-mono font-bold text-ink mb-1">
                    {flag} {city}
                  </h3>
                  <p className="text-sm text-ink-muted">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="mb-20 border border-accent/30 bg-accent/5 rounded-2xl p-8 sm:p-12">
          <div className="flex items-start gap-4 mb-4">
            <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Mission
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold text-ink leading-snug">
            Every founder with a great AI idea deserves to ship it — before the window closes.
          </p>
        </section>

        {/* CTA */}
        <div className="border-t border-border pt-12 text-center">
          <p className="text-ink-muted mb-6">
            Ready to go from idea to shipped product in 3 weeks?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#services"
              className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-8 py-4 font-mono text-sm font-semibold hover:bg-ink/80 transition-colors"
            >
              See pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-border text-ink px-8 py-4 font-mono text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
