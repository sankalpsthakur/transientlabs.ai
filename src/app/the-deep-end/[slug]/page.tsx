import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { audioUrls, credits, episodes, platforms, profiles, seriesColor, showTitle, showUrl } from "../data";
import styles from "../podcast.module.css";
import Image from "next/image";
import { EpisodeVisual } from "@/components/podcast/EpisodeVisual";

export function generateStaticParams() { return episodes.map(e => ({ slug: e.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const episode = episodes.find(e => e.slug === slug);
  if (!episode) notFound();
  return {
    title: { absolute: `${episode.title} | ${showTitle}` }, description: episode.synopsis_draft,
    authors: [{ name: "Sankalp Thakur" }], creator: "Sankalp Thakur",
    alternates: { canonical: `${showUrl}/${slug}` },
    openGraph: { title: episode.title, url: `${showUrl}/${slug}`, images: [episode.cover] },
  };
}
export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = episodes.find(e => e.slug === slug);
  if (!episode) notFound();
  const audio = audioUrls[slug];
  const schema = { "@context": "https://schema.org", "@type": "PodcastEpisode", name: episode.title,
    episodeNumber: episode.episode_number, url: `${showUrl}/${slug}`, description: episode.synopsis_draft, image: `https://transientlabs.ai${episode.cover}`,
    partOfSeries: { "@type": "PodcastSeries", name: showTitle, url: showUrl },
    creator: { "@type": "Person", name: "Sankalp Thakur", sameAs: profiles.map(p => p.url) },
    ...(audio ? { associatedMedia: { "@type": "AudioObject", contentUrl: audio, encodingFormat: "audio/mpeg" } } : {}),
  };
  return <main className={styles.page}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><div className={`${styles.wrap} ${styles.detail}`}>
    <nav className={styles.nav} aria-label="Episode navigation"><Link href="/the-deep-end">← Deep End Era.</Link><Link href="/">Transient Labs ↗</Link></nav>
    <article>
      <p className={styles.eyebrow} style={{ color: seriesColor(episode.episode_number) }}>Episode {String(episode.episode_number).padStart(2, "0")} · {episode.series}</p>
      <h1 className={styles.detailTitle}>{episode.title}</h1>
      <Image className={styles.detailCover} src={episode.cover} alt={`Episode ${episode.episode_number}: ${episode.title}, by Sankalp Thakur`} width={3000} height={3000} sizes="240px" />
      <p className={styles.byline}>Sankalp Thakur · {Math.round(episode.duration_seconds / 60)} minutes</p>
      <p className={styles.lead}>{episode.synopsis_draft}</p>
      {audio ? <audio className={styles.audio} controls preload="none" src={audio} aria-label={`Listen to ${episode.title}`} /> : <p className={styles.status}>Listen to the show on your preferred podcast platform.</p>}
      <div className={styles.actions}>{platforms.map(p => <a className={styles.primary} key={p.label} href={p.url}>Listen on {p.label} ↗</a>)}</div>
      {(!("has_visual" in episode) || episode.has_visual) && <section className={styles.companion} aria-labelledby="visual-title"><p className={styles.eyebrow}>See it work</p><h2 id="visual-title">Explore the working principle</h2><EpisodeVisual episode={episode.episode_number} slug={episode.slug} title={episode.title} /></section>}
      {episode.chapters.length > 0 && <section className={styles.chapters} aria-labelledby="chapters-title"><h2 id="chapters-title">Inside this episode</h2><ol>{episode.chapters.map(c => <li key={`${c.time}-${c.title}`}><time>{c.time}</time><span>{c.title}</span></li>)}</ol></section>}
      <Link className={styles.back} href="/the-deep-end#episodes">← Explore all {episodes.length} episodes</Link>
      <div className={styles.detailCredits}><div className={styles.profileLinks}>{profiles.map(p => <a key={p.label} href={p.url}>{p.label} ↗</a>)}</div><h2>Production credits & AI disclosure</h2><p>{credits}</p></div>
    </article>
  </div></main>;
}
