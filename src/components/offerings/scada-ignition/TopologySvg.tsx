'use client';

import { cn } from '@/lib/utils';
import {
  conduitAuthoritySolid,
  type PlantState,
  type SelectedNode,
} from './model';

export interface TopologySvgProps {
  state: PlantState;
  reduced?: boolean;
  onSelect: (node: SelectedNode) => void;
  className?: string;
}

const INK = '#18120D';
const SIGNAL = '#1F3F93';
const LEDGER = '#8B5E34';
const FOREST = '#2C5A3A';
const VERMILLION = '#D55E00';
const SKY = '#0072B2';
const PAPER = '#F8F2E9';

function NodeCard({
  x,
  y,
  w,
  h,
  id,
  kicker,
  title,
  sub,
  selected,
  muted,
  tone = 'ink',
  onSelect,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  id: Exclude<SelectedNode, null>;
  kicker: string;
  title: string;
  sub: string;
  selected: boolean;
  muted?: boolean;
  tone?: 'ink' | 'signal' | 'ledger' | 'sis' | 'sky';
  onSelect: (node: SelectedNode) => void;
}) {
  const stroke =
    tone === 'sis'
      ? VERMILLION
      : tone === 'signal'
        ? SIGNAL
        : tone === 'ledger'
          ? LEDGER
          : tone === 'sky'
            ? SKY
            : INK;
  return (
    <g
      role="button"
      tabIndex={0}
      data-node={id}
      data-testid={`topo-${id}`}
      aria-pressed={selected}
      aria-label={`${kicker} ${title}`}
      onClick={() => onSelect(id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(id);
        }
      }}
      style={{ cursor: 'pointer' }}
      opacity={muted ? 0.28 : 1}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={selected ? '#fffdf8' : PAPER}
        stroke={selected ? stroke : `${stroke}CC`}
        strokeWidth={selected ? 2.2 : 1.2}
      />
      <text
        x={x + 10}
        y={y + 14}
        fill={stroke}
        fontSize={8}
        fontFamily="ui-monospace, Menlo, monospace"
        letterSpacing="0.14em"
      >
        {kicker}
      </text>
      <text
        x={x + 10}
        y={y + 30}
        fill={INK}
        fontSize={13}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={600}
      >
        {title}
      </text>
      <text
        x={x + 10}
        y={y + 46}
        fill="#67584b"
        fontSize={10}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {sub}
      </text>
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  kind,
  label,
  active,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  kind: 'observe' | 'authority' | 'mirror';
  label: string;
  active: boolean;
}) {
  const color = kind === 'observe' ? SIGNAL : kind === 'authority' ? LEDGER : VERMILLION;
  const dash = kind === 'mirror' ? '5 4' : kind === 'authority' && !active ? '3 4' : undefined;
  const id = `arr-${kind}-${Math.round(x1)}-${Math.round(y1)}`;
  return (
    <g data-conduit={kind} data-solid={kind === 'authority' ? active : true}>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={kind === 'mirror' ? 1.4 : 1.8}
        strokeDasharray={dash}
        markerEnd={`url(#${id})`}
        opacity={0.9}
      />
      <text
        x={(x1 + x2) / 2 + 6}
        y={(y1 + y2) / 2 - 4}
        fill={color}
        fontSize={8}
        fontFamily="ui-monospace, Menlo, monospace"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * Labeled Purdue / Ignition elevation. Reduced-motion stage and always-on legend.
 * SIS has a dashed mirror out and no inbound write stroke.
 */
export function TopologySvg({
  state,
  reduced = false,
  onSelect,
  className,
}: TopologySvgProps) {
  const selected = state.selected;
  const authority = conduitAuthoritySolid(state);
  const edgeGone = !state.edgeAlive;

  return (
    <svg
      viewBox="0 0 980 540"
      className={cn('h-auto w-full', className)}
      role="img"
      data-testid="topology-svg"
      data-inbound-sis="false"
      data-write-path-sis="false"
      aria-label="Purdue and Ignition topology for North Cell. Field to PLC to Ignition Edge and Gateway to Perspective clients to historian to DMZ to ERP. SIS is isolated with a read-only mirror and no write path."
    >
      <rect x="0" y="0" width="980" height="540" fill={PAPER} rx="16" />
      <text
        x="24"
        y="28"
        fill={INK}
        fontSize="15"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={650}
      >
        Purdue / Ignition · North Cell
      </text>
      <text
        x="24"
        y="46"
        fill="#67584b"
        fontSize="10"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        FIELD → PLC → EDGE / GATEWAY → PERSPECTIVE → HISTORIAN → DMZ → ERP
      </text>

      <NodeCard
        x={24}
        y={430}
        w={300}
        h={84}
        id="field"
        kicker="L0 · FIELD"
        title="Press · oven · pack · kWh"
        sub="4–20 mA / EtherNet/IP / S7 / Modbus"
        selected={selected === 'field'}
        onSelect={onSelect}
      />
      <NodeCard
        x={24}
        y={332}
        w={184}
        h={78}
        id="plc"
        kicker="L1 · CONTROL"
        title="PLC / DCS"
        sub="Owns every physical decision"
        selected={selected === 'plc'}
        onSelect={onSelect}
      />
      <NodeCard
        x={218}
        y={332}
        w={196}
        h={78}
        id="clamp"
        kicker="L1 · ENFORCE"
        title="Clamp layer"
        sub="Four HAZOP filters · PLC logic"
        selected={selected === 'clamp'}
        tone="ledger"
        onSelect={onSelect}
      />

      <NodeCard
        x={24}
        y={220}
        w={196}
        h={88}
        id="edge"
        kicker="L2 · IGNITION EDGE"
        title={edgeGone ? 'Edge crate killed' : 'Ignition Edge'}
        sub={edgeGone ? 'Plant did not twitch' : 'Store-and-forward · disposable'}
        selected={selected === 'edge'}
        muted={edgeGone}
        tone="sky"
        onSelect={onSelect}
      />
      <NodeCard
        x={232}
        y={220}
        w={196}
        h={88}
        id="gateway"
        kicker="L2 · IGNITION GW"
        title="Gateway + UDTs"
        sub="Tag provider · alarm pipeline"
        selected={selected === 'gateway'}
        tone="signal"
        onSelect={onSelect}
      />

      <NodeCard
        x={24}
        y={122}
        w={196}
        h={78}
        id="clients"
        kicker="L2 · CLIENTS"
        title="Perspective / Vision"
        sub="Presents, logs, does not decide"
        selected={selected === 'clients'}
        tone="signal"
        onSelect={onSelect}
      />
      <NodeCard
        x={232}
        y={122}
        w={196}
        h={78}
        id="historian"
        kicker="L2 · HISTORIAN"
        title="Tag History"
        sub="Source-time · never dropped"
        selected={selected === 'historian'}
        onSelect={onSelect}
      />

      <NodeCard
        x={24}
        y={64}
        w={404}
        h={44}
        id="dmz"
        kicker="L3.5 · DMZ"
        title="Broker · reverse proxy · diode · PKI"
        sub=""
        selected={selected === 'dmz'}
        onSelect={onSelect}
      />

      <NodeCard
        x={456}
        y={28}
        w={200}
        h={80}
        id="sop"
        kicker="L3 · SOP GATE"
        title="Named person"
        sub={state.sop.approver ?? 'Authority is created here'}
        selected={selected === 'sop'}
        tone="ledger"
        onSelect={onSelect}
      />
      <NodeCard
        x={672}
        y={28}
        w={168}
        h={80}
        id="erp"
        kicker="L4 · ENTERPRISE"
        title="ERP / MES"
        sub="ISA-95 objects, not tags"
        selected={selected === 'erp'}
        onSelect={onSelect}
      />
      <NodeCard
        x={856}
        y={28}
        w={100}
        h={80}
        id="cloud"
        kicker="L4+"
        title="Cloud"
        sub="Advisory only"
        selected={selected === 'cloud'}
        tone="sky"
        onSelect={onSelect}
      />

      {/* SIS island — physically offset, no inbound stroke */}
      <g data-testid="sis-island" data-write-path-sis="false">
        <rect
          x={700}
          y={300}
          width={256}
          height={210}
          rx={12}
          fill="#FDF6EE"
          stroke={VERMILLION}
          strokeWidth={1.6}
          strokeDasharray="6 4"
        />
        <text
          x={716}
          y={322}
          fill={VERMILLION}
          fontSize={9}
          fontFamily="ui-monospace, Menlo, monospace"
          letterSpacing="0.16em"
        >
          SAFETY BOUNDARY · INDEPENDENT
        </text>
        <NodeCard
          x={716}
          y={338}
          w={224}
          h={100}
          id="sis"
          kicker="IEC 61511 · SIL 2/3"
          title="SIS"
          sub="No write path in — from anywhere"
          selected={selected === 'sis'}
          tone="sis"
          onSelect={onSelect}
        />
        <text
          x={728}
          y={460}
          fill={VERMILLION}
          fontSize={10}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          Read-only mirror out. Bypass stays
        </text>
        <text
          x={728}
          y={476}
          fill={VERMILLION}
          fontSize={10}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          on the SIS engineering station.
        </text>
      </g>

      {/* Observation up */}
      <Arrow x1={174} y1={430} x2={174} y2={410} kind="observe" label="" active />
      <Arrow x1={116} y1={332} x2={116} y2={308} kind="observe" label="observe" active />
      <Arrow x1={122} y1={220} x2={122} y2={200} kind="observe" label="" active />
      <Arrow x1={122} y1={122} x2={122} y2={108} kind="observe" label="" active />
      <Arrow x1={428} y1={86} x2={456} y2={70} kind="observe" label="ISA-95" active />

      {/* Authority down — hollow until signed */}
      <Arrow
        x1={556}
        y1={108}
        x2={330}
        y2={122}
        kind="authority"
        label={authority ? 'signed token' : 'unsigned · hollow'}
        active={authority}
      />
      <Arrow
        x1={330}
        y1={200}
        x2={316}
        y2={220}
        kind="authority"
        label=""
        active={authority}
      />
      <Arrow
        x1={316}
        y1={308}
        x2={316}
        y2={332}
        kind="authority"
        label="leased SP"
        active={authority}
      />

      {/* SIS mirror OUT only — no inbound counterpart */}
      <Arrow
        x1={716}
        y1={388}
        x2={428}
        y2={264}
        kind="mirror"
        label="mirror out · no write"
        active
      />

      {!reduced && (
        <g opacity={0.85}>
          <circle cx={174} cy={400} r={3.2} fill={SIGNAL}>
            <animate attributeName="cy" values="400;360;332" dur="2.4s" repeatCount="indefinite" />
          </circle>
          {authority && (
            <circle cx={316} cy={250} r={3.4} fill={LEDGER} stroke={LEDGER}>
              <animate attributeName="cy" values="230;280;332" dur="2.8s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      )}

      <g>
        <rect x={456} y={140} width={228} height={148} rx={8} fill="#fff" stroke="#e2d3c1" />
        <text x={470} y={160} fill={FOREST} fontSize={9} fontFamily="ui-monospace, Menlo, monospace">
          TWO CONDUITS ONLY
        </text>
        <text x={470} y={178} fill={INK} fontSize={11} fontFamily="ui-sans-serif, system-ui, sans-serif">
          Observation up · authority down
        </text>
        <text x={470} y={196} fill="#67584b" fontSize={10} fontFamily="ui-sans-serif, system-ui, sans-serif">
          No inbound SIS line. No unsigned valve.
        </text>
        <text x={470} y={220} fill={INK} fontSize={9} fontFamily="ui-monospace, Menlo, monospace">
          R1 local loops · R2 SIS no-write
        </text>
        <text x={470} y={236} fill={INK} fontSize={9} fontFamily="ui-monospace, Menlo, monospace">
          R3 analogue only · R4 SOP gate
        </text>
        <text x={470} y={252} fill={INK} fontSize={9} fontFamily="ui-monospace, Menlo, monospace">
          R5 hold-then-degrade · R6 kill-crate
        </text>
        <text x={470} y={268} fill={INK} fontSize={9} fontFamily="ui-monospace, Menlo, monospace">
          R7 rate decoupling · R8 twin validity
        </text>
      </g>
    </svg>
  );
}
