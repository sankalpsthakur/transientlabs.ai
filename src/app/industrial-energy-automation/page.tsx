import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, Factory, Gauge, ShieldCheck, Workflow } from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Industrial Energy Audit & Automation Sprint | Transient Labs',
  description: 'A four-week, $40,000 industrial engagement: energy baseline, automation assessment, safety boundaries, opportunity register, and innovation roadmap.',
  alternates: { canonical: 'https://transientlabs.ai/industrial-energy-automation' },
};

const artifacts = [
  ['Energy baseline', 'Meter, tariff, equipment, operating-hours, and production-normalized view of the current state.'],
  ['Opportunity register', 'Each opportunity carries an evidence source, assumption, dependency, confidence level, and owner.'],
  ['Automation architecture', 'Signals, controls, historian or MES links, edge/cloud boundary, fail-safe behavior, and operator handoffs.'],
  ['Innovation roadmap', 'A sequenced four-week decision package: quick wins, validation pilots, capital projects, and measurement plan.'],
];

const weeks = [
  ['01', 'Baseline the site', 'Confirm boundaries, ingest bills and operating data, map major loads, and walk the process with operators.'],
  ['02', 'Trace loss and control', 'Build the energy balance, identify operating variance, and map sensing, control, and data gaps.'],
  ['03', 'Design the interventions', 'Model opportunities, define automation concepts, and review safety and operator-control boundaries.'],
  ['04', 'Make the roadmap investable', 'Prioritize by confidence, effort, dependency, and operational value; deliver the decision package.'],
];

const prerequisites = [
  '12 months of utility bills where available',
  'Interval or sub-meter data where available',
  'Equipment list, ratings, and operating schedules',
  'Production volumes or another output normalizer',
  'Site access and an operations or maintenance counterpart',
  'Known safety, network, and vendor-access constraints',
];

