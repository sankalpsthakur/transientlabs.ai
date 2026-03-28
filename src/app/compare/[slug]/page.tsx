import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllComparisons, getComparison } from "@/lib/content";
import { ArticleLayout } from "@/components/layout/ArticleLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const comparisons = getAllComparisons();
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getComparison(slug);
  if (!post) return {};

  const keywords = Array.isArray(post.keywords)
    ? post.keywords
    : post.keywords.split(",").map((k: string) => k.trim());

  return {
    title: post.title,
    description: post.description,
    keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://transientlabs.ai/compare/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://transientlabs.ai/compare/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const post = getComparison(slug);
  if (!post) notFound();

  const allComparisons = getAllComparisons();
  const related = allComparisons.filter((c) => c.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://transientlabs.ai/compare/${slug}`,
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: "Transient Labs",
    },
    publisher: {
      "@type": "Organization",
      name: "Transient Labs",
      url: "https://transientlabs.ai",
    },
    datePublished: post.date,
    url: `https://transientlabs.ai/compare/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleLayout
        post={post}
        pageType="compare"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: post.title, href: `/compare/${slug}` },
        ]}
        relatedPosts={related}
      >
        <MDXRemote source={post.content} />
      </ArticleLayout>
    </>
  );
}
