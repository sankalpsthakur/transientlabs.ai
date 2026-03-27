import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");

export interface PostMeta {
  title: string;
  description: string;
  keywords: string | string[];
  category: string;
  type?: string;
  author: string;
  date: string;
  dateModified?: string;
  cta_text?: string;
  cta_url?: string;
  slug: string;
}

export interface Post extends PostMeta {
  content: string;
  readingTime: number;
}

function readingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

function readDir(subdir: string): Post[] {
  const dir = path.join(contentRoot, subdir);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files.map((file) => {
    const filepath = path.join(dir, file);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);
    const slug = data.slug || file.replace(/\.(mdx|md)$/, "");

    return {
      title: data.title || "",
      description: data.description || "",
      keywords: data.keywords || [],
      category: data.category || "",
      type: data.type,
      author: data.author || "Transient Labs",
      date: data.date || "2025-01-01",
      dateModified: data.dateModified || data.date || "2025-01-01",
      cta_text: data.cta_text,
      cta_url: data.cta_url,
      slug,
      content,
      readingTime: readingTime(content),
    } satisfies Post;
  });
}

function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Blog
export function getAllPosts(): Post[] {
  return sortByDate(readDir("blog"));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

// Glossary
export function getAllGlossaryTerms(): Post[] {
  return readDir("glossary").sort((a, b) => a.title.localeCompare(b.title));
}

export function getGlossaryTerm(term: string): Post | undefined {
  return getAllGlossaryTerms().find((p) => p.slug === term);
}

// Comparisons
export function getAllComparisons(): Post[] {
  return sortByDate(readDir("compare"));
}

export function getComparison(slug: string): Post | undefined {
  return getAllComparisons().find((p) => p.slug === slug);
}

// Solutions
export function getAllSolutions(): Post[] {
  return sortByDate(readDir("solutions"));
}

export function getSolution(slug: string): Post | undefined {
  return getAllSolutions().find((p) => p.slug === slug);
}
