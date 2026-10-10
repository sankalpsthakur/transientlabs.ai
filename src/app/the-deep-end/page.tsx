import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { credits, episodes, platforms, profiles, seriesColor, showTitle, showUrl } from "./data";
import styles from "./podcast.module.css";

export const metadata: Metadata = {
  title: { absolute: showTitle },
  description: "Long-form explorations of engineering, computing and mathematics. Created and reviewed by Sankalp Thakur. A Transient Labs production.",
  authors: [{ name: "Sankalp Thakur", url: "https://github.com/sankalpsthakur" }],
  creator: "Sankalp Thakur",
  alternates: { canonical: showUrl },
  openGraph: { title: showTitle, url: showUrl, images: [{ url: "/images/the-deep-end/show-cover.jpg", width: 1200, height: 1200, alt: showTitle }] },
  twitter: { card: "summary_large_image", creator: "@sankalpsthakur", title: showTitle, images: ["/images/the-deep-end/show-cover.jpg"] },
};

export default function PodcastPage() {
  const schema = {
    "@context": "https://schema.org", "@type": "PodcastSeries", name: showTitle,
    url: showUrl, image: `${showUrl.replace("/the-deep-end", "")}/images/the-deep-end/show-cover.jpg`,
    description: metadata.description, inLanguage: "en",
    creator: { "@type": "Person", name: "Sankalp Thakur", sameAs: profiles.map(p => p.url) },
    publisher: { "@type": "Organization", name: "Transient Labs", url: "https://transientlabs.ai" },
  };
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <div className={styles.wrap}>
        <nav className={styles.nav} aria-label="Podcast navigation"><Link href="/">Transient Labs ↗</Link><a href="#episodes">The collection</a></nav>
        <section className={styles.hero} aria-labelledby="show-title">
          <div>
            <p className={styles.eyebrow}>A Transient Labs production · English</p>
            <h1 id="show-title">DEEP END<br />ERA<span className={styles.dot}>.</span></h1>
            <p className={styles.lead}>Engineering with Sankalp</p>
            <p className={styles.intro}>From distributed databases and industrial systems to the mathematics behind modern computing. Follow the ideas beneath the surface.</p>
            <p className={styles.byline}>Created and reviewed by <strong>Sankalp Thakur</strong></p>
            <div className={styles.actions}>
              {platforms.length ? platforms.map(p => <a className={styles.primary} key={p.label} href={p.url}>Listen on {p.label} ↗</a>) : <a className={styles.primary} href="#episodes">Explore the collection ↓</a>}
            </div>
            <p className={styles.status}>Available now. Listen on your preferred podcast platform.</p>
          </div>
          <Image className={styles.cover} src="/images/the-deep-end/show-cover.jpg" alt={`${showTitle} show cover, by Sankalp Thakur`} width={1200} height={1200} priority sizes="(max-width: 720px) 90vw, 40vw" />
        </section>
        <section id="episodes" className={styles.collection} aria-labelledby="collection-title">
          <div className={styles.sectionHead}><h2 id="collection-title">The collection</h2><span>Around one hour each</span></div>
          <div className={styles.episodes}>
            {episodes.map(e => <Link key={e.slug} href={`/the-deep-end/${e.slug}`} className={styles.episode} style={{ borderTopColor: seriesColor(e.episode_number) }}>
              <span className={styles.episodeNumber} style={{ color: seriesColor(e.episode_number) }}>{String(e.episode_number).padStart(2, "0")}</span>
              <span className={styles.episodeText}><span className={styles.series}>{e.series}</span><h3>{e.title}</h3><span className={styles.duration}>{Math.round(e.duration_seconds / 60)} min</span></span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </Link>)}
          </div>
        </section>
        <section className={styles.creator} aria-labelledby="creator-title">
          <div><p className={styles.eyebrow}>Behind the collection</p><h2 id="creator-title">Sankalp Thakur</h2><p>Explore the work, follow the conversation, or bring an engineering problem to Transient Labs.</p><div className={styles.profileLinks}>{profiles.map(p => <a key={p.label} href={p.url}>{p.label} ↗</a>)}<Link href="/contact">Work with Transient Labs ↗</Link></div></div>
          <aside className={styles.credits}><p className={styles.eyebrow}>Production credits & AI disclosure</p><p>{credits}</p></aside>
        </section>
        <footer className={styles.footer}><Link href="/">Transient Labs</Link><span>{showTitle}</span><a href="#show-title">Back to top ↑</a></footer>
      </div>
    </main>
  );
}