function IndustrialHeader() {
  return (
    <header className="border-b border-[#2f3a3a] bg-[#111616]/95 text-[#f1eee5] backdrop-blur-md">
      <Container>
        <div className="flex min-h-20 items-center justify-between gap-5">
          <Link href="/" aria-label="Transient Labs home"><BrandLogo variant="wordmark" tone="dark" className="h-5 w-auto sm:h-6" /></Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/#services" className="hidden text-sm text-[#f1eee5]/65 transition-colors hover:text-white sm:block">Pricing</Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center rounded-full bg-[#d7ff64] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#111616] transition-transform hover:-translate-y-0.5">Scope the site</Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}

export default function IndustrialEnergyAutomationPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#111616] text-[#f1eee5]">
      <IndustrialHeader />
      <main>
        <section className="relative border-b border-[#2f3a3a] py-16 sm:py-20 lg:py-24">
          <div aria-hidden className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(215,255,100,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(215,255,100,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
          <Container className="relative">
            <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,.95fr)] lg:items-center">
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#d7ff64]">Industrial energy & automation · Four-week engagement</p>
                <h1 className="mt-6 max-w-[12ch] text-[clamp(2.8rem,7vw,6.6rem)] font-semibold leading-[.86] tracking-[-.065em]">See the losses. Design the control path.</h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#f1eee5]/65 sm:text-xl">A site-bounded energy audit and industrial automation assessment that turns operating data into an evidence-ranked opportunity register and an investable innovation roadmap.</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/contact" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d7ff64] px-6 text-sm font-semibold text-[#111616]">Scope the engagement<ArrowRight className="h-4 w-4" /></Link>
                  <a href="#deliverables" className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:border-white/45">Review deliverables</a>
                </div>
                <div className="mt-9 grid max-w-2xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
                  {[["$40,000", 'Fixed scope'], ['4 weeks', 'Audit to roadmap'], ['Operator-first', 'Control boundary']].map(([value, label]) => <div key={label} className="bg-[#151c1c] p-4"><p className="text-xl font-semibold text-[#d7ff64]">{value}</p><p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">{label}</p></div>)}
                </div>
              </div>

              <div className="relative min-w-0 rounded-[2rem] border border-white/12 bg-[#151c1c]/90 p-5 shadow-[0_50px_100px_-50px_rgba(0,0,0,.9)] sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-4"><span className="font-mono text-[10px] uppercase tracking-[.24em] text-white/40">Site decision model</span><span className="h-2 w-2 rounded-full bg-[#d7ff64] shadow-[0_0_16px_#d7ff64]" /></div>
                <div className="mt-6 space-y-5">
                  {[['Meter & tariff', 82], ['Process loads', 67], ['Control signals', 54], ['Operator context', 74]].map(([label, value]) => <div key={String(label)}><div className="mb-2 flex justify-between text-xs"><span className="text-white/65">{label}</span><span className="font-mono text-[#d7ff64]">{value}% mapped</span></div><div className="h-2 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[linear-gradient(90deg,#6c833d,#d7ff64)]" style={{ width: `${value}%` }} /></div></div>)}
                </div>
                <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 text-center"><div><Gauge className="mx-auto h-5 w-5 text-[#d7ff64]"/><p className="mt-2 text-[10px] uppercase tracking-[.15em] text-white/45">Evidence</p></div><ArrowRight className="h-4 w-4 text-white/25"/><div><Workflow className="mx-auto h-5 w-5 text-[#d7ff64]"/><p className="mt-2 text-[10px] uppercase tracking-[.15em] text-white/45">Control plan</p></div></div>
                <p className="mt-4 text-xs leading-relaxed text-white/35">Illustrative engagement interface. Savings are validated from site data; no outcome is claimed before measurement.</p>
              </div>
            </div>
          </Container>
        </section>

        <section id="deliverables" className="bg-[#f1eee5] py-16 text-[#111616] sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
              <div><p className="font-mono text-[11px] uppercase tracking-[.25em] text-[#54621f]">Decision artifacts</p><h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[.98] tracking-tight sm:text-5xl">What leaves the room at week four.</h2><p className="mt-5 max-w-md leading-relaxed text-[#111616]/60">Not a generic audit PDF. A traceable package your operations, engineering, finance, and leadership teams can interrogate.</p></div>
              <div className="grid gap-3 sm:grid-cols-2">{artifacts.map(([title, body], index) => <article key={title} className="rounded-[1.5rem] border border-[#111616]/12 bg-white/55 p-5"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-[#111616]/35">0{index + 1}</span><CheckCircle2 className="h-5 w-5 text-[#65762b]" /></div><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[#111616]/58">{body}</p></article>)}</div>
            </div>
          </Container>
        </section>

        <section className="border-y border-[#2f3a3a] py-16 sm:py-20">
          <Container>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-[11px] uppercase tracking-[.25em] text-[#d7ff64]">Operating sequence</p><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Four weeks, four decisions.</h2></div><p className="max-w-lg text-sm leading-relaxed text-white/50">Weekly working reviews keep assumptions visible and stop the roadmap from becoming a consultant-only artifact.</p></div>
            <div className="grid gap-px overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/10 lg:grid-cols-4">{weeks.map(([week, title, body]) => <article key={week} className="bg-[#151c1c] p-6"><span className="font-mono text-xs text-[#d7ff64]">W{week}</span><h3 className="mt-10 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/48">{body}</p></article>)}</div>
          </Container>
        </section>

        <section className="bg-[#f1eee5] py-16 text-[#111616] sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[.25em] text-[#54621f]">Relevant delivery evidence</p>
                <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[.98] tracking-tight sm:text-5xl">Industrial work surfaces, without invented outcomes.</h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[#111616]/60">These are architecture and workflow artifacts from prior industrial delivery. We do not publish savings, uptime, or client-result claims without an attributable measurement record.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-[1.6rem] border border-[#111616]/12 bg-white/55 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#54621f]">Green hydrogen plant edge</p>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">PLC and meter signals into a governed loop.</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#111616]/60">Anonymous plant-edge pattern: S7/Modbus sensing into a cloud historian boundary, with operator-safe setpoints for an electrolyzer + BESS + solar forecast loop. No client name, no invented savings.</p>
                  <ul className="mt-6 space-y-2 border-t border-[#111616]/12 pt-5 text-sm text-[#111616]/70"><li>↳ Edge ingest and tag map</li><li>↳ Forecast → storage → electrolyzer handoff</li><li>↳ Fail-safe and override path named</li></ul>
                </article>
                <article className="rounded-[1.6rem] border border-[#111616]/12 bg-white/55 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#54621f]">Refinery automation architecture</p>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">One-way intelligence. Operator authority preserved.</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#111616]/60">A five-zone refinery concept connecting plant evidence to a governed intelligence layer. Cloud systems could watch, recommend, and advise; no action returned without explicit operator approval.</p>
                  <ul className="mt-6 space-y-2 border-t border-[#111616]/12 pt-5 text-sm text-[#111616]/70"><li>↳ Endpoint and constraint map</li><li>↳ Operator-approval boundary</li><li>↳ Pilot milestones and zone architecture</li></ul>
                </article>
                <article className="rounded-[1.6rem] border border-[#111616]/12 bg-white/55 p-6 sm:col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#54621f]">Manufacturing workflow system</p>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">From engineering change to line readiness.</h3>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#111616]/60">A governed hard-tech workflow spanning EBOM-to-MBOM handoff, ECO review, supplier impact, routing release, traveler signoff, and signed audit trails.</p>
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#111616]/12 pt-5 text-sm text-[#111616]/70"><li>↳ BOM and routing decision flow</li><li>↳ Supplier-impact evidence</li><li>↳ Line-readiness and signed traceability</li></ul>
                </article>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-[#d7ff64] py-16 text-[#111616] sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div><ShieldCheck className="h-8 w-8"/><p className="mt-7 font-mono text-[11px] uppercase tracking-[.25em]">Safety and operator control</p><h2 className="mt-4 text-4xl font-semibold leading-[.96] tracking-tight sm:text-5xl">Automation does not erase authority.</h2><p className="mt-5 max-w-xl leading-relaxed text-[#111616]/65">Every concept names the human decision owner, safe state, override path, data boundary, failure mode, and validation gate. We do not bypass OEM protections, plant safety systems, or change-control procedures.</p></div>
              <div><Factory className="h-8 w-8"/><p className="mt-7 font-mono text-[11px] uppercase tracking-[.25em]">Before kickoff</p><h2 className="mt-4 text-3xl font-semibold tracking-tight">Minimum useful inputs</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{prerequisites.map((item) => <li key={item} className="flex gap-3 border-t border-[#111616]/20 pt-3 text-sm leading-relaxed"><span aria-hidden>↳</span>{item}</li>)}</ul><p className="mt-5 text-sm text-[#111616]/60">Missing data is not hidden. We label assumptions and define the measurement needed to raise confidence.</p></div>
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-20">
          <Container>
            <div className="grid gap-8 rounded-[2rem] border border-white/12 bg-[#151c1c] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><BarChart3 className="h-7 w-7 text-[#d7ff64]"/><h2 className="mt-5 max-w-[18ch] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Start with the boundary, not a savings promise.</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">On the first call we confirm the site, decision owner, data availability, operating constraints, and whether the fixed engagement is the right fit.</p></div><Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d7ff64] px-6 text-sm font-semibold text-[#111616]">Scope the site<ArrowRight className="h-4 w-4" /></Link></div>
          </Container>
        </section>
      </main>
      <div className="bg-[#f8f2e9] text-[#18120d]"><Footer /></div>
    </div>
  );
}
