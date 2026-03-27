import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MetadataRoute } from "next";

const BASE_URL = "https://100xai.engineering";
const contentRoot = path.join(process.cwd(), "content");

function getSlugsFromDir(subdir: string): string[] {
  const dir = path.join(contentRoot, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return data.slug || file.replace(/\.(mdx|md)$/, "");
    });
}

function getDateFromDir(subdir: string, slug: string): string {
  const dir = path.join(contentRoot, subdir);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data } = matter(raw);
    const fileSlug = data.slug || file.replace(/\.(mdx|md)$/, "");
    if (fileSlug === slug) return data.date || new Date().toISOString();
  }
  return new Date().toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/glossary`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/solutions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/resources/soc2-readiness-assessment`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/resources/ai-tech-stack-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/resources/security-compliance-checklist`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/resources/csrd-readiness-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Blog posts
  const blogSlugs = getSlugsFromDir("blog");
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: getDateFromDir("blog", slug),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Compare pages
  const compareSlugs = getSlugsFromDir("compare");
  const compareRoutes: MetadataRoute.Sitemap = compareSlugs.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: getDateFromDir("compare", slug),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Glossary terms
  const glossarySlugs = getSlugsFromDir("glossary");
  const glossaryRoutes: MetadataRoute.Sitemap = glossarySlugs.map((slug) => ({
    url: `${BASE_URL}/glossary/${slug}`,
    lastModified: getDateFromDir("glossary", slug),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  // Solutions pages
  const solutionSlugs = getSlugsFromDir("solutions");
  const solutionRoutes: MetadataRoute.Sitemap = solutionSlugs.map((slug) => ({
    url: `${BASE_URL}/solutions/${slug}`,
    lastModified: getDateFromDir("solutions", slug),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...compareRoutes,
    ...glossaryRoutes,
    ...solutionRoutes,
  ];
}
