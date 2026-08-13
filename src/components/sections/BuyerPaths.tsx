'use client';

import Link from 'next/link';
import { ArrowRight, Factory, Landmark, Leaf } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useContactModal } from '@/lib/contact-modal-context';
import { SPRINTS, SPRINT_IDS } from '@/lib/sprints';

/**
 * Pathways + Sprints, merged. These were two sections stating the same taxonomy
 * twice: three operating problems, then the same three as purchasable sprints.
 * Each lane now carries its own Sprint CTA, and Studio sits below as secondary.
 */

const sprintById = Object.fromEntries(SPRINTS.map((s) => [s.id, s]));

const DELIVERY_FACTS = [
  { term: 'Scope', detail: 'Locked before the build starts, so it cannot drift mid-Sprint.' },
  { term: 'Guardrails', detail: 'Retrieval, evals, tracing, and cost budgets ship with the build.' },
  { term: 'Exit', detail: 'A written go / no-go. Continuing is a decision, not a default.' },
] as const;

const paths = [
  {
    id: 'plant',
    eyebrow: '01 · Plant Loop',
    title: 'The control path breaks between the floor and the ERP.',
    description:
      'PLC/SCADA → historian → MES/scheduling → ERP. We baseline the energy first, then close the loop with governed control. Named people approve. SIS still wins.',
    href: '/industrial-energy-automation',
    sprintId: SPRINT_IDS.plantLoop,
    Icon: Factory,
    tone: 'dark' as const,
  },
  {
    id: 'finance',
    eyebrow: '02 · Finance Workflows',
    title: 'The gap is not another OCR tool. It is control.',
    description:
      'Bank, AP, AR, and GL still live in spreadsheets. We map one close process, put match tiers and human gates around the ERP you already have, and leave an evidence pack management can inspect.',
    href: '/contact?lane=finance',
    sprintId: SPRINT_IDS.financeWorkflow,
    Icon: Landmark,
    tone: 'light' as const,
  },
  {
    id: 'evidence',
    eyebrow: '03 · Evidence Lens',
    title: 'Field MRV to credit-grade evidence.',
    description:
      'Kiln batches, feedstock, and site data become buyer-ready assurance, not spreadsheet theatre. Same control discipline as the plant and the ledger.',
    href: '/contact?lane=evidence',
    sprintId: SPRINT_IDS.evidenceLens,
    Icon: Leaf,
    tone: 'light' as const,
  },
] as const;

export function BuyerPaths() {
  const { open } = useContactModal();
  const studio = sprintById[SPRINT_IDS.studio];

  return (
    <section
      id="buyer-paths"
      className="border-y border-border bg-paper-warm py-12 sm:py-14"
      aria-labelledby="buyer-paths-title"
    >
      <Container>
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">Pathways</p>
            <h2
              id="buyer-paths-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              Three operating problems. Four Sprints.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted">
            Enter through the promoter, MD, or process owner. Every Sprint is bounded and
            ends in a written go / no-go.
          </p>
        </div>

        <div id="services" className="grid gap-4 lg:grid-cols-3">
          {paths.map(({ id, eyebrow, title, description, href, sprintId, Icon, tone }) => {
            const sprint = sprintById[sprintId];
            const dark = tone === 'dark';
            return (
              <div
                key={id}
                className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[1.6rem] border transition-[border-color,box-shadow] duration-200 ${
                  dark
                    ? 'border-ink bg-ink text-paper shadow-[0_22px_50px_-35px_rgba(24,18,13,0.8)]'
                    : 'border-border bg-white text-ink shadow-[0_22px_50px_-38px_rgba(24,18,13,0.35)]'
                }`}
              >
                <Link href={href} data-buyer-path={id} className="flex-1 p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p
                        className={`font-mono text-[10px] uppercase tracking-[0.25em] ${
                          dark ? 'text-[#9bb6ff]' : 'text-accent'
                        }`}
                      >
                        {eyebrow}
                      </p>
                      <h3 className="mt-4 max-w-[24ch] text-xl font-semibold leading-[1.08] tracking-tight sm:text-2xl">
                        {title}
                      </h3>
                    </div>
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
                        dark ? 'border-white/15 bg-white/5' : 'border-border bg-paper-warm'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p
                    className={`mt-5 text-sm leading-relaxed ${dark ? 'text-paper/65' : 'text-ink-light'}`}
                  >
                    {description}
                  </p>
                  <span
                    className={`mt-5 inline-flex items-center gap-2 text-xs font-medium ${
                      dark ? 'text-paper/70' : 'text-ink-muted'
                    }`}
                  >
                    How this works
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>

                <div className={`border-t px-6 py-4 sm:px-7 ${dark ? 'border-white/12' : 'border-border'}`}>
                  <div
                    className={`flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] ${
                      dark ? 'text-paper/50' : 'text-ink-muted'
                    }`}
                  >
                    <span>{sprint.title}</span>
                    <span className="shrink-0">{sprint.tempo}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {sprint.leaveBehind.map((item) => (
                      <li
                        key={item}
                        className={`flex gap-2.5 text-[13px] leading-snug ${dark ? 'text-paper/80' : 'text-ink'}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-[0.45rem] h-px w-3 shrink-0 ${dark ? 'bg-paper/30' : 'bg-ink/25'}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => open(sprint.id)}
                    className={`mt-4 flex min-h-11 w-full items-center justify-between rounded-full border px-4 py-3 text-left text-xs font-mono uppercase tracking-[0.26em] transition-colors duration-200 ${
                      dark
                        ? 'border-paper/25 bg-paper text-ink hover:bg-paper/85'
                        : 'border-ink bg-ink text-white hover:bg-ink-light'
                    }`}
                  >
                    <span>Book this Sprint</span>
                    <span aria-hidden="true" className="text-lg leading-none">
                      ›
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-[1.3rem] border border-border bg-white/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              {studio.lane} · {studio.tempo}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              <span className="font-semibold">{studio.title}.</span> {studio.summary}
            </p>
          </div>
          <button
            type="button"
            onClick={() => open(studio.id)}
            className="shrink-0 rounded-full border border-ink px-4 py-2.5 text-xs font-mono uppercase tracking-[0.22em] text-ink transition-colors duration-200 hover:bg-ink hover:text-white"
          >
            Book this Sprint
          </button>
        </div>

        {/* Absorbed from the old Advantage section, which spent a full screen
            restating these three facts around a 6-week timeline. */}
        <dl className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-3">
          {DELIVERY_FACTS.map(({ term, detail }) => (
            <div key={term} className="flex flex-col gap-1">
              <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                {term}
              </dt>
              <dd className="text-sm leading-snug text-ink">{detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
