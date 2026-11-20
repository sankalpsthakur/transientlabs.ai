'use client';

import { useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/Motion";

/*
 * Layered platform visual: three isometric planes (product, agent runtime, data)
 * drawn as one inline SVG. Geometry lives in a 1000x1000 viewBox; layer content
 * comes from the `layers` array so the same component can be re-skinned for
 * other landing pages.
 */

type Layer = {
    id: string;
    index: string;
    name: string;
    pills: string[];
    caption: { kicker: string; text: string; edge: "back" | "front" | "surface" };
    tone: "ink" | "signal" | "deep";
    cy: number;
};

const layers: Layer[] = [
    {
        id: "product",
        index: "03",
        name: "Products & control planes",
        pills: ["Customer-facing AI products", "Ops dashboards & control planes", "Internal tools & admin"],
        caption: { kicker: "Any surface", text: "Web, mobile, internal tools", edge: "back" },
        tone: "ink",
        cy: 215,
    },
    {
        id: "runtime",
        index: "02",
        name: "Agent runtime",
        pills: ["Agent teams & tool calling", "Evals, tracing & guardrails"],
        caption: { kicker: "Any model", text: "Claude, GPT, Gemini, open-source", edge: "surface" },
        tone: "signal",
        cy: 500,
    },
    {
        id: "data",
        index: "01",
        name: "Data & integrations",
        pills: ["Grounded retrieval (RAG)", "Integrations & data pipelines", "Systems of record & telemetry"],
        caption: { kicker: "Any cloud", text: "AWS, GCP, Azure", edge: "front" },
        tone: "deep",
        cy: 785,
    },
];

// Plane geometry (viewBox units)
const CX = 625;
const W = 355; // half-width of the rhombus
const H = 197; // half-height (W * ~0.555 gives a ~29deg isometric slope)
const T = 16; // slab thickness
const ANGLE = (-Math.atan(H / W) * 180) / Math.PI;
const COLLAPSE = 120; // how far outer layers start pulled toward the middle

const tones = {
    ink: { top: ["#22385a", "#15263d"], edge: "#0b1627", stroke: "rgba(247,242,232,0.14)", pill: "#24395a", pillText: "#f7f2e8" },
    signal: { top: ["#3d66da", "#1f3f93"], edge: "#132a6b", stroke: "rgba(220,230,255,0.45)", pill: "#2c51c0", pillText: "#ffffff" },
    deep: { top: ["#1b2d48", "#101d31"], edge: "#08111e", stroke: "rgba(247,242,232,0.12)", pill: "#24395a", pillText: "#f7f2e8" },
} as const;

type Pt = [number, number];

function rhombus(cx: number, cy: number, w = W, h = H, k = 0.09): string {
    const c: Pt[] = [[cx, cy - h], [cx + w, cy], [cx, cy + h], [cx - w, cy]];
    const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const f = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    let d = "";
    c.forEach((corner, i) => {
        const prev = c[(i + 3) % 4];
        const next = c[(i + 1) % 4];
        const a = lerp(corner, prev, k);
        const b = lerp(corner, next, k);
        d += `${i === 0 ? "M" : "L"}${f(a)} Q${f(corner)} ${f(b)} `;
    });
    return `${d}Z`;
}

/** Point on a plane: u runs left corner -> top corner, v runs left corner -> bottom corner. */
function P(cy: number, u: number, v: number): Pt {
    return [CX - W + W * (u + v), cy + H * (v - u)];
}

function quad(pts: Pt[]): string {
    return `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} Z`;
}

function ProductDetail({ cy }: { cy: number }) {
    // Standing screens along the back-left edge, flat cards on the surface.
    const screens = [0.3, 0.52, 0.74];
    return (
        <g>
            {[[0.3, 0.42, 0.58, 0.72], [0.66, 0.36, 0.86, 0.56]].map(([u0, v0, u1, v1], i) => (
                <path key={i} d={quad([P(cy, u0, v0), P(cy, u1, v0), P(cy, u1, v1), P(cy, u0, v1)])} fill="rgba(247,242,232,0.07)" stroke="rgba(247,242,232,0.22)" strokeWidth={1} />
            ))}
            {[0.5, 0.56, 0.62].map((v, i) => (
                <path key={`l${i}`} d={`M${P(cy, 0.34, v).join(" ")} L${P(cy, 0.54 - i * 0.05, v).join(" ")}`} stroke="rgba(247,242,232,0.35)" strokeWidth={2} strokeLinecap="round" />
            ))}
            {screens.map((v, i) => {
                const a = P(cy, v, 0.12);
                const b = P(cy, v + 0.18, 0.12);
                const hgt = 92 - i * 8;
                return (
                    <g key={`s${i}`}>
                        <path d={quad([a, b, [b[0], b[1] - hgt], [a[0], a[1] - hgt]])} fill="#2b4268" stroke="rgba(247,242,232,0.3)" strokeWidth={1} />
                        {[0.25, 0.45, 0.65].map((t) => (
                            <path key={t} d={`M${a[0] + (b[0] - a[0]) * 0.15} ${a[1] + (b[1] - a[1]) * 0.15 - hgt * (1 - t)} L${a[0] + (b[0] - a[0]) * (0.85 - t * 0.3)} ${a[1] + (b[1] - a[1]) * (0.85 - t * 0.3) - hgt * (1 - t)}`} stroke="rgba(247,242,232,0.4)" strokeWidth={1.6} strokeLinecap="round" />
                        ))}
                    </g>
                );
            })}
            {/* small KPI tiles */}
            {[0.62, 0.74, 0.86].map((u, i) => (
                <path key={`k${i}`} d={quad([P(cy, u - 0.3, 0.8), P(cy, u - 0.21, 0.8), P(cy, u - 0.21, 0.9), P(cy, u - 0.3, 0.9)])} fill={i === 1 ? "rgba(143,168,236,0.55)" : "rgba(247,242,232,0.12)"} />
            ))}
        </g>
    );
}

function RuntimeDetail({ cy, animate }: { cy: number; animate: boolean }) {
    const nodes: Pt[] = [P(cy, 0.3, 0.3), P(cy, 0.55, 0.22), P(cy, 0.78, 0.4), P(cy, 0.5, 0.55), P(cy, 0.72, 0.7), P(cy, 0.32, 0.72)];
    const edges: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [5, 4], [2, 4]];
    return (
        <g>
            {edges.map(([a, b], i) => (
                <path
                    key={i}
                    d={`M${nodes[a].join(" ")} L${nodes[b].join(" ")}`}
                    stroke="rgba(226,234,255,0.55)"
                    strokeWidth={1.4}
                    strokeDasharray="4 7"
                    className={animate ? "platform-flow" : undefined}
                />
            ))}
            {nodes.map((n, i) => (
                <g key={`n${i}`}>
                    <circle cx={n[0]} cy={n[1]} r={i === 3 ? 22 : 13} fill="rgba(226,234,255,0.18)" />
                    <circle cx={n[0]} cy={n[1]} r={i === 3 ? 9 : 5.5} fill="#f4f7ff" />
                </g>
            ))}
            {/* stacked core at the hub */}
            {[0, 1, 2].map((i) => (
                <path key={`c${i}`} d={rhombus(nodes[3][0], nodes[3][1] - 34 - i * 9, 34, 19, 0.2)} fill={i === 2 ? "#f4f7ff" : "rgba(244,247,255,0.35)"} stroke="rgba(244,247,255,0.8)" strokeWidth={0.8} />
            ))}
        </g>
    );
}

