import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { siteBrand } from "@/lib/site-brand";

const faviconPath = siteBrand.assets.favicon.ico;
const appleTouchIconPath = siteBrand.assets.favicon.appleTouchIcon;
const ogImagePath = siteBrand.assets.social.ogDefault;
const twitterImagePath = siteBrand.assets.social.twitterDefault;

export const metadata: Metadata = {
  metadataBase: new URL(siteBrand.siteUrl),
  title: {
    default: `${siteBrand.name} | ${siteBrand.descriptor}`,
    template: `%s | ${siteBrand.name}`,
  },
  description:
    `${siteBrand.descriptor}. ${siteBrand.tagline}. AI-first product development for founders, operators, and teams in Dubai and Bangalore.`,
  keywords: [
    "AI MVP",
    "agent systems",
    "product studio",
    "AI product development",
    "MVP development",
    "product development",
    "startup MVP",
    "web app development",
    "mobile app development",
    "LLM integration",
    "RAG",
    "AI copilot",
    "AI agent",
    "AI evaluation",
    "AI guardrails",
    "Next.js agency",
    "React Native development",
    "Flutter development",
    "Supabase",
    "Stripe integration",
    "fractional CTO",
  ],
  authors: [{ name: siteBrand.name }],
  creator: siteBrand.name,
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: faviconPath, sizes: "any" }],
    apple: [{ url: appleTouchIconPath }],
    shortcut: [{ url: faviconPath }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteBrand.siteUrl,
    siteName: siteBrand.name,
    title: `${siteBrand.name} | ${siteBrand.descriptor}`,
    description: `${siteBrand.descriptor}. ${siteBrand.tagline}.`,
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: `${siteBrand.name} - ${siteBrand.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteBrand.name} | ${siteBrand.descriptor}`,
    description: `${siteBrand.descriptor}. ${siteBrand.tagline}.`,
    images: [twitterImagePath],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for faster resource loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <meta name="theme-color" content={siteBrand.colors.paper} />
      </head>
      <body
        className="antialiased bg-white text-black"
      >
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="lazyOnload"
            />
            <Script id="ga4-init" strategy="lazyOnload">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { send_page_view: false });
            `}</Script>
            <GoogleAnalytics measurementId={gaMeasurementId} />
          </>
        ) : null}
        <ScrollDepthTracker />
        {children}
      </body>
    </html>
  );
}
