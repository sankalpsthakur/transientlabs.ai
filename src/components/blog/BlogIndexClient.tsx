'use client';

import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/content";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const CATEGORIES = ["All", "Engineering", "Security", "ESG", "Blog"];

function normalizeCategory(cat: string): string {
  const lower = cat.toLowerCase();
  if (lower === "esg compliance" || lower === "esg") return "ESG";
  if (lower === "engineering") return "Engineering";
  if (lower === "security") return "Security";
  if (lower === "blog") return "Blog";
  return cat;
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="font-mono text-xs uppercase tracking-widest text-[#0066ff] bg-[#0066ff]/8 px-2.5 py-1 rounded">
      {normalizeCategory(category)}
    </span>
  );
}

export function BlogIndexClient({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter(
          (p) => normalizeCategory(p.category) === activeCategory
        );

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-12" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-lg border transition-all ${
              activeCategory === cat
                ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                : "bg-transparent text-[#6b7280] border-[#e5e7eb] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-[#6b7280] py-8">No posts in this category yet.</p>
      )}

      {/* Featured post — hero card */}
      {featuredPost && (
        <article className="mb-10 group">
          <Link href={`/blog/${featuredPost.slug}`} className="block">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-8 sm:p-10 hover:border-[#0066ff]/40 hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {featuredPost.category && (
                  <CategoryBadge category={featuredPost.category} />
                )}
                <span className="font-mono text-xs uppercase tracking-widest text-[#6b7280] bg-[#f3f4f6] px-2 py-1 rounded">
                  Latest
                </span>
                <time dateTime={featuredPost.date} className="text-sm text-[#9ca3af]">
                  {formatDate(featuredPost.date)}
                </time>
                <span className="text-sm text-[#9ca3af]">{featuredPost.readingTime} min read</span>
              </div>
              <h2 className="font-mono text-2xl sm:text-3xl font-bold text-[#0a0a0a] group-hover:text-[#0066ff] transition-colors mb-3 leading-snug">
                {featuredPost.title}
              </h2>
              <p className="text-[#4b5563] leading-relaxed mb-5 text-base max-w-3xl">
                {featuredPost.description}
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-[#0066ff]">
                Read article <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </article>
      )}

      {/* Remaining posts — responsive 3-col grid */}
      {restPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="h-full rounded-xl border border-[#e5e7eb] bg-white p-6 hover:border-[#0066ff]/40 hover:shadow-sm transition-all flex flex-col">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {post.category && (
                      <CategoryBadge category={post.category} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <time dateTime={post.date} className="font-mono text-xs text-[#9ca3af]">
                      {formatDate(post.date)}
                    </time>
                    <span className="text-[#d1d5db]">·</span>
                    <span className="font-mono text-xs text-[#9ca3af]">{post.readingTime} min read</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-mono text-base font-bold text-[#0a0a0a] group-hover:text-[#0066ff] transition-colors mb-2 leading-snug">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-[#6b7280] leading-relaxed line-clamp-3 flex-1">
                    {post.description}
                  </p>

                  {/* CTA */}
                  <span className="inline-block mt-4 font-mono text-xs font-medium text-[#0066ff] opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
