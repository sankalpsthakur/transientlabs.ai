'use client';

import { cn } from '@/lib/utils';
import {
  HOTSPOTS,
  METERS,
  type HotspotId,
  type StageId,
} from './playbook';

export interface PlantDrawingProps {
  stage: StageId;
  hotspot: HotspotId;
  onSelect: (id: HotspotId) => void;
  accent?: string;
  reduced?: boolean;
  className?: string;
}

function Building({
  x,
  y,
  w,
  h,
  d = 16,
  fill,
  stroke,
  selected,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  d?: number;
  fill: string;
  stroke: string;
  selected?: boolean;
}) {
  const top = `${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`;
  const south = `${x},${y + h} ${x + w},${y + h} ${x + w + d * 0.45},${y + h + d} ${x + d * 0.45},${y + h + d}`;
  const east = `${x + w},${y} ${x + w + d * 0.45},${y + d} ${x + w + d * 0.45},${y + h + d} ${x + w},${y + h}`;
  return (
    <g>
      <polygon points={south} fill="#d8c7af" stroke={stroke} strokeWidth={selected ? 1.6 : 1} />
      <polygon points={east} fill="#cbb79d" stroke={stroke} strokeWidth={selected ? 1.6 : 1} />
      <polygon points={top} fill={fill} stroke={stroke} strokeWidth={selected ? 1.8 : 1.1} />
    </g>
  );
}

