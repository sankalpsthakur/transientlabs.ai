'use client';

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface ClickToPlayVideoProps {
    id: string;
    src: string;
    poster: string;
    title: string;
    durationLabel?: string;
    className?: string;
}

/**
 * Poster frame with a play affordance; swaps to a native <video> on the first
 * click so nothing is downloaded until the viewer asks for it.
 */
export function ClickToPlayVideo({ id, src, poster, title, durationLabel, className }: ClickToPlayVideoProps) {
    const [playing, setPlaying] = useState(false);
    const completedRef = useRef(false);

    const handlePlay = useCallback(() => {
        setPlaying(true);
        trackEvent('video_play', { video_id: id, video_title: title });
    }, [id, title]);

    const handleEnded = useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        trackEvent('video_complete', { video_id: id, video_title: title });
    }, [id, title]);

    return (
        <div className={`relative aspect-video overflow-hidden rounded-[1.25rem] bg-black ${className ?? ""}`}>
            {playing ? (
                <video
                    src={src}
                    poster={poster}
                    controls
                    autoPlay
                    playsInline
                    preload="none"
                    onEnded={handleEnded}
                    className="h-full w-full object-cover"
                >
                    <track kind="captions" />
                </video>
            ) : (
                <button
                    type="button"
                    onClick={handlePlay}
                    aria-label={`Play video: ${title}`}
                    className="group absolute inset-0 h-full w-full text-left"
                >
                    <Image
                        src={poster}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 44vw, 92vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,6,0)_45%,rgba(10,8,6,0.55)_100%)]" />
                    <span className="absolute bottom-4 left-4 flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105">
                            <svg viewBox="0 0 16 16" aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current">
                                <path d="M4 2.5v11l9-5.5-9-5.5z" />
                            </svg>
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white">
                            Watch{durationLabel ? ` · ${durationLabel}` : ""}
                        </span>
                    </span>
                </button>
            )}
        </div>
    );
}
