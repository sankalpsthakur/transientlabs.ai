import Link from 'next/link';
import type { StackModule } from '@/lib/stack/content';
import type { EnterpriseBrief as EnterpriseBriefData } from '@/lib/stack/enterprise';

export function EnterpriseBrief({ module, brief }: { module: StackModule; brief: EnterpriseBriefData }) {
  return (
    <section data-enterprise-brief={module.id} className="relative overflow-hidden border-t border-white/10 bg-[#090807] px-5 py-20 md:px-8 md:py-28">
      <div aria-hidden className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid min-w-0 gap-10 border-b border-white/10 pb-12 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: module.accent }}>Enterprise decision brief</p>
            <h2 className="mt-4 max-w-[15ch] text-3xl font-semibold leading-[1.02] tracking-tight text-white md:text-5xl">From technical spectacle to an executable decision.</h2>
          </div>
          <div className="min-w-0 lg:justify-self-end">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Designed for</p>
            <p className="mt-2 text-sm text-white/65">{brief.audience}</p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78">{brief.decision}</p>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 lg:grid-cols-3">
          <article className="bg-[#0d0b0a] p-6 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">01 · Operating model</p>
            <ul className="mt-8 space-y-4">{brief.operatingModel.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/68"><span style={{ color: module.accent }}>↳</span>{item}</li>)}</ul>
          </article>
          <article className="bg-[#0d0b0a] p-6 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">02 · Decision artifacts</p>
            <ul className="mt-8 space-y-4">{brief.artifacts.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/68"><span style={{ color: module.accent }}>↳</span>{item}</li>)}</ul>
          </article>
          <article className="bg-[#0d0b0a] p-6 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">03 · Diligence questions</p>
            <ol className="mt-8 space-y-4">{brief.diligence.map((item, index) => <li key={item} className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-relaxed text-white/68"><span className="font-mono text-[10px]" style={{ color: module.accent }}>0{index + 1}</span>{item}</li>)}</ol>
          </article>
        </div>

        <div className="mt-8 grid gap-6 rounded-[1.4rem] border border-white/10 bg-white/[0.025] p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">Governance boundary</p><p className="mt-3 max-w-3xl text-xs leading-relaxed text-white/45">{brief.boundary}</p></div>
          <Link href="https://transientlabs.ai/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border px-5 text-xs font-mono uppercase tracking-[0.2em] transition-colors hover:bg-white/5" style={{ borderColor: `${module.accent}66`, color: module.accent }}>Scope a decision brief →</Link>
        </div>
      </div>
    </section>
  );
}
