import Link from "next/link";
import type { Post } from "@/lib/content";
import { BlogReadTracker } from "@/components/analytics/BlogReadTracker";

interface Breadcrumb {
  label: string;
  href: string;
}

interface ArticleLayoutProps {
  post: Post;
  breadcrumbs: Breadcrumb[];
  relatedPosts?: Post[];
  children: React.ReactNode;
  pageType?: 'blog' | 'glossary' | 'compare';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleLayout({
  post,
  breadcrumbs,
  relatedPosts = [],
  children,
  pageType = 'blog',
}: ArticleLayoutProps) {
  const ctaText = post.cta_text || "Book a 15-min scope call";
  const ctaUrl = post.cta_url || "/#services";

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a]">
      <BlogReadTracker pageType={pageType} slug={post.slug} wordCount={post.readingTime ? post.readingTime * 200 : undefined} />
      {/* Header spacer */}
      <div className="h-16" />

      {/* Article hero strip — top blue accent line + category */}
      <div className="border-t-2 border-[#0066ff] bg-[#fafafa]" />

      <main className="max-w-[680px] mx-auto px-5 sm:px-6 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-[#6b7280]">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#d1d5db]">/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#0a0a0a] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#0a0a0a] truncate max-w-[200px]">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Article header */}
        <header className="mb-12 pb-10 border-b border-[#e5e7eb]">
          {post.category && (
            <span className="inline-flex items-center font-mono text-xs uppercase tracking-widest text-[#0066ff] bg-[#0066ff]/8 px-2.5 py-1 rounded mb-5">
              {post.category}
            </span>
          )}
          <h1 className="font-mono text-[1.75rem] sm:text-[2.25rem] font-bold text-[#0a0a0a] leading-[1.2] tracking-tight mb-5">
            {post.title}
          </h1>
          <p className="text-[1.0625rem] text-[#4b5563] leading-[1.75] mb-7">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
            {post.author && (
              <span className="font-medium text-[#0a0a0a]">{post.author}</span>
            )}
            {post.date && (
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            )}
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 3v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {post.readingTime} min read
            </span>
          </div>
        </header>

        {/* MDX content */}
        <article className="
          prose prose-neutral max-w-none

          /* Base text */
          prose-p:text-[#374151] prose-p:leading-[1.8] prose-p:text-[1rem]

          /* Headings — font-mono, tight tracking */
          prose-headings:font-mono prose-headings:text-[#0a0a0a] prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-[1.5rem] prose-h2:mt-12 prose-h2:mb-4 prose-h2:leading-snug
          prose-h3:text-[1.2rem] prose-h3:mt-9 prose-h3:mb-3 prose-h3:leading-snug
          prose-h4:text-[1rem] prose-h4:mt-7 prose-h4:mb-2

          /* Links */
          prose-a:text-[#0066ff] prose-a:font-medium prose-a:no-underline hover:prose-a:underline

          /* Strong / em */
          prose-strong:text-[#0a0a0a] prose-strong:font-semibold
          prose-em:italic

          /* Inline code */
          prose-code:font-mono prose-code:text-[0.85em] prose-code:bg-[#f3f4f6] prose-code:text-[#0a0a0a] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-medium

          /* Code blocks */
          prose-pre:bg-[#0d1117] prose-pre:text-[#e6edf3] prose-pre:rounded-xl prose-pre:p-5 prose-pre:shadow-lg prose-pre:border prose-pre:border-[#30363d] prose-pre:overflow-x-auto
          prose-pre:text-[0.875rem] prose-pre:leading-[1.7]

          /* Blockquote */
          prose-blockquote:border-l-4 prose-blockquote:border-[#0066ff] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-[#4b5563] prose-blockquote:bg-[#0066ff]/5 prose-blockquote:rounded-r-lg prose-blockquote:py-0.5 prose-blockquote:not-italic

          /* Lists */
          prose-ul:text-[#374151] prose-ol:text-[#374151]
          prose-li:my-1.5 prose-li:leading-[1.7]

          /* Table */
          prose-table:text-sm prose-th:font-mono prose-th:text-[#0a0a0a] prose-td:text-[#374151]
          prose-thead:border-b prose-thead:border-[#e5e7eb]
          prose-tr:border-b prose-tr:border-[#f3f4f6]

          /* HR */
          prose-hr:border-[#e5e7eb] prose-hr:my-10
        ">
          {children}
        </article>

        {/* CTA block — premium dark card */}
        <div className="mt-20 rounded-2xl bg-[#0a0a0a] p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle blue glow accent */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#0066ff] opacity-10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="font-mono text-xs uppercase tracking-widest text-[#0066ff] mb-3">
              Ready to build?
            </p>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              Book a 15-min scope call
            </h2>
            <p className="text-[#a1a1aa] text-[0.9375rem] leading-relaxed mb-7">
              We design, build, and ship AI MVPs in 3 weeks. $4,999 fixed price.
            </p>
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0066ff] px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:bg-[#0052cc] hover:shadow-lg hover:shadow-[#0066ff]/30 active:scale-[0.98]"
            >
              {ctaText} →
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-mono text-sm font-bold text-[#0a0a0a] mb-6 uppercase tracking-widest">
              Continue Reading
            </h2>
            <div className="grid gap-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex items-start gap-4 rounded-xl border border-[#e5e7eb] p-5 hover:border-[#0066ff]/40 hover:bg-white transition-all hover:shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono font-semibold text-[#0a0a0a] group-hover:text-[#0066ff] transition-colors mb-1 leading-snug">
                      {related.title}
                    </h3>
                    <p className="text-sm text-[#6b7280] line-clamp-2">
                      {related.description}
                    </p>
                  </div>
                  <span className="text-[#0066ff] opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