function DataDetail({ cy }: { cy: number }) {
    const grid = [0.2, 0.4, 0.6, 0.8];
    const cylinders: [number, number][] = [[0.5, 0.72], [0.62, 0.8], [0.4, 0.86]];
    return (
        <g>
            {grid.map((t) => (
                <g key={t} stroke="rgba(247,242,232,0.13)" strokeWidth={1}>
                    <path d={`M${P(cy, t, 0.06).join(" ")} L${P(cy, t, 0.94).join(" ")}`} />
                    <path d={`M${P(cy, 0.06, t).join(" ")} L${P(cy, 0.94, t).join(" ")}`} />
                </g>
            ))}
            {/* pipes */}
            <path d={`M${P(cy, 0.2, 0.4).join(" ")} L${P(cy, 0.4, 0.4).join(" ")} L${P(cy, 0.4, 0.6).join(" ")} L${P(cy, 0.6, 0.6).join(" ")}`} fill="none" stroke="rgba(143,168,236,0.7)" strokeWidth={2} />
            {[[0.2, 0.4], [0.4, 0.6], [0.6, 0.6], [0.4, 0.4]].map(([u, v], i) => {
                const p = P(cy, u, v);
                return <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#8fa8ec" />;
            })}
            {cylinders.map(([u, v], i) => {
                const [x, y] = P(cy, u, v);
                const r = 20;
                const h = 42 - i * 6;
                return (
                    <g key={`c${i}`}>
                        <path d={`M${x - r} ${y - h} L${x - r} ${y} A${r} ${r * 0.5} 0 0 0 ${x + r} ${y} L${x + r} ${y - h} Z`} fill="#22385a" stroke="rgba(247,242,232,0.25)" strokeWidth={1} />
                        <ellipse cx={x} cy={y - h} rx={r} ry={r * 0.5} fill="#34507c" stroke="rgba(247,242,232,0.35)" strokeWidth={1} />
                    </g>
                );
            })}
            {/* document stack */}
            {[0, 1, 2].map((i) => (
                <path key={`d${i}`} d={quad([P(cy, 0.72, 0.5), P(cy, 0.86, 0.5), P(cy, 0.86, 0.64), P(cy, 0.72, 0.64)].map(([x, y]) => [x, y - i * 7] as Pt))} fill={i === 2 ? "#3a5583" : "#22385a"} stroke="rgba(247,242,232,0.25)" strokeWidth={1} />
            ))}
        </g>
    );
}

