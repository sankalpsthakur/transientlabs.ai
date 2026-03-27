import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllGlossaryTerms, getGlossaryTerm } from "@/lib/content";
import { ArticleLayout } from "@/components/layout/ArticleLayout";

interface Props {
  params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
  const terms = getAllGlossaryTerms();
  return terms.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  const post = getGlossaryTerm(term);
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
      url: `https://100xai.engineering/glossary/${term}`,
      type: "article",
    },
    alternates: {
      canonical: `https://100xai.engineering/glossary/${term}`,
    },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params;
  const post = getGlossaryTerm(term);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: post.title,
    description: post.description,
    url: `https://100xai.engineering/glossary/${term}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "AI Glossary",
      url: "https://100xai.engineering/glossary",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleLayout
        post={post}
        pageType="glossary"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Glossary", href: "/glossary" },
          { label: post.title, href: `/glossary/${term}` },
        ]}
      >
        <MDXRemote source={post.content} />
      </ArticleLayout>
    </>
  );
}
