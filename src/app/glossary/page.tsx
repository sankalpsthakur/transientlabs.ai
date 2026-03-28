import type { Metadata } from "next";
import Link from "next/link";
import { getAllGlossaryTerms } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "AI Glossary",
  description:
    "Plain-English definitions of AI, machine learning, and engineering terms. Built for founders, PMs, and engineers.",
  openGraph: {
    title: "AI Glossary | Transient Labs",
    description:
      "Plain-English definitions of AI, machine learning, and engineering terms.",
    url: "https://transientlabs.ai/glossary",
  },
  alternates: {
    canonical: "https://transientlabs.ai/glossary",
  },
};

function normalizeType(type?: string): string | null {
  if (!type) return null;
  const t = type.toLowerCase();
  if (t === "definedterm") return "Definition";
  if (t === "article") return "Guide";
  return type;
}

function normalizeCat(cat: string): string {
  const lower = cat.toLowerCase();
  if (lower === "glossary") return "Glossary";
  if (lower === "esg") return "ESG";
  if (lower === "engineering") return "Engineering";
  return cat;
}

export default function GlossaryIndex() {
  const terms = getAllGlossaryTerms();

  // Group by first letter
  const grouped: Record<string, typeof terms> = {};
  for (const term of terms) {
    const letter = term.title[0]?.toUpperCase() ?? "#";
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(term);
  }
  const letters = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a]">
      <div className="h-16" />
      <Container>
        <div className="py-16 sm:py-24 max-w-[860px]">
          <header className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#0066ff]">
              Reference
            </span>
            <h1 className="font-mono text-4xl sm:text-5xl font-bold text-[#0a0a0a] mt-3 mb-4 tracking-tight">
              AI Glossary
            </h1>
            <p className="text-lg text-[#6b7280] max-w-xl leading-relaxed">
              Plain-English definitions of AI and engineering terms — no fluff,
              no paywalls.
            </p>
          </header>

          {/* Alphabet jump nav */}
          {letters.length > 0 && (
            <nav className="flex flex-wrap gap-2 mb-14" aria-label="Alphabet navigation">
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="font-mono text-xs font-semibold w-8 h-8 flex items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280] hover:border-[#0066ff] hover:text-[#0066ff] hover:bg-[#0066ff]/5 transition-all"
                >
                  {letter}
                </a>
              ))}
            </nav>
          )}

          {/* Terms grouped by letter */}
          <div className="space-y-14">
            {letters.map((letter) => (
              <section key={letter} id={`letter-${letter}`}>
                <h2 className="font-mono text-xl font-bold text-[#0a0a0a] mb-6 pb-3 border-b-2 border-[#0a0a0a]/10 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center text-sm">
                    {letter}
                  </span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {grouped[letter].map((term) => {
                    const badge = normalizeType(term.type);
                    const catLabel = normalizeCat(term.category);
                    return (
                      <Link
                        key={term.slug}
                        href={`/glossary/${term.slug}`}
                        className="group rounded-xl border border-[#e5e7eb] bg-white p-5 hover:border-[#0066ff]/50 hover:shadow-md hover:shadow-[#0066ff]/8 transition-all"
                      >
                        {/* Badges row */}
                        <div className="flex items-center gap-2 mb-2">
                          {badge && (
                            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[#0066ff] bg-[#0066ff]/8 px-2 py-0.5 rounded">
                              {badge}
                            </span>
                          )}
                          {catLabel && catLabel.toLowerCase() !== "glossary" && (
                            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded">
                              {catLabel}
                            </span>
                          )}
                        </div>
                        <h3 className="font-mono font-semibold text-[#0a0a0a] group-hover:text-[#0066ff] transition-colors mb-1.5 leading-snug">
                          {term.title}
                        </h3>
                        <p className="text-sm text-[#6b7280] line-clamp-2 leading-relaxed">
                          {term.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
