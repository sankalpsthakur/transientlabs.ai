'use client';

import { cn } from '@/lib/utils';
import { FIRM_COLORS, PORTALS, STRATA, SYSTEMS } from './constants';
import type { FirmInteraction } from './types';

interface FirmFallbackProps {
  className?: string;
  interaction: FirmInteraction;
  accent?: string;
}

const RING_CX = [258, 320, 382];
const RING_CY = 318;

/**
 * Reduced-motion SVG nucleus. Same objects, no smear, gate readable.
 */
export function FirmFallback({
  className,
  interaction,
  accent = FIRM_COLORS.signal,
}: FirmFallbackProps) {
  return (
    <div
      data-firm-fallback=""
      role="img"
      aria-label="Long Exposure firm nucleus: three rings piercing a control slab with MAP, RULES, ACTIONS, and TRACE. Existing systems ERP, CRM, MES, QMS, and Email sit on one orbit. Portals for Plant, Finance, and Evidence. Seals SOC2, PQ, TRACE."
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[1.75rem] border border-[#e2d3c1] bg-[#f8f2e9]',
        className
      )}
    >
      <svg viewBox="0 0 640 800" className="h-full w-full" fill="none">
        <rect width="640" height="800" fill={FIRM_COLORS.paper} />

        {RING_CX.map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy={RING_CY}
            r="118"
            stroke={i === 1 ? accent : FIRM_COLORS.ink}
            strokeWidth={i === 2 ? 5 : 4}
            opacity={i === 0 ? 0.22 : i === 1 ? 0.58 : 0.92}
            className="cursor-pointer"
            onClick={() => interaction.armMark()}
            data-firm-ring={i}
          />
        ))}

        {STRATA.map((stratum, i) => {
          const on = interaction.stratum === stratum.id;
          const y = 278 + i * 28;
          return (
            <g
              key={stratum.id}
              className="cursor-pointer"
              onClick={() => interaction.selectStratum(stratum.id)}
            >
              <rect
                x="214"
                y={y}
                width="212"
                height="22"
                rx="5"
                fill={on ? FIRM_COLORS.ink : '#1a1510'}
                stroke={FIRM_COLORS.gold}
                strokeWidth={on ? 1.6 : 1}
                data-firm-slab={stratum.id}
              />
              <text
                x="320"
                y={y + 15}
                textAnchor="middle"
                fill={FIRM_COLORS.paper}
                fontSize="10"
                fontFamily="ui-monospace, Menlo, monospace"
                letterSpacing="0.18em"
              >
                {stratum.label}
              </text>
            </g>
          );
        })}

        {SYSTEMS.map((sys, i) => {
          const a = -Math.PI / 2 + (i / SYSTEMS.length) * Math.PI * 2;
          const x = 320 + Math.cos(a) * 198;
          const y = RING_CY + 12 + Math.sin(a) * 168;
          const on = interaction.system === sys.id;
          return (
            <g
              key={sys.id}
              className="cursor-pointer"
              onClick={() => interaction.selectSystem(sys.id)}
            >
              <line
                x1={320 + Math.cos(a) * 126}
                y1={RING_CY + 8 + Math.sin(a) * 78}
                x2={x}
                y2={y}
                stroke={FIRM_COLORS.gold}
                strokeOpacity={on ? 0.8 : 0.35}
              />
              <rect
                x={x - 28}
                y={y - 11}
                width="56"
                height="22"
                rx="6"
                fill="white"
                stroke={on ? FIRM_COLORS.gold : accent}
                data-firm-chip={sys.id}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill={FIRM_COLORS.ink}
                fontSize="9"
                fontFamily="ui-monospace, Menlo, monospace"
              >
                {sys.label}
              </text>
            </g>
          );
        })}

        {PORTALS.map((portal, i) => {
          const pos = [
            { x: 78, y: 318 },
            { x: 562, y: 318 },
            { x: 320, y: 118 },
          ][i];
          const on = interaction.portal === portal.id;
          const color =
            portal.id === 'plant'
              ? FIRM_COLORS.signal
              : portal.id === 'finance'
                ? FIRM_COLORS.ledger
                : FIRM_COLORS.forest;
          return (
            <g
              key={portal.id}
              className="cursor-pointer"
              onClick={() => interaction.selectPortal(portal.id)}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={on ? 28 : 24}
                stroke={color}
                strokeWidth={on ? 2.4 : 1.4}
                fill="white"
                fillOpacity={0.7}
                data-firm-portal-mark={portal.id}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill={color}
                fontSize="9"
                fontFamily="ui-monospace, Menlo, monospace"
              >
                {portal.label}
              </text>
            </g>
          );
        })}
      </svg>

    </div>
  );
}
