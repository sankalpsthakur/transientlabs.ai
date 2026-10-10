import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { audioUrls, credits, episodes, platforms, profiles, seriesColor, showTitle, showUrl } from "../data";
import styles from "../podcast.module.css";

export function generateStaticParams() { return episodes.map(e => ({ slug: e.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const episode = episodes.find(e => e.slug === slug);
  if (!episode) notFound();
  return {
    title: { absolute: `${episode.title} | ${showTitle}` }, description: episode.synopsis_draft,
    authors: [{ name: "Sankalp Thakur" }], creator: "Sankalp Thakur",
    alternates: { canonical: `${showUrl}/${slug}` },
    openGraph: { title: episode.title, url: `${showUrl}/${slug}`, images: ["/images/the-deep-end/show-cover.jpg"] },
  };
}
export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = episodes.find(e => e.slug === slug);
  if (!episode) notFound();
  const audio = audioUrls[slug];
  const schema = { "@context": "https://schema.org", "@type": "PodcastEpisode", name: episode.title,
    episodeNumber: episode.episode_number, url: `${showUrl}/${slug}`, description: episode.synopsis_draft,
    partOfSeries: { "@type": "PodcastSeries", name: showTitle, url: showUrl },
    creator: { "@type": "Person", name: "Sankalp Thakur", sameAs: profiles.map(p => p.url) },
    ...(audio ? { associatedMedia: { "@type": "AudioObject", contentUrl: audio, encodingFormat: "audio/mpeg" } } : {}),
  };
  return <main className={styles.page}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><div className={`${styles.wrap} ${styles.detail}`}>
    <nav className={styles.nav} aria-label="Episode navigation"><Link href="/the-deep-end">← Deep End Era.</Link><Link href="/">Transient Labs ↗</Link></nav>
    <article>
      <p className={styles.eyebrow} style={{ color: seriesColor(episode.episode_number) }}>Episode {String(episode.episode_number).padStart(2, "0")} · {episode.series}</p>
      <h1 className={styles.detailTitle}>{episode.title}</h1>
      <p className={styles.byline}>Sankalp Thakur · {Math.round(episode.duration_seconds / 60)} minutes</p>
      <p className={styles.lead}>{episode.synopsis_draft}</p>
      {audio ? <audio className={styles.audio} controls preload="none" src={audio} aria-label={`Listen to ${episode.title}`} /> : <p className={styles.status}>Listen to the show on your preferred podcast platform.</p>}
      <div className={styles.actions}>{platforms.map(p => <a className={styles.primary} key={p.label} href={p.url}>Listen on {p.label} ↗</a>)}</div>
      <div className={styles.detailCredits}><h2>Production credits & AI disclosure</h2><p>{credits}</p><div className={styles.profileLinks}>{profiles.map(p => <a key={p.label} href={p.url}>{p.label} ↗</a>)}</div></div>
      <Link className={styles.back} href="/the-deep-end#episodes">← Explore all episodes</Link>
    </article>
  </div></main>;
}
