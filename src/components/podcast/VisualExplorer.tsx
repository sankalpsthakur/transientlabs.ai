"use client";

import { useState } from "react";
import Link from "next/link";
import { EpisodeVisual } from "./EpisodeVisual";

type Entry = { episode_number: number; title: string; slug: string };
export function VisualExplorer({ episodes }: { episodes: Entry[] }) {
  const [number, setNumber] = useState(2);
  const selected = episodes.find(e => e.episode_number === number) ?? episodes[0];
  return <div>
    <label htmlFor="visual-episode" style={{ display: "block", color: "#c6c9ce", fontSize: 13, marginBottom: 10 }}>Choose an episode to explore</label>
    <select id="visual-episode" value={selected.episode_number} onChange={e => setNumber(Number(e.target.value))}
      style={{ minHeight: 48, width: "100%", background: "#15191f", color: "#f1f0ec", border: "1px solid #44505d", padding: "12px 14px", marginBottom: 22, fontSize: 14, borderRadius: 6 }}>
      {episodes.map(e => <option key={e.episode_number} value={e.episode_number}>{String(e.episode_number).padStart(2,"0")} · {e.title}</option>)}
    </select>
    <EpisodeVisual episode={selected.episode_number} slug={selected.slug} title={selected.title} />
    <Link href={`/the-deep-end/${selected.slug}`} style={{ color: "#e8ad54", fontSize: 13, display: "inline-block", marginTop: 18 }}>Open episode notes and listening links ↗</Link>
  </div>;
}