function Caption({ layer }: { layer: Layer }) {
    const { edge, kicker, text } = layer.caption;
    // back = upper-right edge (outside), front = lower-right edge (outside), surface = on the plane near its lower-right edge
    // anchor slightly toward the front corner so long captions stay on the plane
    const mid: Pt =
        edge === "back" ? [CX + W / 2, layer.cy - H / 2] : edge === "front" ? [CX + W * 0.56, layer.cy + H * 0.44] : [CX + W * 0.42, layer.cy + H * 0.58];
    const len = Math.hypot(W, H);
    // outward normals: upper-right edge points up-right, lower-right edge points down-right
    const [nx, ny] = edge === "back" ? [H / len, -W / len] : [H / len, W / len];
    const off = edge === "back" ? 16 : edge === "front" ? 34 + T : -40;
    const x = mid[0] + nx * off;
    const y = mid[1] + ny * off;
    const rot = edge === "back" ? -ANGLE : ANGLE;
    const fill = layer.tone === "signal" ? "#eef2ff" : "#15263d";
    return (
        <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(2)})`} fill={fill} style={{ fontStyle: "italic" }}>
            <text textAnchor="middle" y={edge === "back" ? -24 : 0} fontSize={14} fontWeight={500} letterSpacing="0.06em" opacity={0.7}>
                {kicker.toUpperCase()}
            </text>
            <text textAnchor="middle" y={edge === "back" ? 2 : 26} fontSize={24} fontWeight={600} letterSpacing="0.01em">
                {text}
            </text>
        </g>
    );
}

function Plane({ layer, animate }: { layer: Layer; animate: boolean }) {
    const tone = tones[layer.tone];
    const gid = `pl-grad-${layer.id}`;
    return (
        <g>
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={tone.top[0]} />
                    <stop offset="1" stopColor={tone.top[1]} />
                </linearGradient>
            </defs>
            {layer.tone === "signal" && (
                <path d={rhombus(CX, layer.cy + 10, W + 10, H + 6)} fill="#3a63d8" opacity={0.55} filter="url(#pl-glow)" className={animate ? "platform-glow" : undefined} />
            )}
            {Array.from({ length: 5 }, (_, i) => (
                <path key={i} d={rhombus(CX, layer.cy + T - (i * T) / 4)} fill={tone.edge} />
            ))}
            <path d={rhombus(CX, layer.cy)} fill={`url(#${gid})`} stroke={tone.stroke} strokeWidth={1.2} />
            {layer.id === "product" && <ProductDetail cy={layer.cy} />}
            {layer.id === "runtime" && <RuntimeDetail cy={layer.cy} animate={animate} />}
            {layer.id === "data" && <DataDetail cy={layer.cy} />}
            {layer.caption.edge === "surface" && <Caption layer={layer} />}
        </g>
    );
}

