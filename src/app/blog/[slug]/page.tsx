import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { ArticleLayout } from "@/components/layout/ArticleLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const keywords = Array.isArray(post.keywords)
    ? post.keywords
    : post.keywords.split(",").map((k: string) => k.trim());

  return {
    title: post.title,
    description: post.description,
    keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://transientlabs.ai/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: keywords,
    },
    alternates: {
      canonical: `https://transientlabs.ai/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Transient Labs",
      url: "https://transientlabs.ai",
    },
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    url: `https://transientlabs.ai/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://transientlabs.ai/blog/${slug}`,
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
        pageType="blog"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${slug}` },
        ]}
        relatedPosts={related}
      >
        <MDXRemote source={post.content} />
      </ArticleLayout>
    </>
  );
}
