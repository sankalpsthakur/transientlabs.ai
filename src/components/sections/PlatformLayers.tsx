'use client';

import { useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/Motion";

/*
 * Layered platform visual: three isometric planes (product, agent runtime, data)
 * on a dark stage, drawn as one inline SVG (viewBox 1200 x 1080). Layer content
 * comes from the `layers` array so the component can be re-skinned for other
 * landing pages; geometry helpers (rhombus, P, box, panel) keep every detail in
 * the same isometric projection.
 */

type Layer = {
    id: "product" | "runtime" | "data";
    index: string;
    name: string;
    pills: string[];
    caption: { kicker: string; text: string; edge: "back" | "front" | "surface" };
    cy: number;
};

const layers: Layer[] = [
    {
        id: "product",
        index: "03",
        name: "Products & control planes",
        pills: ["Customer-facing AI products", "Ops dashboards & control planes", "Internal tools & admin"],
        caption: { kicker: "Any surface", text: "Web, mobile, internal tools", edge: "back" },
        cy: 245,
    },
    {
        id: "runtime",
        index: "02",
        name: "Agent runtime",
        pills: ["Agent teams & tool calling", "Evals, tracing & guardrails"],
        caption: { kicker: "Any model", text: "Claude, GPT, Gemini, open-source", edge: "surface" },
        cy: 545,
    },
    {
        id: "data",
        index: "01",
        name: "Data & integrations",
        pills: ["Grounded retrieval (RAG)", "Integrations & data pipelines", "Systems of record & telemetry"],
        caption: { kicker: "Any cloud", text: "AWS, GCP, Azure", edge: "front" },
        cy: 845,
    },
];

// ---------- geometry (viewBox units) ----------
const VB_W = 1200;
const VB_H = 1080;
const CX = 820;
const W = 360; // half-width of a plane
const H = 200; // half-height (H/W = 0.555 -> ~29deg slope)
const T = 18; // slab thickness
const SLOPE = (Math.atan(H / W) * 180) / Math.PI;
const COLLAPSE = 130;
const LEN = Math.hypot(W, H);

// ---------- palette (style guide: ink #15263D, signal #1F3F93, paper #F7F2E8) ----------
const C = {
    stage: "#0b1524",
    paper: "#f7f2e8",
    muted: "#93a19d",
    signal: "#1f3f93",
    signalHi: "#8fa8ec",
    signalBright: "#4d74ea",
    line: "rgba(247,242,232,0.16)",
    lineHi: "rgba(247,242,232,0.42)",
};

const planeTone = {
    product: { top: ["#2a4269", "#152640"], edge: ["#0f1d33", "#081221"], rim: "rgba(247,242,232,0.55)" },
    runtime: { top: ["#4d74ea", "#1f3f93"], edge: ["#1a3684", "#0f2160"], rim: "rgba(225,234,255,0.9)" },
    data: { top: ["#1f3352", "#0f1c30"], edge: ["#0b1728", "#060d18"], rim: "rgba(247,242,232,0.4)" },
} as const;

type Pt = [number, number];
const fmt = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const up = (p: Pt, h: number): Pt => [p[0], p[1] - h];

function rhombus(cx: number, cy: number, w = W, h = H, k = 0.08): string {
    const c: Pt[] = [[cx, cy - h], [cx + w, cy], [cx, cy + h], [cx - w, cy]];
    let d = "";
    c.forEach((corner, i) => {
        const a = lerp(corner, c[(i + 3) % 4], k);
        const b = lerp(corner, c[(i + 1) % 4], k);
        d += `${i === 0 ? "M" : "L"}${fmt(a)} Q${fmt(corner)} ${fmt(b)} `;
    });
    return `${d}Z`;
}

/** Front rim (left corner -> front corner -> right corner) of a rounded plane, used for the light edge. */
function frontRim(cx: number, cy: number, w = W, h = H, k = 0.08): string {
    const L: Pt = [cx - w, cy];
    const B: Pt = [cx, cy + h];
    const R: Pt = [cx + w, cy];
    return `M${fmt(lerp(L, [cx, cy - h], k))} Q${fmt(L)} ${fmt(lerp(L, B, k))} L${fmt(lerp(B, L, k))} Q${fmt(B)} ${fmt(lerp(B, R, k))} L${fmt(lerp(R, B, k))} Q${fmt(R)} ${fmt(lerp(R, [cx, cy - h], k))}`;
}

/** Point on a plane. u: left corner -> back (top) corner, v: left corner -> front (bottom) corner. */
function P(cy: number, u: number, v: number): Pt {
    return [CX - W + W * (u + v), cy + H * (v - u)];
}

const poly = (pts: Pt[]) => `M${pts.map(fmt).join(" L")} Z`;

/** Isometric box standing on a plane. */
function Box({ cy, u0, v0, u1, v1, h, top, left, right, stroke = C.line }: { cy: number; u0: number; v0: number; u1: number; v1: number; h: number; top: string; left: string; right: string; stroke?: string }) {
    const a = P(cy, u0, v0);
    const b = P(cy, u0, v1);
    const c = P(cy, u1, v1);
    const d = P(cy, u1, v0);
    return (
        <g stroke={stroke} strokeWidth={0.8} strokeLinejoin="round">
            <path d={poly([a, b, up(b, h), up(a, h)])} fill={left} />
            <path d={poly([b, c, up(c, h), up(b, h)])} fill={right} />
            <path d={poly([up(a, h), up(b, h), up(c, h), up(d, h)])} fill={top} />
        </g>
    );
}

/** Upright panel standing on the plane along the segment a->b. Children get a local mapper. */
function Panel({ a, b, h, fill, stroke = C.lineHi, children }: { a: Pt; b: Pt; h: number; fill: string; stroke?: string; children?: (at: (s: number, t: number) => Pt) => React.ReactNode }) {
    const at = (s: number, t: number): Pt => up(lerp(a, b, s), h * t);
    return (
        <g>
            <path d={poly([a, b, up(b, h), up(a, h)])} fill={fill} stroke={stroke} strokeWidth={1} strokeLinejoin="round" />
            {children?.(at)}
        </g>
    );
}

function Cylinder({ at: [x, y], r, h, body = "#22385a", lid = "#3a5888" }: { at: Pt; r: number; h: number; body?: string; lid?: string }) {
    const ry = r * 0.555;
    return (
        <g stroke={C.lineHi} strokeWidth={0.8}>
            <path d={`M${x - r} ${y - h} L${x - r} ${y} A${r} ${ry} 0 0 0 ${x + r} ${y} L${x + r} ${y - h} Z`} fill={body} />
            <path d={`M${x - r} ${y - h * 0.5} A${r} ${ry} 0 0 0 ${x + r} ${y - h * 0.5}`} fill="none" stroke="rgba(247,242,232,0.2)" />
            <ellipse cx={x} cy={y - h} rx={r} ry={ry} fill={lid} />
        </g>
    );
}

/** Text lying flat on a plane, reading along the v axis (toward the front-right). */
function FlatText({ at, children, size = 13, fill = C.paper, weight = 500 }: { at: Pt; children: React.ReactNode; size?: number; fill?: string; weight?: number }) {
    const vx = W / LEN;
    const vy = H / LEN;
    return (
        <text transform={`matrix(${vx} ${vy} ${-vx} ${vy} ${at[0]} ${at[1]})`} fontSize={size} fontWeight={weight} fill={fill} letterSpacing="0.08em" className="font-mono">
            {children}
        </text>
    );
}

// ---------- layer illustrations ----------

function ProductScene({ cy }: { cy: number }) {
    return (
        <g>
            {/* faint surface grid */}
            {[0.25, 0.5, 0.75].map((t) => (
                <g key={t} stroke="rgba(247,242,232,0.05)">
                    <path d={`M${fmt(P(cy, t, 0.04))} L${fmt(P(cy, t, 0.96))}`} />
                    <path d={`M${fmt(P(cy, 0.04, t))} L${fmt(P(cy, 0.96, t))}`} />
                </g>
            ))}

            {/* dashboard wall along the back edge: KPIs, bars, a trend line */}
            <Panel a={P(cy, 0.42, 0.1)} b={P(cy, 0.92, 0.1)} h={118} fill="#1c3050">
                {(at) => (
                    <g>
                        <path d={poly([at(0.04, 0.9), at(0.96, 0.9), at(0.96, 0.97), at(0.04, 0.97)])} fill="rgba(247,242,232,0.08)" />
                        {[0.06, 0.24, 0.42].map((s, i) => (
                            <g key={s}>
                                <path d={poly([at(s, 0.58), at(s + 0.15, 0.58), at(s + 0.15, 0.84), at(s, 0.84)])} fill={i === 1 ? "rgba(143,168,236,0.45)" : "rgba(247,242,232,0.1)"} stroke="rgba(247,242,232,0.18)" strokeWidth={0.6} />
                                <path d={`M${fmt(at(s + 0.025, 0.74))} L${fmt(at(s + 0.1, 0.74))}`} stroke="rgba(247,242,232,0.7)" strokeWidth={2.2} strokeLinecap="round" />
                            </g>
                        ))}
                        {[0.32, 0.5, 0.4, 0.62, 0.48, 0.7].map((v, i) => (
                            <path key={i} d={poly([at(0.08 + i * 0.065, 0.1), at(0.12 + i * 0.065, 0.1), at(0.12 + i * 0.065, 0.1 + v * 0.62), at(0.08 + i * 0.065, 0.1 + v * 0.62)])} fill={i === 5 ? C.signalHi : "rgba(247,242,232,0.32)"} />
                        ))}
                        <path
                            d={`M${[0.08, 0.3, 0.42, 0.6, 0.78, 0.94].map((s, i) => fmt(at(0.52 + s * 0.44, [0.18, 0.34, 0.28, 0.5, 0.44, 0.7][i]))).join(" L")}`}
                            fill="none"
                            stroke={C.signalHi}
                            strokeWidth={2}
                            strokeLinejoin="round"
                        />
                        <path d={poly([at(0.62, 0.58), at(0.96, 0.58), at(0.96, 0.84), at(0.62, 0.84)])} fill="rgba(247,242,232,0.06)" stroke="rgba(247,242,232,0.18)" strokeWidth={0.6} />
                        {[0.66, 0.72].map((t) => (
                            <path key={t} d={`M${fmt(at(0.66, t))} L${fmt(at(0.9 - (t - 0.66) * 3, t))}`} stroke="rgba(247,242,232,0.5)" strokeWidth={1.6} strokeLinecap="round" />
                        ))}
                    </g>
                )}
            </Panel>

            {/* laptop */}
            <path d={poly([P(cy, 0.36, 0.42), P(cy, 0.36, 0.64), P(cy, 0.2, 0.64), P(cy, 0.2, 0.42)])} fill="#33507e" stroke={C.lineHi} strokeWidth={0.8} />
            {[0.25, 0.29, 0.33].map((u) => (
                <path key={u} d={`M${fmt(P(cy, u, 0.45))} L${fmt(P(cy, u, 0.61))}`} stroke="rgba(247,242,232,0.18)" strokeWidth={1.4} strokeDasharray="2 3" />
            ))}
            <Panel a={P(cy, 0.36, 0.42)} b={P(cy, 0.36, 0.64)} h={62} fill="#24406b">
                {(at) => (
                    <g>
                        <path d={poly([at(0.06, 0.1), at(0.94, 0.1), at(0.94, 0.9), at(0.06, 0.9)])} fill="#e9eefc" opacity={0.92} />
                        <path d={poly([at(0.06, 0.74), at(0.94, 0.74), at(0.94, 0.9), at(0.06, 0.9)])} fill={C.signal} />
                        {[0.58, 0.44, 0.3].map((t, i) => (
                            <path key={t} d={`M${fmt(at(0.14, t))} L${fmt(at(0.84 - i * 0.18, t))}`} stroke="#5f73a8" strokeWidth={2.2} strokeLinecap="round" />
                        ))}
                        <circle cx={at(0.8, 0.44)[0]} cy={at(0.8, 0.44)[1]} r={4} fill={C.signalBright} />
                    </g>
                )}
            </Panel>

            {/* phone */}
            <Panel a={P(cy, 0.2, 0.78)} b={P(cy, 0.2, 0.87)} h={58} fill="#0f1b2e">
                {(at) => (
                    <g>
                        <path d={poly([at(0.12, 0.08), at(0.88, 0.08), at(0.88, 0.92), at(0.12, 0.92)])} fill="#e9eefc" opacity={0.92} />
                        <path d={poly([at(0.2, 0.62), at(0.8, 0.62), at(0.8, 0.82), at(0.2, 0.82)])} fill={C.signalBright} />
                        <path d={`M${fmt(at(0.22, 0.42))} L${fmt(at(0.75, 0.42))} M${fmt(at(0.22, 0.28))} L${fmt(at(0.6, 0.28))}`} stroke="#5f73a8" strokeWidth={2} strokeLinecap="round" />
                    </g>
                )}
            </Panel>

            {/* flat admin cards with status chips */}
            {[0.5, 0.66].map((u, i) => (
                <g key={u}>
                    <path d={poly([P(cy, u, 0.5), P(cy, u + 0.12, 0.5), P(cy, u + 0.12, 0.78), P(cy, u, 0.78)])} fill="rgba(247,242,232,0.07)" stroke="rgba(247,242,232,0.22)" strokeWidth={0.8} />
                    <path d={poly([P(cy, u + 0.03, 0.54), P(cy, u + 0.09, 0.54), P(cy, u + 0.09, 0.6), P(cy, u + 0.03, 0.6)])} fill={i === 0 ? C.signalHi : "rgba(247,242,232,0.35)"} />
                    <path d={`M${fmt(P(cy, u + 0.06, 0.64))} L${fmt(P(cy, u + 0.06, 0.74))}`} stroke="rgba(247,242,232,0.35)" strokeWidth={2} strokeLinecap="round" />
                </g>
            ))}
            {/* gauge */}
            <ellipse cx={P(cy, 0.78, 0.82)[0]} cy={P(cy, 0.78, 0.82)[1]} rx={30} ry={16.6} fill="none" stroke="rgba(247,242,232,0.25)" strokeWidth={5} />
            <path d={`M${P(cy, 0.78, 0.82)[0] - 30} ${P(cy, 0.78, 0.82)[1]} A30 16.6 0 0 1 ${P(cy, 0.78, 0.82)[0] + 18} ${P(cy, 0.78, 0.82)[1] - 13.3}`} fill="none" stroke={C.signalHi} strokeWidth={5} strokeLinecap="round" />
        </g>
    );
}

function RuntimeScene({ cy, animate }: { cy: number; animate: boolean }) {
    const core = P(cy, 0.48, 0.56);
    const agents: { at: [number, number]; label: string }[] = [
        { at: [0.62, 0.3], label: "PLAN" },
        { at: [0.74, 0.7], label: "ACT" },
        { at: [0.3, 0.4], label: "RETRIEVE" },
        { at: [0.3, 0.8], label: "EVALUATE" },
    ];
    return (
        <g>
            {/* circuit traces */}
            {[0.16, 0.84].map((t) => (
                <g key={t} stroke="rgba(225,234,255,0.14)" strokeWidth={1}>
                    <path d={`M${fmt(P(cy, t, 0.08))} L${fmt(P(cy, t, 0.92))}`} />
                    <path d={`M${fmt(P(cy, 0.08, t))} L${fmt(P(cy, 0.92, t))}`} />
                </g>
            ))}
            {/* orbit */}
            <ellipse cx={core[0]} cy={core[1]} rx={118} ry={65.5} fill="none" stroke="rgba(225,234,255,0.35)" strokeWidth={1.2} strokeDasharray="2 6" className={animate ? "platform-flow" : undefined} />
            <ellipse cx={core[0]} cy={core[1]} rx={70} ry={38.8} fill="rgba(225,234,255,0.08)" stroke="rgba(225,234,255,0.25)" />
            {/* links agent -> core */}
            {agents.map(({ at: [u, v] }, i) => {
                const p = P(cy, u, v);
                return (
                    <path key={i} d={`M${fmt(p)} L${fmt(core)}`} stroke="rgba(240,245,255,0.75)" strokeWidth={1.6} strokeDasharray="5 7" className={animate ? "platform-flow" : undefined} />
                );
            })}
            {/* agent chips */}
            {agents.map(({ at: [u, v], label }) => (
                <g key={label}>
                    <Box cy={cy} u0={u - 0.05} v0={v - 0.05} u1={u + 0.05} v1={v + 0.05} h={14} top="#f2f5ff" left="#9db3f2" right="#c3d2fb" stroke="rgba(255,255,255,0.6)" />
                    <circle cx={P(cy, u, v)[0]} cy={P(cy, u, v)[1] - 14} r={3.2} fill={C.signal} />
                    <FlatText at={P(cy, u - 0.085, v - 0.05)} size={12} fill="#eef2ff">
                        {label}
                    </FlatText>
                </g>
            ))}
            {/* orchestrator core: stacked glowing tiles */}
            <path d={rhombus(core[0], core[1] - 8, 52, 29, 0.22)} fill="#ffffff" opacity={0.35} filter="url(#pl-soft)" />
            {[0, 1, 2].map((i) => (
                <path key={i} d={rhombus(core[0], core[1] - 10 - i * 11, 44, 24.4, 0.22)} fill={i === 2 ? "#ffffff" : "rgba(240,245,255,0.45)"} stroke="rgba(255,255,255,0.9)" strokeWidth={1} />
            ))}
            <path d={`M${core[0] - 12} ${core[1] - 32} L${core[0] + 12} ${core[1] - 32} M${core[0]} ${core[1] - 38.6} L${core[0]} ${core[1] - 25.4}`} stroke={C.signal} strokeWidth={3} strokeLinecap="round" />
        </g>
    );
}

function DataScene({ cy }: { cy: number }) {
    return (
        <g>
            {[0.2, 0.4, 0.6, 0.8].map((t) => (
                <g key={t} stroke="rgba(247,242,232,0.08)">
                    <path d={`M${fmt(P(cy, t, 0.04))} L${fmt(P(cy, t, 0.96))}`} />
                    <path d={`M${fmt(P(cy, 0.04, t))} L${fmt(P(cy, 0.96, t))}`} />
                </g>
            ))}
            {/* pipelines */}
            <path
                d={`M${fmt(P(cy, 0.22, 0.86))} L${fmt(P(cy, 0.22, 0.62))} L${fmt(P(cy, 0.46, 0.62))} L${fmt(P(cy, 0.46, 0.84))} M${fmt(P(cy, 0.46, 0.62))} L${fmt(P(cy, 0.72, 0.62))} L${fmt(P(cy, 0.72, 0.84))}`}
                fill="none"
                stroke={C.signalHi}
                strokeWidth={2.4}
                strokeLinejoin="round"
                opacity={0.85}
            />
            {[[0.22, 0.62], [0.46, 0.62], [0.72, 0.62]].map(([u, v]) => {
                const p = P(cy, u, v);
                return <circle key={u} cx={p[0]} cy={p[1]} r={4.5} fill={C.signalHi} />;
            })}

            {/* server racks */}
            {[0, 1, 2].map((i) => {
                const u0 = 0.1 + i * 0.1;
                return (
                    <g key={i}>
                        <Box cy={cy} u0={u0} v0={0.5} u1={u0 + 0.075} v1={0.62} h={58} top="#3a5888" left="#1a2c48" right="#233a5e" />
                        {[0.2, 0.42, 0.64].map((t) => {
                            const p = up(P(cy, u0, 0.62), 58 * (1 - t) - 6);
                            const q = up(P(cy, u0 + 0.075, 0.62), 58 * (1 - t) - 6);
                            return <path key={t} d={`M${fmt(lerp(p, q, 0.2))} L${fmt(lerp(p, q, 0.8))}`} stroke="rgba(247,242,232,0.3)" strokeWidth={1.4} />;
                        })}
                        <circle cx={up(P(cy, u0 + 0.06, 0.62), 48)[0]} cy={up(P(cy, u0 + 0.06, 0.62), 48)[1]} r={2.2} fill={i === 1 ? "#7ee0b0" : C.signalHi} />
                    </g>
                );
            })}

            {/* databases */}
            <Cylinder at={P(cy, 0.46, 0.84)} r={22} h={46} />
            <Cylinder at={P(cy, 0.58, 0.9)} r={18} h={34} />

            {/* document stack (knowledge for retrieval) */}
            {[0, 1, 2, 3].map((i) => (
                <path key={i} d={poly([P(cy, 0.72, 0.8), P(cy, 0.86, 0.8), P(cy, 0.86, 0.92), P(cy, 0.72, 0.92)].map((p) => up(p, 6 + i * 6)))} fill={i === 3 ? "#e9eefc" : "#2b4570"} stroke="rgba(247,242,232,0.35)" strokeWidth={0.8} />
            ))}
            {[0.84, 0.88].map((v) => (
                <path key={v} d={`M${fmt(up(P(cy, 0.76, v), 24))} L${fmt(up(P(cy, 0.82, v), 24))}`} stroke="#5f73a8" strokeWidth={1.6} strokeLinecap="round" />
            ))}

            {/* plant + sensor (telemetry) */}
            <Box cy={cy} u0={0.14} v0={0.8} u1={0.3} v1={0.92} h={30} top="#3a5888" left="#1a2c48" right="#233a5e" />
            <Cylinder at={P(cy, 0.27, 0.84)} r={6} h={58} body="#2b4570" lid="#4a6aa0" />
            <circle cx={up(P(cy, 0.2, 0.86), 44)[0]} cy={up(P(cy, 0.2, 0.86), 44)[1]} r={3} fill="#7ee0b0" />
        </g>
    );
}

// ---------- captions, labels, beams ----------

function Caption({ layer }: { layer: Layer }) {
    const { edge, kicker, text } = layer.caption;
    // back = outside the upper-right edge; front = outside the lower-right edge; surface = on the plane near its lower-right edge.
    const mid: Pt =
        edge === "back" ? [CX + W * 0.5, layer.cy - H * 0.5] : edge === "front" ? [CX + W * 0.55, layer.cy + H * 0.45] : [CX + W * 0.42, layer.cy + H * 0.58];
    const [nx, ny] = edge === "back" ? [H / LEN, -W / LEN] : [H / LEN, W / LEN];
    const off = edge === "back" ? 18 : edge === "front" ? 30 + T : -38;
    const x = mid[0] + nx * off;
    const y = mid[1] + ny * off;
    const rot = edge === "back" ? SLOPE : -SLOPE;
    const isSurface = edge === "surface";
    return (
        <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(2)})`} style={{ fontStyle: "italic" }}>
            <text textAnchor="middle" y={edge === "back" ? -26 : 0} fontSize={13} fontWeight={500} letterSpacing="0.16em" fill={isSurface ? "#dbe4ff" : C.muted} className="font-mono">
                {kicker.toUpperCase()}
            </text>
            <text textAnchor="middle" y={edge === "back" ? 2 : 28} fontSize={25} fontWeight={600} fill={isSurface ? "#ffffff" : C.paper}>
                {text}
            </text>
        </g>
    );
}

function Plane({ layer, active, animate }: { layer: Layer; active: boolean; animate: boolean }) {
    const tone = planeTone[layer.id];
    const { cy } = layer;
    return (
        <g>
            <defs>
                <linearGradient id={`pl-top-${layer.id}`} x1="0.1" y1="0" x2="0.75" y2="1">
                    <stop offset="0" stopColor={tone.top[0]} />
                    <stop offset="1" stopColor={tone.top[1]} />
                </linearGradient>
                <linearGradient id={`pl-edge-${layer.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={tone.edge[0]} />
                    <stop offset="1" stopColor={tone.edge[1]} />
                </linearGradient>
                <linearGradient id={`pl-rim-${layer.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={tone.rim} stopOpacity={0.15} />
                    <stop offset="0.5" stopColor={tone.rim} stopOpacity={1} />
                    <stop offset="1" stopColor={tone.rim} stopOpacity={0.25} />
                </linearGradient>
            </defs>
            {layer.id === "runtime" && (
                <path d={rhombus(CX, cy + 14, W + 30, H + 18)} fill={C.signalBright} opacity={0.6} filter="url(#pl-glow)" className={animate ? "platform-glow" : undefined} />
            )}
            {Array.from({ length: 6 }, (_, i) => (
                <path key={i} d={rhombus(CX, cy + T - (i * T) / 5)} fill={`url(#pl-edge-${layer.id})`} />
            ))}
            <path d={frontRim(CX, cy + T)} fill="none" stroke={`url(#pl-rim-${layer.id})`} strokeWidth={1.2} opacity={0.5} />
            <path d={rhombus(CX, cy)} fill={`url(#pl-top-${layer.id})`} />
            <path d={frontRim(CX, cy)} fill="none" stroke={`url(#pl-rim-${layer.id})`} strokeWidth={active ? 2.4 : 1.4} style={{ transition: "stroke-width .4s" }} />
            <path d={rhombus(CX, cy)} fill="none" stroke="rgba(255,255,255,0.08)" />
            {layer.id === "product" && <ProductScene cy={cy} />}
            {layer.id === "runtime" && <RuntimeScene cy={cy} animate={animate} />}
            {layer.id === "data" && <DataScene cy={cy} />}
            {layer.caption.edge === "surface" && <Caption layer={layer} />}
        </g>
    );
}

