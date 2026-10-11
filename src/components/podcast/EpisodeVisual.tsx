"use client";

import { useEffect, useRef, useState } from "react";

export function EpisodeVisual({ episode, slug, title }: { episode: number; slug: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(760);
  useEffect(() => {
    function resize(event: MessageEvent) {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== "deep-end-visual-height" || event.data?.episode !== episode) return;
      const next = event.data.height;
      if (typeof next === "number" && Number.isFinite(next)) setHeight(Math.max(380, Math.min(2000, Math.ceil(next) + 2)));
    }
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, [episode]);
  return <iframe key={episode} ref={frame} src={`/episode-visuals/${String(episode).padStart(2, "0")}-${slug}.html`}
    title={`Interactive working principle: ${title}`} loading="lazy"
    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
    style={{ display: "block", border: "1px solid #303941", borderRadius: 10, width: "100%", height, background: "#0b0d10" }} />;
}
