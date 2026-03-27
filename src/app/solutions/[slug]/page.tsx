import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSolutions, getSolution } from "@/lib/content";
import { ArticleLayout } from "@/components/layout/ArticleLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const solutions = getAllSolutions();
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getSolution(slug);
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
      url: `https://100xai.engineering/solutions/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://100xai.engineering/solutions/${slug}`,
    },
  };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const post = getSolution(slug);
  if (!post) notFound();

  const allSolutions = getAllSolutions();
  const related = allSolutions.filter((s) => s.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://100xai.engineering/solutions/${slug}`,
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: "Transient Labs",
    },
    publisher: {
      "@type": "Organization",
      name: "Transient Labs",
      url: "https://100xai.engineering",
    },
    datePublished: post.date,
    url: `https://100xai.engineering/solutions/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleLayout
        post={post}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Solutions", href: "/solutions" },
          { label: post.title, href: `/solutions/${slug}` },
        ]}
        relatedPosts={related}
      >
        <MDXRemote source={post.content} />
      </ArticleLayout>
    </>
  );
}