function Labels({ layer }: { layer: Layer }) {
    const PH = 46;
    const GAP = 10;
    const PX = 300;
    const PW = 330;
    const block = layer.pills.length * PH + (layer.pills.length - 1) * GAP;
    const top = layer.cy - block / 2;
    const isRuntime = layer.id === "runtime";
    const nameLines = layer.name.split(" & ");
    return (
        <g className="hidden md:inline">
            <text x={270} y={layer.cy - 30} textAnchor="end" fontSize={12} letterSpacing="0.2em" fill={C.muted} className="font-mono">
                {`LAYER ${layer.index}`}
            </text>
            {nameLines.map((line, i) => (
                <text key={line} x={270} y={layer.cy + 2 + i * 30} textAnchor="end" fontSize={26} fontWeight={600} letterSpacing="-0.01em" fill={isRuntime ? C.signalHi : C.paper}>
                    {i === 0 && nameLines.length > 1 ? `${line} &` : line}
                </text>
            ))}
            {layer.pills.map((pill, i) => {
                const y = top + i * (PH + GAP);
                return (
                    <g key={pill}>
                        <rect x={PX} y={y} width={PW} height={PH} rx={10} fill={isRuntime ? "rgba(77,116,234,0.88)" : "rgba(42,63,96,0.82)"} stroke={isRuntime ? "rgba(225,234,255,0.6)" : "rgba(247,242,232,0.22)"} />
                        <rect x={PX + 1} y={y + 1} width={PW - 2} height={PH / 2} rx={9} fill="rgba(255,255,255,0.05)" />
                        <circle cx={PX + 22} cy={y + PH / 2} r={3.5} fill={isRuntime ? "#ffffff" : C.signalHi} />
                        <text x={PX + 38} y={y + PH / 2 + 6} fontSize={17} fontWeight={500} fill={C.paper}>
                            {pill}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}

/** Light beams carrying data up through the stack. `pair` picks data->runtime ("lower") or runtime->product ("upper"). */
function Beams({ pair, animate }: { pair: "lower" | "upper"; animate: boolean }) {
    const [top, mid, bottom] = layers;
    // x positions sit in the right half, where the planes leave a visible gap between them
    const all = [
        { pair: "lower", x: CX + W * 0.3, from: bottom.cy + 30, to: mid.cy + H * 0.7 + T, delay: 0 },
        { pair: "lower", x: CX + W * 0.52, from: bottom.cy - 10, to: mid.cy + H * 0.48 + T, delay: 0.9 },
        { pair: "upper", x: CX + W * 0.3, from: mid.cy + 30, to: top.cy + H * 0.7 + T, delay: 0.45 },
        { pair: "upper", x: CX + W * 0.62, from: mid.cy - 20, to: top.cy + H * 0.38 + T, delay: 1.35 },
    ].filter((c) => c.pair === pair);
    return (
        <g>
            {all.map((c, i) => (
                <g key={i}>
                    <rect x={c.x - 7} y={c.to} width={14} height={c.from - c.to} fill="url(#pl-beam)" opacity={0.28} filter="url(#pl-soft)" />
                    <rect x={c.x - 0.9} y={c.to} width={1.8} height={c.from - c.to} fill="url(#pl-beam)" />
                    <ellipse cx={c.x} cy={c.from} rx={11} ry={6.1} fill="rgba(143,168,236,0.25)" stroke={C.signalHi} strokeWidth={1.2} />
                    {animate && (
                        <circle r={3.4} cx={c.x} cy={c.from} fill="#ffffff">
                            <animate attributeName="cy" from={c.from} to={c.to} dur="2.4s" begin={`${c.delay}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="2.4s" begin={`${c.delay}s`} repeatCount="indefinite" />
                        </circle>
                    )}
                </g>
            ))}
        </g>
    );
}

export function PlatformLayers() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
    const reduce = useReducedMotion() ?? false;
    const [active, setActive] = useState<Layer["id"] | null>(null);
    const expanded = reduce || inView;
    const ease = [0.22, 1, 0.36, 1] as const;
    const offsetOf = (id: Layer["id"]) => (id === "product" ? COLLAPSE : id === "data" ? -COLLAPSE : 0);

    return (
        <Section id="platform" aria-labelledby="platform-title" className="relative overflow-hidden text-paper" style={{ backgroundColor: C.stage }}>
            <style>{`
                @keyframes platform-flow { to { stroke-dashoffset: -48; } }
                @keyframes platform-glow { 0%,100% { opacity: .5 } 50% { opacity: .78 } }
                .platform-flow { animation: platform-flow 2.4s linear infinite; }
                .platform-glow { animation: platform-glow 4.5s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { .platform-flow, .platform-glow { animation: none; } }
            `}</style>
            {/* stage lighting */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(247,242,232,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_60%_55%,black_20%,transparent_75%)]" />
            <div aria-hidden className="pointer-events-none absolute left-[55%] top-[55%] h-[640px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(31,63,147,0.45),transparent)]" />

            <Container className="relative">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
                    <FadeIn>
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#93a19d]">What we ship</p>
                        <h2 id="platform-title" className="mt-4 text-3xl font-semibold tracking-tight text-paper md:text-4xl xl:text-[3.2rem] xl:leading-[1]">
                            One system, three layers.
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <p className="max-w-xl text-base leading-relaxed text-paper/70">
                            Every sprint ships the whole stack: the product people actually use, the agent runtime that does the work, and the data layer that keeps every answer grounded. You own all three at handoff.
                        </p>
                    </FadeIn>
                </div>

                <div ref={ref} className="relative mx-auto mt-4 max-w-[1200px] overflow-hidden md:mt-8 md:overflow-visible">
                    <svg
                        viewBox={`0 0 ${VB_W} ${VB_H}`}
                        role="img"
                        aria-labelledby="platform-svg-title"
                        className="ml-[-58%] block h-auto w-[158%] max-w-none font-sans md:ml-0 md:w-full"
                    >
                        <title id="platform-svg-title">
                            Transient Labs stack: products and control planes on top of an agent runtime, on top of data and integrations, with data flowing up through the layers.
                        </title>
                        <defs>
                            <filter id="pl-glow" x="-30%" y="-40%" width="160%" height="180%">
                                <feGaussianBlur stdDeviation="34" />
                            </filter>
                            <filter id="pl-soft" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="6" />
                            </filter>
                            <filter id="pl-shadow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="22" />
                            </filter>
                            <linearGradient id="pl-beam" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0" stopColor={C.signalHi} stopOpacity={0.9} />
                                <stop offset="1" stopColor="#ffffff" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <path d={rhombus(CX, layers[2].cy + 60, W, H)} fill="#000" opacity={0.55} filter="url(#pl-shadow)" />

                        {/* paint bottom -> top so upper planes occlude lower ones; beams sit between data and runtime */}
                        {[...layers].reverse().map((layer) => {
                            const dim = active !== null && active !== layer.id;
                            return (
                                <g key={layer.id}>
                                    {layer.id !== "data" && (
                                        <m.g initial={false} animate={{ opacity: expanded ? 1 : 0 }} transition={{ duration: 0.6, delay: reduce ? 0 : 0.9 }}>
                                            <Beams pair={layer.id === "runtime" ? "lower" : "upper"} animate={!reduce} />
                                        </m.g>
                                    )}
                                    <m.g
                                        initial={false}
                                        animate={{ y: expanded ? 0 : offsetOf(layer.id), opacity: dim ? 0.35 : 1 }}
                                        transition={{ duration: reduce ? 0 : 1.1, ease }}
                                        onMouseEnter={() => setActive(layer.id)}
                                        onMouseLeave={() => setActive(null)}
                                    >
                                        <Plane layer={layer} active={active === layer.id} animate={!reduce} />
                                        {layer.caption.edge !== "surface" && <Caption layer={layer} />}
                                    </m.g>
                                </g>
                            );
                        })}

                        {layers.map((layer) => {
                            const dim = active !== null && active !== layer.id;
                            return (
                                <m.g
                                    key={`labels-${layer.id}`}
                                    initial={false}
                                    animate={{ y: expanded ? 0 : offsetOf(layer.id), opacity: expanded ? (dim ? 0.35 : 1) : 0 }}
                                    transition={{ duration: reduce ? 0 : 1.1, ease }}
                                    onMouseEnter={() => setActive(layer.id)}
                                    onMouseLeave={() => setActive(null)}
                                >
                                    <Labels layer={layer} />
                                </m.g>
                            );
                        })}
                    </svg>
                </div>

                {/* Text version: visible on phones and small tablets (the SVG drops its labels there), screen-reader only above. */}
                <ol className="border-t border-paper/15 md:sr-only">
                    {layers.map((layer) => (
                        <li key={layer.id} className="grid grid-cols-[auto_1fr] gap-x-4 border-b border-paper/15 py-4">
                            <span className="pt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#93a19d]">{layer.index}</span>
                            <div>
                                <p className={`text-lg font-semibold tracking-tight ${layer.id === "runtime" ? "text-[#8fa8ec]" : "text-paper"}`}>{layer.name}</p>
                                <p className="mt-1 text-sm leading-relaxed text-paper/70">{layer.pills.join(" · ")}</p>
                                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#93a19d]">
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