export function PlantDrawing({
  stage,
  hotspot,
  onSelect,
  accent = '#1F3F93',
  reduced = false,
  className,
}: PlantDrawingProps) {
  const late = stage === 'tags' || stage === 'clamps' || stage === 'sops' || stage === 'handoff';
  const showFlows = stage !== 'handoff';
  const showMeters = stage === 'bills' || stage === 'hotspots';
  const showOpps = stage === 'opportunities' || late;
  const showGateway = stage === 'handoff' || stage === 'sops';

  const selected = HOTSPOTS.find((h) => h.id === hotspot)!;
  const originX = selected.x;
  const originY = selected.y;
  const zoomed = late && !reduced;
  const scale = zoomed ? 1.55 : 1;
  const tx = zoomed ? (50 - originX) * 0.7 : 0;
  const ty = zoomed ? (48 - originY) * 0.55 : 0;

  return (
    <div className={cn('relative h-full min-h-[320px] w-full', className)}>
      <style>{`
        @keyframes ea-flow { to { stroke-dashoffset: -160; } }
        @keyframes ea-pulse {
          0%, 100% { opacity: 0.35; r: 16; }
          50% { opacity: 0.08; r: 28; }
        }
        .ea-flow { animation: ea-flow 9s linear infinite; }
        .ea-pulse { animation: ea-pulse 2.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ea-flow, .ea-pulse { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 1000 620"
        className="h-full w-full"
        role="img"
        aria-label="Reference Plant B site plan. Click a load to extract tags, clamp bands, and the advisory SOP."
      >
        <defs>
          <pattern id="ea-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2d3c1" strokeWidth="0.8" />
          </pattern>
          <radialGradient id="ea-paper" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fffaf3" />
            <stop offset="100%" stopColor="#f1e6d6" />
          </radialGradient>
        </defs>

        <rect width="1000" height="620" fill="url(#ea-paper)" />
        <rect width="1000" height="620" fill="url(#ea-grid)" opacity={0.85} />

        <g
          style={{
            transform: `translate(${tx * 10}px, ${ty * 6.2}px) scale(${scale})`,
            transformOrigin: `${originX}% ${originY}%`,
            transition: reduced ? 'none' : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Site boundary */}
          <rect
            x="48"
            y="42"
            width="904"
            height="536"
            rx="10"
            fill="none"
            stroke="#18120d"
            strokeWidth="1.4"
            strokeDasharray="7 5"
            opacity="0.45"
          />

          {/* Incoming yard */}
          <Building x={70} y={70} w={130} h={88} fill="#f3eadc" stroke="#18120d" selected={stage === 'bills'} />
          <rect x="92" y="92" width="36" height="28" fill="#fff" stroke="#18120d" />
          <rect x="138" y="92" width="36" height="28" fill="#fff" stroke="#18120d" />
          <text x="88" y="148" fill="#67584b" fontSize="11" fontFamily="ui-monospace, monospace">
            11 kV · TX-A / TX-B
          </text>

          {/* Compressor hall */}
          <Building
            x={86}
            y={300}
            w={200}
            h={150}
            fill={hotspot === 'compressor' ? '#ebe1d0' : '#f6eee3'}
            stroke={hotspot === 'compressor' ? accent : '#18120d'}
            selected={hotspot === 'compressor'}
          />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx={130 + i * 52} cy={372} r="22" fill="#fff" stroke="#18120d" />
              <path
                d={`M${130 + i * 52} ${356} v32 M${114 + i * 52} 372 h32`}
                stroke="#8B5E34"
                strokeWidth="1.4"
              />
              <text
                x={130 + i * 52}
                y={408}
                textAnchor="middle"
                fill="#67584b"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
              >
                C{i + 1}
              </text>
            </g>
          ))}

          {/* Tunnel kiln */}
          <Building
            x={340}
            y={88}
            w={360}
            h={118}
            fill={hotspot === 'kiln' ? '#ebe1d0' : '#f6eee3'}
            stroke={hotspot === 'kiln' ? accent : '#18120d'}
            selected={hotspot === 'kiln'}
          />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect
                x={360 + i * 82}
                y={108}
                width={70}
                height={72}
                fill={i === 2 ? 'rgba(31,63,147,0.08)' : '#fff'}
                stroke="#18120d"
                strokeDasharray={i === 2 ? '4 3' : undefined}
              />
              <text
                x={395 + i * 82}
                y={148}
                textAnchor="middle"
                fill="#67584b"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
              >
                Z{i + 1}
              </text>
            </g>
          ))}

          {/* HVAC penthouse */}
          <Building
            x={720}
            y={78}
            w={150}
            h={96}
            d={18}
            fill={hotspot === 'hvac' ? '#ebe1d0' : '#f4ebdd'}
            stroke={hotspot === 'hvac' ? accent : '#18120d'}
            selected={hotspot === 'hvac'}
          />
          <rect x="742" y="100" width="48" height="36" fill="#fff" stroke="#18120d" />
          <rect x="800" y="100" width="48" height="36" fill="#fff" stroke="#18120d" />
          <text x="748" y="154" fill="#67584b" fontSize="10" fontFamily="ui-monospace, monospace">
            AHU-1 · AHU-2
          </text>

          {/* Assembly line 2 */}
          <Building
            x={390}
            y={360}
            w={340}
            h={130}
            fill={hotspot === 'line' ? '#ebe1d0' : '#f6eee3'}
            stroke={hotspot === 'line' ? accent : '#18120d'}
            selected={hotspot === 'line'}
          />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x={410 + i * 38}
              y={392}
              width={26}
              height={40}
              fill="#fff"
              stroke="#18120d"
            />
          ))}
          <rect x="410" y="444" width="300" height="22" fill="#fff" stroke="#8B5E34" />
          <text x="418" y="460" fill="#8B5E34" fontSize="10" fontFamily="ui-monospace, monospace">
            CURE OVEN
          </text>

          {/* Energy traces */}
          {showFlows && (
            <g
              fill="none"
              stroke={accent}
              strokeWidth="1.4"
              strokeDasharray="7 8"
              className={reduced ? undefined : 'ea-flow'}
              opacity={0.55}
            >
              <path d="M200 114 C 240 114, 260 200, 186 300" />
              <path d="M200 114 C 360 80, 400 90, 340 140" />
              <path d="M200 158 C 420 220, 640 90, 720 120" />
              <path d="M200 158 C 320 280, 360 400, 390 420" />
            </g>
          )}

          {/* Incoming meter diamonds */}
          {showMeters &&
            METERS.filter((m) => m.status === 'in-hand')
              .slice(0, 4)
              .map((m, i) => (
                <g key={m.id} transform={`translate(${88 + i * 22} ${188})`}>
                  <rect
                    x="-6"
                    y="-6"
                    width="12"
                    height="12"
                    transform="rotate(45)"
                    fill="#1F3F93"
                    opacity="0.85"
                  />
                </g>
              ))}
          {showMeters && (
            <g>
              <rect x="248" y="248" width="10" height="10" transform="rotate(45 253 253)" fill="none" stroke="#8B5E34" />
              <text x="268" y="258" fill="#8B5E34" fontSize="10" fontFamily="ui-monospace, monospace">
                GAP · CA flow
              </text>
              <rect x="612" y="198" width="10" height="10" transform="rotate(45 617 203)" fill="none" stroke="#8B5E34" />
              <text x="632" y="208" fill="#8B5E34" fontSize="10" fontFamily="ui-monospace, monospace">
                GAP · Z3 fiscal
              </text>
            </g>
          )}

          {/* Opportunity flags */}
          {showOpps &&
            HOTSPOTS.map((h, i) => (
              <g key={h.id} transform={`translate(${(h.x / 100) * 1000 + 28} ${(h.y / 100) * 620 - 36})`}>
                <rect width="22" height="18" rx="2" fill={accent} />
                <text
                  x="11"
                  y="13"
                  textAnchor="middle"
                  fill="#f8f2e9"
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                >
                  0{i + 1}
                </text>
              </g>
            ))}

          {/* Ignition cabinet */}
          {showGateway && (
            <g transform="translate(860 470)">
              <rect width="56" height="78" fill="#18120d" />
              <rect x="8" y="10" width="40" height="24" fill="#1F3F93" opacity="0.85" />
              <text x="28" y="26" textAnchor="middle" fill="#f8f2e9" fontSize="8" fontFamily="ui-monospace, monospace">
                IGN
              </text>
              <text x="28" y="68" textAnchor="middle" fill="#f8f2e9" fontSize="8" fontFamily="ui-monospace, monospace">
                EDGE
              </text>
            </g>
          )}

          {/* Selected pulse */}
          <circle
            cx={(selected.x / 100) * 1000}
            cy={(selected.y / 100) * 620}
            r={18}
            fill={accent}
            className={reduced ? undefined : 'ea-pulse'}
            opacity={reduced ? 0.2 : undefined}
          />
        </g>

        {/* Registration marks */}
        <path d="M16 16 h18 M16 16 v18" stroke="#18120d" strokeWidth="1.1" />
        <path d="M984 16 h-18 M984 16 v18" stroke="#18120d" strokeWidth="1.1" />
        <path d="M16 604 h18 M16 604 v-18" stroke="#18120d" strokeWidth="1.1" />
        <path d="M984 604 h-18 M984 604 v-18" stroke="#18120d" strokeWidth="1.1" />

        <text x="56" y="34" fill="#67584b" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="0.18em">
          PLB · SITE PLAN · ILLUSTRATIVE · 1:400
        </text>
        <polygon points="930,48 938,28 946,48" fill="none" stroke="#18120d" />
        <text x="922" y="60" fill="#18120d" fontSize="9" fontFamily="ui-monospace, monospace">
          N
        </text>
      </svg>

      {HOTSPOTS.map((h) => {
        const active = h.id === hotspot;
        return (
          <button
            key={h.id}
            type="button"
            data-hotspot={h.id}
            aria-pressed={active}
            aria-label={`${h.name}. ${h.sharePct} percent of site energy. ${h.lossMode}`}
            onClick={() => onSelect(h.id)}
            className={cn(
              'absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border bg-paper/90 px-2.5 py-1 text-left shadow-[0_8px_24px_-16px_rgba(24,18,13,0.6)] backdrop-blur-sm transition-[border-color,transform,background] duration-300',
              active
                ? 'z-10 border-[color:var(--ea-accent,#1F3F93)]'
                : 'border-border text-ink-muted hover:border-ink/40'
            )}
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              ['--ea-accent' as string]: accent,
            }}
          >
            <span
              className="font-mono text-[9px] uppercase tracking-[0.16em]"
              style={{ color: active ? accent : undefined }}
            >
              {h.short}
            </span>
            <span className="font-mono text-[10px] tabular-nums text-ink">{h.sharePct}%</span>
          </button>
        );
      })}
    </div>
  );
}
