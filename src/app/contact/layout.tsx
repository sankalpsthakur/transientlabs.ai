import type { Metadata } from "next";

const BASE_URL = "https://transientlabs.ai";

export const metadata: Metadata = {
  title: "Contact | Transient Labs",
  description:
    "Get in touch with Transient Labs for a six-week product sprint, industrial energy and automation engagement, SOC 2 readiness, fractional CTO support, or custom scope. Email: hello@transientlabs.ai",
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