function Labels({ layer }: { layer: Layer }) {
    const tone = tones[layer.tone];
    const PH = 46;
    const GAP = 10;
    const block = layer.pills.length * PH + (layer.pills.length - 1) * GAP;
    const top = layer.cy - block / 2;
    return (
        <g className="hidden sm:inline">
            <text x={44} y={top - 20} fontSize={13} letterSpacing="0.14em" fill="#5c6b67" className="font-mono">
                {`LAYER ${layer.index}`}
            </text>
            <text x={160} y={top - 20} fontSize={19} fontWeight={600} fill={layer.tone === "signal" ? "#1f3f93" : "#15263d"}>
                {layer.name}
            </text>
            {layer.pills.map((pill, i) => {
                const y = top + i * (PH + GAP);
                return (
                    <g key={pill}>
                        <rect x={44} y={y} width={330} height={PH} rx={9} fill={tone.pill} opacity={0.94} stroke="rgba(255,255,255,0.12)" />
                        <text x={209} y={y + PH / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={500} fill={tone.pillText}>
                            {pill}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}

function Connectors() {
    // Double arrows on the right between planes, and spine lines on the left between label groups.
    const pairs: [number, number][] = [[layers[0].cy + H + T + 18, layers[1].cy + H - 20], [layers[1].cy + H + 30, layers[2].cy + H - 30]];
    return (
        <g stroke="#1f3f93" strokeWidth={1.4} fill="none" markerEnd="url(#pl-arrow)" markerStart="url(#pl-arrow)" opacity={0.75}>
            {pairs.map(([y1, y2], i) => (
                <g key={i}>
                    <path d={`M${CX + W - 70} ${y1 - 120} L${CX + W - 70} ${y2 - 120}`} />
                    <path d={`M${CX + W - 52} ${y1 - 130} L${CX + W - 52} ${y2 - 130}`} />
                </g>
            ))}
        </g>
    );
}

export function PlatformLayers() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
    const reduce = useReducedMotion();
    const [active, setActive] = useState<string | null>(null);
    const expanded = reduce || inView;

    return (
        <Section id="platform" aria-labelledby="platform-title" className="relative overflow-hidden bg-paper">
            <style>{`
                @keyframes platform-flow { to { stroke-dashoffset: -44; } }
                @keyframes platform-glow { 0%,100% { opacity: .45 } 50% { opacity: .7 } }
                .platform-flow { animation: platform-flow 2.4s linear infinite; }
                .platform-glow { animation: platform-glow 4s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { .platform-flow, .platform-glow { animation: none; } }
            `}</style>
            <Container>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16">
                    <FadeIn>
                        <p className="text-xs font-mono uppercase tracking-[0.28em] text-ink-muted">What we ship</p>
                        <h2 id="platform-title" className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl xl:text-[3.1rem] xl:leading-[1]">
                            One system, three layers.
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <p className="max-w-xl text-base leading-relaxed text-ink-light">
                            Every sprint ships the whole stack: the product people actually use, the agent runtime that does the work, and the data layer that keeps every answer grounded. You own all three at handoff.
                        </p>
                    </FadeIn>
                </div>

                <div ref={ref} className="relative mx-auto mt-6 max-w-[1040px] overflow-hidden sm:mt-10 sm:overflow-visible">
                    <svg
                        viewBox="0 0 1000 1000"
                        role="img"
                        aria-labelledby="platform-svg-title"
                        className="ml-[-26%] block h-auto w-[127%] max-w-none font-sans sm:ml-0 sm:w-full"
                    >
                        <title id="platform-svg-title">
                            Transient Labs stack: products and control planes on top of an agent runtime, on top of data and integrations.
                        </title>
                        <defs>
                            <filter id="pl-glow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="26" />
                            </filter>
                            <filter id="pl-shadow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="18" />
                            </filter>
                            <marker id="pl-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                                <path d="M1 1 L9 5 L1 9" fill="none" stroke="#1f3f93" strokeWidth="1.5" />
                            </marker>
                        </defs>

                        <path d={rhombus(CX + 10, layers[2].cy + 44, W - 10, H - 6)} fill="rgba(21,38,61,0.35)" filter="url(#pl-shadow)" />

                        {/* paint bottom -> top so upper planes occlude lower ones */}
                        {[...layers].reverse().map((layer) => {
                            const offset = layer.id === "product" ? COLLAPSE : layer.id === "data" ? -COLLAPSE : 0;
                            const dim = active && active !== layer.id;
                            return (
                                <m.g
                                    key={layer.id}
                                    initial={false}
                                    animate={{ y: expanded ? 0 : offset, opacity: dim ? 0.4 : 1 }}
                                    transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1], delay: layer.id === "product" ? 0.05 : 0 }}
                                    onMouseEnter={() => setActive(layer.id)}
                                    onMouseLeave={() => setActive(null)}
                                >
                                    <Plane layer={layer} animate={!reduce} />
                                    {layer.caption.edge !== "surface" && <Caption layer={layer} />}
                                </m.g>
                            );
                        })}

                        <m.g initial={false} animate={{ opacity: expanded ? 1 : 0 }} transition={{ duration: 0.6, delay: reduce ? 0 : 0.9 }}>
                            <Connectors />
                        </m.g>

                        {layers.map((layer) => {
                            const offset = layer.id === "product" ? COLLAPSE : layer.id === "data" ? -COLLAPSE : 0;
                            const dim = active && active !== layer.id;
                            return (
                                <m.g
                                    key={`labels-${layer.id}`}
                                    initial={false}
                                    animate={{ y: expanded ? 0 : offset, opacity: expanded ? (dim ? 0.4 : 1) : 0 }}
                                    transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
                                    onMouseEnter={() => setActive(layer.id)}
                                    onMouseLeave={() => setActive(null)}
                                >
                                    <Labels layer={layer} />
                                </m.g>
                            );
                        })}
                    </svg>
                </div>

                {/* Text version: visible on phones (where the SVG drops its labels), screen-reader only above that. */}
                <ol className="border-t border-border/80 sm:sr-only">
                    {layers.map((layer) => (
                        <li key={layer.id} className="grid grid-cols-[auto_1fr] gap-x-4 border-b border-border/80 py-4">
                            <span className="pt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">{layer.index}</span>
                            <div>
                                <p className={`text-lg font-semibold tracking-tight ${layer.tone === "signal" ? "text-accent" : "text-ink"}`}>{layer.name}</p>
                                <p className="mt-1 text-sm leading-relaxed text-ink-light">{layer.pills.join(" · ")}</p>
                                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                                    {layer.caption.kicker}: {layer.caption.text}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </Container>
        </Section>
    );
}
