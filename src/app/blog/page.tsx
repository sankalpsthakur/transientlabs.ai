import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering insights, AI tutorials, and product lessons from the Transient Labs team.",
  openGraph: {
    title: "Blog | Transient Labs",
    description:
      "Engineering insights, AI tutorials, and product lessons from the Transient Labs team.",
    url: "https://transientlabs.ai/blog",
  },
  alternates: {
    canonical: "https://transientlabs.ai/blog",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a]">
      <div className="h-16" />
      <Container>
        <div className="py-16 sm:py-24">
          {/* Header — stays narrow */}
          <header className="mb-12 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#0066ff]">
              Blog
            </span>
            <h1 className="font-mono text-4xl sm:text-5xl font-bold text-[#0a0a0a] mt-3 mb-4 tracking-tight">
              Engineering Notes
            </h1>
            <p className="text-lg text-[#6b7280] leading-relaxed">
              Lessons from shipping AI products. Practical, opinionated, and
              based on real projects.
            </p>
          </header>

          {/* Posts — full width grid */}
          {posts.length === 0 ? (
            <p className="text-[#6b7280]">No posts yet — check back soon.</p>
          ) : (
            <BlogIndexClient posts={posts} />
          )}
        </div>
      </Container>
    </div>
  );
}
