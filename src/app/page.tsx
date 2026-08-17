import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { getBrandAssetUrl, getSiteAssetUrl, siteBrand } from "@/lib/site-brand";
import { SPRINTS } from "@/lib/sprints";
import { FAQS } from "@/lib/faq";

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
  // Engagements are listed without price: fees are quoted in the working session,
  // so publishing them as structured Offers would merchandise a number we do not
  // put on the page.
  makesOffer: SPRINTS.map((sprint) => ({
    "@type": "Service",
    name: sprint.title,
    description: sprint.summary,
  })),
};

// Mirrors the rendered FAQ exactly — FAQPage markup must reflect visible content.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
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
