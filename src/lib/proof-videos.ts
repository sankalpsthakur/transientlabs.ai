export interface ProofVideoMetric {
    label: string;
    value: string;
}

export interface ProofVideo {
    /** Matches the brief ID and file names, e.g. "vid-02-climitra". */
    id: string;
    /** Outcome headline shown on the card, e.g. "How Climitra runs CSRD-grade carbon ops on a lean team." */
    headline: string;
    /** Mono kicker above the headline, e.g. "CLIMITRA" or "CASE FILM". */
    kicker: string;
    /** On-camera subject, omitted for pure screen films. */
    person?: {
        name: string;
        role: string;
    };
    /** Up to three, rendered as a strip under the card (DualEntry-style). */
    metrics: ProofVideoMetric[];
    /** e.g. "90 s" — shown on the play affordance. */
    durationLabel: string;
    poster: string;
    src: string;
}

/**
 * The homepage Proof section renders exactly what is listed here and renders
 * nothing while this is empty. To publish a film: put its poster in
 * public/images/proof/ and host the master on a CDN (public/videos/* is
 * gitignored and never deploys — use an absolute URL in `src`), following
 * the filenames in docs/video-production-briefs.md, then add its entry.
 *
 * Example entry:
 * {
 *     id: "vid-02-climitra",
 *     headline: "How Climitra runs CSRD-grade carbon ops on a lean team.",
 *     kicker: "Climitra",
 *     person: { name: "Full Name", role: "Operations Lead" },
 *     metrics: [
 *         { label: "Reporting", value: "3 wks → 1 day" },
 *         { label: "Engagement", value: "6-week sprint" },
 *         { label: "Ownership", value: "100% IP" },
 *     ],
 *     durationLabel: "90 s",
 *     poster: "/images/proof/vid-02-climitra-poster.jpg",
 *     src: "/videos/proof/vid-02-climitra.mp4",
 * }
 */
export const proofVideos: ProofVideo[] = [];
