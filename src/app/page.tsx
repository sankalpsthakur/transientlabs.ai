import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { getBrandAssetUrl, getSiteAssetUrl, siteBrand } from "@/lib/site-brand";

export const metadata: Metadata = {
  alternates: {
    canonical: siteBrand.siteUrl,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteBrand.siteUrl}/#organization`,
  name: siteBrand.name,
  url: siteBrand.siteUrl,
  logo: getBrandAssetUrl("lockup", "light"),
  image: getSiteAssetUrl(siteBrand.assets.social.ogDefault),
  slogan: siteBrand.tagline,
  description: `${siteBrand.descriptor}. ${siteBrand.tagline}.`,
  foundingDate: "2024",
  areaServed: ["Dubai", "Bangalore", "Global"],
  address: [
    {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressCountry: "IN",
    },
  ],
  sameAs: [
    "https://linkedin.com/company/100xai",
    "https://twitter.com/100xai",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: "English",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Product & Automation Sprint",
      price: "15000",
      priceCurrency: "USD",
      description: "Production-grade product or automation system delivered in a six-week fixed-scope sprint",
    },
    {
      "@type": "Offer",
      name: "Industrial Energy Audit & Automation",
      price: "40000",
      priceCurrency: "USD",
      description: "Four-week energy baseline, automation assessment, safety boundary, and innovation roadmap",
    },
    {
      "@type": "Offer",
      name: "SOC 2 Readiness",
      price: "3000",
      priceCurrency: "USD",
      description: "Fixed-scope readiness assessment with evidence requirements and remediation roadmap",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an AI MVP sprint?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our delivery sprint is a focused six-week engagement where we design, build, test, deploy, and hand off a production-ready AI-powered product or automation workflow.",
      },
    },
    {
      "@type": "Question",
      name: "How much does an AI MVP cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our fixed-scope Product & Automation Sprint is $15,000. SOC 2 readiness is $3,000, and the four-week Industrial Energy Audit & Automation engagement is $40,000.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build an AI MVP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The fixed Product & Automation Sprint runs for six weeks: scope and architecture, core build and integrations, then evals, hardening, deployment, and handoff.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies do you use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use modern AI and web technologies including OpenAI, Anthropic Claude, and open-source LLMs; Next.js, React, and TypeScript for frontend; Python and Node.js for backend; and cloud platforms like AWS, GCP, and Vercel for deployment. We choose the stack that best fits your product.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer post-launch support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer optional post-launch support packages covering bug fixes, performance monitoring, and feature iterations. We also provide a 2-week handoff period after delivery to ensure your team is fully onboarded.",
      },
    },
    {
      "@type": "Question",
      name: "What industries do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work with startups and founders across a wide range of industries including SaaS, fintech, healthtech, edtech, legal tech, e-commerce, and developer tools. If your idea involves AI, we can build it.",
      },
    },
    {
      "@type": "Question",
      name: "How is Transient Labs different from other AI agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike traditional agencies, we are an AI-first studio with deep technical expertise in LLMs, RAG, and AI product architecture. We operate on fixed-scope, fixed-price sprints — no scope creep, no surprise invoices. Our team has shipped AI products for funded startups globally, and we move at founder speed.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeContent />
    </>
  );
}
