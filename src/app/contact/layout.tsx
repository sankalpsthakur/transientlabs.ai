import type { Metadata } from "next";

const BASE_URL = "https://transientlabs.ai";

export const metadata: Metadata = {
  title: "Contact | Transient Labs",
  description:
    "Get in touch with Transient Labs. We help founders ship AI MVPs in 3 weeks. Based in Delhi and San Francisco. Email: admin@100xai.engineering",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Transient Labs",
    description:
      "Tell us about your AI project. We respond within one business day.",
    url: `${BASE_URL}/contact`,
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
