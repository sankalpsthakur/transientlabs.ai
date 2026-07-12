'use client';

import Link from 'next/link';
import { modules, narrative, STACK_PATH } from '@/lib/stack/content';
import { siteBrand } from '@/lib/site-brand';

export function StackCloser() {
  return (
    <section
      id="connective"
      className="relative border-t border-white/10 bg-[#070605] px-5 py-28 md:px-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#7EA2FF]">
          Connective tissue
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          One stack. Five surfaces.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55">
          Orbit feeds bandwidth. Campuses convert power into intelligence.
          Reactors and cells keep the electrons firm and portable. Vehicles
          move the century on public streets. The product is the whole chain —
          not any single module.
        </p>

        <ul className="mx-auto mt-12 grid max-w-lg gap-2 text-left">
          {modules.map((m) => (
            <li key={m.id}>
              <Link
                href={`${STACK_PATH}/${m.slug}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: m.accent }}
                  />
                  <span className="text-sm text-white/85">{m.title}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {m.cameraLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 border-t border-white/10 pt-10">
          <p className="text-sm text-white/40">
            Built by{' '}
            <Link
              href={siteBrand.siteUrl}
              className="text-white/70 underline-offset-4 hover:underline"
            >
              {siteBrand.name}
            </Link>
            {' · '}
            {siteBrand.descriptor}
          </p>
          <p className="mt-2 font-mono text-[10px] text-white/25">
            {narrative.title} · stack.transientlabs.ai
          </p>
        </div>
      </div>
    </section>
  );
}
