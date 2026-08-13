'use client';

import {
  BATCH_COLLARS,
  FOREST,
  INK,
  LEDGER,
  MONITORING_POINTS,
  PERMANENCE_YEARS,
  SIGNAL,
  STAGE_ORDER,
  STEEL_DARK,
  YIELD_CARBON_RANGE,
} from './model';
import { isCollarLocked, pointLive } from './model';
import type { DmrvStageId, DmrvTier } from './types';

const RING_CX = [118, 188, 258, 328, 398, 468];
const SENSOR_XY: Record<(typeof MONITORING_POINTS)[number]['id'], [number, number]> = {
  intake: [132, 168],
  reactor: [258, 132],
  output: [392, 176],
  storage: [458, 118],
  permanence: [512, 168],
};

export function PaperFallback({
  tier,
  stageIndex,
  maxReached,
  stageId,
}: {
  tier: DmrvTier;
  stageIndex: number;
  maxReached: number;
  stageId: DmrvStageId;
}) {
  return (
    <div
      className="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl border border-border bg-paper"
      data-testid="dmrv-fallback"
      role="img"
      aria-label="Paper elevation of a pyrolysis kiln with evidence rings, sensors, and batch collars."
    >
      <svg
        viewBox="0 0 720 420"
        className="h-full w-full"
        fill="none"
        aria-hidden
      >
        <rect width="720" height="420" fill="#F8F2E9" />
        <path
          d="M40 318 H680"
          stroke={INK}
          strokeOpacity="0.18"
          strokeWidth="1"
        />

        {/* Saddles + drum */}
        <rect x="188" y="248" width="18" height="70" rx="2" fill="#EFE4D5" stroke={INK} />
        <rect x="352" y="248" width="18" height="70" rx="2" fill="#EFE4D5" stroke={INK} />
        <ellipse
          cx="280"
          cy="210"
          rx="168"
          ry="52"
          fill="#EFE4D5"
          stroke={INK}
          strokeWidth="1.4"
        />
        <ellipse
          cx="280"
          cy="210"
          rx="148"
          ry="40"
          fill="none"
          stroke={STEEL_DARK}
          strokeWidth="1"
        />
        {/* Hopper */}
        <path
          d="M118 168 L154 168 L146 214 L126 214 Z"
          fill="#EFE4D5"
          stroke={INK}
        />
        {/* Weigh pad */}
        <rect
          x="108"
          y="300"
          width="56"
          height="10"
          rx="1"
          fill="#D7C6B0"
          stroke={INK}
        />
        {/* Char slug */}
        <ellipse
          cx="456"
          cy="236"
          rx="22"
          ry="16"
          fill="#2A221C"
          stroke={FOREST}
        />
        {stageIndex >= 2 && (
          <text
            x="456"
            y="268"
            textAnchor="middle"
            fill={INK}
            fontSize="10"
            fontFamily="ui-monospace, Menlo, monospace"
          >
            {YIELD_CARBON_RANGE.min}–{YIELD_CARBON_RANGE.max}% C
          </text>
        )}

        {/* Ghost counterfactual */}
        {stageIndex <= 1 && (
          <g opacity="0.55">
            <rect x="48" y="248" width="28" height="22" fill="none" stroke={INK} />
            <rect x="80" y="238" width="24" height="32" fill="none" stroke={INK} />
            <rect x="62" y="272" width="32" height="18" fill="none" stroke={INK} />
            <text
              x="64"
              y="308"
              fill={INK}
              fontSize="9"
              fontFamily="ui-monospace, Menlo, monospace"
            >
              Counterfactual
            </text>
          </g>
        )}

        {/* Six evidence rings — unlit rings keep the tonne from existing */}
        {STAGE_ORDER.map((id, i) => {
          const lit = maxReached >= i;
          const current = stageIndex === i;
          return (
            <ellipse
              key={id}
              cx={RING_CX[i]}
              cy="210"
              rx={36 + i * 2}
              ry={64 + i * 3}
              stroke={current ? LEDGER : lit ? FOREST : INK}
              strokeOpacity={current ? 1 : lit ? 0.75 : 0.18}
              strokeWidth={current ? 2.4 : 1}
            />
          );
        })}

        {/* Sensors */}
        {MONITORING_POINTS.map((point) => {
          const [x, y] = SENSOR_XY[point.id];
          const live = pointLive(point, tier) && stageIndex >= 1;
          const absent = point.cadence[tier] === 'absent';
          return (
            <g key={point.id} opacity={absent ? 0.2 : live ? 1 : 0.35}>
              <rect
                x={x - 6}
                y={y - 6}
                width="12"
                height="12"
                fill={live ? FOREST : '#EFE4D5'}
                stroke={INK}
              />
              {live && point.cadence[tier] !== 'periodic' && (
                <line
                  x1={x}
                  y1={y}
                  x2="280"
                  y2="352"
                  stroke={point.cadence[tier] === 'continuous' ? FOREST : LEDGER}
                  strokeDasharray={
                    point.cadence[tier] === 'continuous' ? undefined : '4 3'
                  }
                  strokeOpacity="0.55"
                />
              )}
            </g>
          );
        })}

        {/* Logger / edge */}
        {(tier === 'mid' || tier === 'high') && stageIndex >= 1 && (
          <g>
            <rect
              x="248"
              y="338"
              width={tier === 'high' ? 72 : 56}
              height={tier === 'high' ? 36 : 28}
              fill="#3A342C"
              stroke={INK}
            />
            <text
              x="256"
              y="356"
              fill="#F8F2E9"
              fontSize="9"
              fontFamily="ui-monospace, Menlo, monospace"
            >
              {tier === 'high' ? 'EDGE' : 'LOGGER'}
            </text>
          </g>
        )}

        {tier === 'high' && stageIndex >= 1 && (
          <path
            d="M236 352 Q280 300 324 352"
            stroke={LEDGER}
            strokeWidth="1.6"
            fill="none"
          />
        )}

        {tier === 'low' && (
          <g>
            <rect
              x="96"
              y="214"
              width="28"
              height="18"
              fill="#EFE4D5"
              stroke={INK}
            />
            <rect
              x="168"
              y="292"
              width="22"
              height="16"
              fill="#8B5E34"
              stroke={INK}
            />
          </g>
        )}

        {/* Batch collars */}
        {BATCH_COLLARS.map((collar, i) => {
          const locked = isCollarLocked(collar, stageIndex, maxReached);
          const x = 168 + i * 78;
          return (
            <g key={collar.id} opacity={stageIndex >= 2 ? 1 : 0.2}>
              <circle
                cx={x}
                cy="210"
                r="10"
                fill={locked ? LEDGER : 'none'}
                stroke={INK}
              />
              <text
                x={x}
                y="214"
                textAnchor="middle"
                fill={locked ? '#F8F2E9' : INK}
                fontSize="8"
                fontFamily="ui-monospace, Menlo, monospace"
              >
                {collar.short}
              </text>
            </g>
          );
        })}

        {/* 100y torus */}
        {maxReached >= 4 && stageIndex >= 4 && (
          <g>
            <ellipse
              cx="512"
              cy="168"
              rx="54"
              ry="38"
              stroke={LEDGER}
              strokeWidth="2"
            />
            <text
              x="512"
              y="172"
              textAnchor="middle"
              fill={INK}
              fontSize="12"
              fontFamily="ui-monospace, Menlo, monospace"
            >
              {PERMANENCE_YEARS}y
            </text>
          </g>
        )}

        {/* Retirement punch */}
        {stageId === 'retire' && (
          <g>
            <rect
              x="560"
              y="88"
              width="132"
              height="92"
              fill="#EFE4D5"
              stroke={INK}
            />
            <circle cx="668" cy="112" r="10" fill="#3A342C" stroke={INK} />
            <text
              x="572"
              y="118"
              fill={INK}
              fontSize="9"
              fontFamily="ui-monospace, Menlo, monospace"
            >
              FS  PY  ST  RT
            </text>
            <text
              x="572"
              y="138"
              fill={LEDGER}
              fontSize="9"
              fontFamily="ui-monospace, Menlo, monospace"
            >
              LOCKED METADATA
            </text>
            <text
              x="572"
              y="158"
              fill={SIGNAL}
              fontSize="9"
              fontFamily="ui-monospace, Menlo, monospace"
            >
              RETIRED
            </text>
          </g>
        )}

        <text
          x="40"
          y="36"
          fill={INK}
          fontSize="11"
          fontFamily="ui-monospace, Menlo, monospace"
          letterSpacing="0.16em"
        >
          PYROLYSIS ELEVATION · PAPER
        </text>
      </svg>
    </div>
  );
}
