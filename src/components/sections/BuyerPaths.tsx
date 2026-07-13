import Link from 'next/link';
import { ArrowRight, Bot, Factory } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const paths = [
  {
    eyebrow: 'Agentic product studio',
    title: 'Ship a production system in six weeks.',
    description: 'A fixed-scope senior team for product, automation, AI workflows, evals, deployment, and handoff.',
    proof: '$15,000 · 6 weeks · Production handoff',
    href: '#services',
    cta: 'Explore the product sprint',
    Icon: Bot,
    tone: 'light',
  },
  {
    eyebrow: 'Industrial energy & automation',
    title: 'Find the losses. Design the control path.',
    description: 'A site-bounded energy audit and automation assessment with safety boundaries and a four-week innovation roadmap.',
    proof: '$40,000 · 4 weeks · Audit + roadmap',
    href: '/industrial-energy-automation',
    cta: 'Explore the industrial engagement',
    Icon: Factory,
    tone: 'dark',
  },
] as const;

export function BuyerPaths() {
  return (
    <section id="buyer-paths" className="border-y border-border bg-paper-warm py-10 sm:py-12" aria-labelledby="buyer-paths-title">
      <Container>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">Choose the operating problem</p>
            <h2 id="buyer-paths-title" className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Two focused paths. One senior delivery model.</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted">Start with the engagement that matches the system you need to change.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {paths.map(({ eyebrow, title, description, proof, href, cta, Icon, tone }) => (
            <Link
              key={href}
              href={href}
              className={`group relative min-w-0 overflow-hidden rounded-[1.6rem] border p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 sm:p-7 ${
                tone === 'dark'
                  ? 'border-ink bg-ink text-paper shadow-[0_22px_50px_-35px_rgba(24,18,13,0.8)]'
                  : 'border-border bg-white text-ink shadow-[0_22px_50px_-38px_rgba(24,18,13,0.35)]'
              }`}
            >
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${tone === 'dark' ? 'text-[#9bb6ff]' : 'text-accent'}`}>{eyebrow}</p>
                  <h3 className="mt-4 max-w-[19ch] text-2xl font-semibold leading-[1.04] tracking-tight sm:text-3xl">{title}</h3>
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${tone === 'dark' ? 'border-white/15 bg-white/5' : 'border-border bg-paper-warm'}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className={`mt-5 max-w-xl text-sm leading-relaxed ${tone === 'dark' ? 'text-paper/65' : 'text-ink-light'}`}>{description}</p>
              <div className={`mt-6 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between ${tone === 'dark' ? 'border-white/12' : 'border-border'}`}>
                <span className={`font-mono text-[10px] uppercase tracking-[0.19em] ${tone === 'dark' ? 'text-paper/50' : 'text-ink-muted'}`}>{proof}</span>
                <span className="inline-flex items-center gap-2 text-sm font-medium">{cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
