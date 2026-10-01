'use client'

import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { RotateCcw, Sparkles } from 'lucide-react'
import { FontPicker } from '@/components/controls/font-picker/font-picker'
import { BaseFader } from '@/components/controls/base-settings'
import { DialKnob, MechanicalCounter } from '@/components/controls/rotary-dial'
import { AnimateExpand } from '@/components/ui/animate-expand'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  BODY_LETTER_SPACING_RANGE,
  DEFAULT_CONFIG,
  HEADINGS_LETTER_SPACING_RANGE,
} from '@/data/default-config'
import { SCALE_RATIO_PRESETS } from '@/data/scale-ratios'
import { loadFontFull } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import type { GroupProperties } from '@/types/typography'

// ── State ───────────────────────────────────────────────────────

export type GroupKey = 'headings' | 'body'

const GROUP_TITLES: Record<GroupKey, string> = { headings: 'Headings', body: 'Body' }

const GROUP_DEFAULTS: Record<GroupKey, GroupProperties> = {
  headings: DEFAULT_CONFIG.headingsGroup,
  body: DEFAULT_CONFIG.bodyGroup,
}

const LAST_RATIO = SCALE_RATIO_PRESETS.length - 1
const DEFAULT_RATIO = SCALE_RATIO_PRESETS.findIndex((preset) => preset.name === DEFAULT_CONFIG.scaleRatioPreset)

export interface Rig {
  base: number
  setBase: (value: number) => void
  /** Index into SCALE_RATIO_PRESETS */
  ratio: number
  setRatio: (index: number) => void
  groups: Record<GroupKey, GroupProperties>
  update: (key: GroupKey, props: Partial<GroupProperties>) => void
  auto: Record<GroupKey, boolean>
  setAuto: (key: GroupKey, on: boolean) => void
}

/** One option's own copy of the controls. Auto balance starts on, as it would in the app. */
export function useRig({ base = DEFAULT_CONFIG.baseFontSize, ratio = DEFAULT_RATIO } = {}): Rig {
  const [baseSize, setBase] = useState(base)
  const [ratioIndex, setRatio] = useState(ratio)
  const [groups, setGroups] = useState(GROUP_DEFAULTS)
  const [auto, setAutoState] = useState<Record<GroupKey, boolean>>({ headings: true, body: true })

  const update = useCallback((key: GroupKey, props: Partial<GroupProperties>) => {
    setGroups((current) => ({ ...current, [key]: { ...current[key], ...props } }))
  }, [])
  const setAuto = useCallback((key: GroupKey, on: boolean) => {
    setAutoState((current) => ({ ...current, [key]: on }))
  }, [])

  const headingFont = groups.headings.fontFamily
  const bodyFont = groups.body.fontFamily
  useEffect(() => {
    loadFontFull(headingFont)
    loadFontFull(bodyFont)
  }, [headingFont, bodyFont])

  return { base: baseSize, setBase, ratio: ratioIndex, setRatio, groups, update, auto, setAuto }
}

// ── Captions ────────────────────────────────────────────────────

function ResetButton({ label, changed, onReset }: { label: string; changed: boolean; onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      aria-label={`Reset ${label}`}
      className={cn('text-muted-foreground hover:text-foreground', !changed && 'invisible')}
    >
      <RotateCcw className="size-2.5" />
    </button>
  )
}

function Caption({
  children,
  changed,
  onReset,
  className,
}: {
  children: string
  changed: boolean
  onReset: () => void
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Label className="text-xs text-muted-foreground">{children}</Label>
      <ResetButton label={children} changed={changed} onReset={onReset} />
    </div>
  )
}

/** A caption printed on the panel beside the part, the way hardware is labelled. */
function Silkscreen({
  children,
  changed,
  onReset,
  vertical,
  className,
}: {
  children: string
  changed: boolean
  onReset: () => void
  vertical?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1.5', vertical && 'rotate-180 [writing-mode:vertical-rl]', className)}>
      <span className="font-[family-name:var(--font-oswald)] text-[11px] uppercase leading-none tracking-[0.22em] text-stone-500 select-none [text-shadow:0_1px_0_rgba(255,255,255,0.5)] dark:text-stone-400/80 dark:[text-shadow:0_-1px_0_rgba(0,0,0,0.5)]">
        {children}
      </span>
      <ResetButton label={children} changed={changed} onReset={onReset} />
    </div>
  )
}

// ── Scale knob ──────────────────────────────────────────────────

const round = (n: number) => Math.round(n * 10) / 10

/** A point at a CSS angle (0 is up, clockwise) around a centre. */
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180
  return [round(cx + r * Math.sin(rad)), round(cy - r * Math.cos(rad))]
}

/** Where a preset sits on a sweep of [from, to] degrees. */
const detentAngle = (index: number, [from, to]: [number, number]) => from + (index / LAST_RATIO) * (to - from)

const DIAL_LABEL_STYLE: CSSProperties = { fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-host-grotesk)' }

interface DialProps {
  index: number
  onChange: (index: number) => void
  height: number
}

const ARC_DIAL_WIDTH = 200
/** How far the knob runs off the panel's right edge */
const ARC_DIAL_BLEED = 6

/** The current dial at a smaller size: labels on an arc to the left, knob running off the panel edge. */
function ArcDial({
  index,
  onChange,
  height,
  knob,
  arc,
  drop = 0,
}: DialProps & { knob: number; arc: [number, number]; drop?: number }) {
  const r = knob / 2
  const cx = ARC_DIAL_WIDTH - (r - ARC_DIAL_BLEED)
  const cy = height / 2 + drop

  return (
    <div className="relative -mr-4" style={{ height }} onDoubleClick={() => onChange(DEFAULT_RATIO)}>
      <svg
        className="pointer-events-none absolute right-0 top-0"
        width={ARC_DIAL_WIDTH}
        height={height}
        viewBox={`0 0 ${ARC_DIAL_WIDTH} ${height}`}
      >
        {SCALE_RATIO_PRESETS.map((preset, i) => {
          const angle = detentAngle(i, arc)
          const [x1, y1] = polar(cx, cy, r + 4, angle)
          const [x2, y2] = polar(cx, cy, r + 12, angle)
          const [lx, ly] = polar(cx, cy, r + 20, angle)
          const active = i === index
          return (
            <g key={preset.label} className="pointer-events-auto cursor-pointer" onClick={() => onChange(i)}>
              <rect x={lx - 28} y={ly - 9} width={30} height={18} fill="transparent" />
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={active ? 'stroke-foreground' : 'stroke-muted-foreground/30'}
                strokeWidth={0.75}
                strokeLinecap="round"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="end"
                dominantBaseline="central"
                className={active ? 'fill-foreground' : 'fill-muted-foreground/50 hover:fill-muted-foreground'}
                style={DIAL_LABEL_STYLE}
              >
                {preset.label}
              </text>
            </g>
          )
        })}
      </svg>
      <DialKnob
        size={knob}
        angle={detentAngle(index, arc)}
        index={index}
        onChange={onChange}
        style={{ right: -ARC_DIAL_BLEED, top: cy - r }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <MechanicalCounter value={SCALE_RATIO_PRESETS[index].value} />
        </div>
      </DialKnob>
    </div>
  )
}

const MOON_WIDTH = 189
const MOON_KNOB = 140
const MOON_ARC: [number, number] = [-48, 48]
/** How much of the knob stands clear of the seam */
const MOON_RISE = 64

/** A large knob sunk into the seam below. Only its crown shows, with the ratios fanned over it. */
function HalfMoonDial({ index, onChange, height }: DialProps) {
  const r = MOON_KNOB / 2
  // Tucked right, which leaves the top-left corner free for the caption
  const cx = MOON_WIDTH - r - 4
  const cy = height - MOON_RISE + r

  return (
    <div
      className="relative shrink-0 overflow-clip"
      style={{ width: MOON_WIDTH, height }}
      onDoubleClick={() => onChange(DEFAULT_RATIO)}
    >
      <svg
        className="pointer-events-none absolute inset-0"
        width={MOON_WIDTH}
        height={height}
        viewBox={`0 0 ${MOON_WIDTH} ${height}`}
      >
        {SCALE_RATIO_PRESETS.map((preset, i) => {
          const angle = detentAngle(i, MOON_ARC)
          const [x1, y1] = polar(cx, cy, r + 4, angle)
          const [x2, y2] = polar(cx, cy, r + 11, angle)
          const [lx, ly] = polar(cx, cy, r + 19, angle)
          const active = i === index
          return (
            <g key={preset.label} className="pointer-events-auto cursor-pointer" onClick={() => onChange(i)}>
              <rect x={lx - 11} y={ly - 9} width={22} height={18} fill="transparent" />
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={active ? 'stroke-foreground' : 'stroke-muted-foreground/30'}
                strokeWidth={0.75}
                strokeLinecap="round"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className={active ? 'fill-foreground' : 'fill-muted-foreground/50 hover:fill-muted-foreground'}
                style={DIAL_LABEL_STYLE}
              >
                {preset.label}
              </text>
            </g>
          )
        })}
      </svg>
      <DialKnob
        size={MOON_KNOB}
        angle={detentAngle(index, MOON_ARC)}
        index={index}
        onChange={onChange}
        axis="x"
        style={{ left: cx - r, top: cy - r }}
      >
        <div className="pointer-events-none absolute left-1/2 top-[19px] -translate-x-1/2">
          <MechanicalCounter value={SCALE_RATIO_PRESETS[index].value} />
        </div>
      </DialKnob>
      {/* The seam's shadow, where the knob drops below the panel */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-transparent to-black/15 dark:to-black/45" />
    </div>
  )
}

const MINI_KNOB = 48
const MINI_BOX = 62
const MINI_SWEEP: [number, number] = [-135, 135]

/** A small knob with bare detent ticks. The ratio is read off a display beside it. */
function MiniDial({ index, onChange }: Omit<DialProps, 'height'>) {
  const centre = MINI_BOX / 2
  const r = MINI_KNOB / 2

  return (
    <div
      className="relative shrink-0"
      style={{ width: MINI_BOX, height: MINI_BOX }}
      onDoubleClick={() => onChange(DEFAULT_RATIO)}
    >
      <svg className="pointer-events-none absolute inset-0" width={MINI_BOX} height={MINI_BOX}>
        {SCALE_RATIO_PRESETS.map((preset, i) => {
          const angle = detentAngle(i, MINI_SWEEP)
          const [x1, y1] = polar(centre, centre, r + 3, angle)
          const [x2, y2] = polar(centre, centre, r + 7, angle)
          return (
            <line
              key={preset.label}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className={i === index ? 'stroke-foreground' : 'stroke-muted-foreground/40'}
              strokeWidth={1}
              strokeLinecap="round"
            />
          )
        })}
      </svg>
      <DialKnob
        size={MINI_KNOB}
        angle={detentAngle(index, MINI_SWEEP)}
        index={index}
        onChange={onChange}
        style={{ left: centre - r, top: centre - r }}
      />
    </div>
  )
}

// ── Base Size + Scale decks ─────────────────────────────────────

/** The raised lip on the panel's right edge that the knob runs off, as in the app. */
const EDGE_LIP =
  'before:pointer-events-none before:absolute before:inset-y-0 before:-right-4 before:z-0 before:w-6 before:bg-gradient-to-r before:from-transparent before:to-white dark:before:via-white/[0.02] dark:before:to-white/[0.04] dark:before:shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)]'

function useDeckResets(rig: Rig) {
  return {
    base: {
      changed: rig.base !== DEFAULT_CONFIG.baseFontSize,
      onReset: () => rig.setBase(DEFAULT_CONFIG.baseFontSize),
    },
    scale: {
      changed: rig.ratio !== DEFAULT_RATIO,
      onReset: () => rig.setRatio(DEFAULT_RATIO),
    },
  }
}

/** A. The same parts at about three quarters the size. */
export function TrimDeck({ rig }: { rig: Rig }) {
  const resets = useDeckResets(rig)
  return (
    <div className={cn('relative flex', EDGE_LIP)}>
      <div className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-1.5 pb-3 pr-2 pt-2.5">
        <Caption {...resets.base} className="pl-3.5">
          Base Size
        </Caption>
        <BaseFader value={rig.base} onChange={rig.setBase} onReset={resets.base.onReset} axis="y" length={124} />
      </div>
      <div className="module-groove-v" />
      <div className="relative min-w-0 flex-1">
        <Caption {...resets.scale} className="absolute right-0 top-2.5 z-10">
          Scale
        </Caption>
        <ArcDial index={rig.ratio} onChange={rig.setRatio} height={168} knob={104} arc={[210, 340]} drop={6} />
      </div>
    </div>
  )
}

/** B. No caption row: the labels are printed beside the hardware. */
export function SilkscreenDeck({ rig }: { rig: Rig }) {
  const resets = useDeckResets(rig)
  return (
    <div className={cn('relative flex', EDGE_LIP)}>
      <div className="relative z-10 flex min-w-0 flex-1 items-center justify-center gap-2 py-2.5 pr-2">
        <Silkscreen {...resets.base} vertical>
          Base Size
        </Silkscreen>
        <BaseFader value={rig.base} onChange={rig.setBase} onReset={resets.base.onReset} axis="y" length={116} />
      </div>
      <div className="module-groove-v" />
      <div className="relative min-w-0 flex-1">
        <Silkscreen {...resets.scale} vertical className="absolute left-2.5 top-1/2 z-10 -translate-y-1/2">
          Scale
        </Silkscreen>
        <ArcDial index={rig.ratio} onChange={rig.setRatio} height={136} knob={96} arc={[215, 325]} />
      </div>
    </div>
  )
}

/** C. The knob sinks into the seam and the fader lies down. */
export function HalfMoonDeck({ rig }: { rig: Rig }) {
  const resets = useDeckResets(rig)
  return (
    <div className="flex">
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 pr-3">
        <Caption {...resets.base}>Base Size</Caption>
        <BaseFader value={rig.base} onChange={rig.setBase} onReset={resets.base.onReset} axis="x" length={124} />
      </div>
      <div className="module-groove-v" />
      <div className="relative">
        <Caption {...resets.scale} className="absolute left-3 top-2.5 z-10">
          Scale
        </Caption>
        <HalfMoonDial index={rig.ratio} onChange={rig.setRatio} height={104} />
      </div>
    </div>
  )
}

/** D. No arc at all: a small knob and a readout. */
export function StripDeck({ rig }: { rig: Rig }) {
  const resets = useDeckResets(rig)
  const preset = SCALE_RATIO_PRESETS[rig.ratio]
  return (
    <div className="flex">
      <div className="flex min-w-0 flex-col gap-1.5 pb-3 pr-3 pt-2.5">
        <Caption {...resets.base}>Base Size</Caption>
        <BaseFader value={rig.base} onChange={rig.setBase} onReset={resets.base.onReset} axis="x" length={124} />
      </div>
      <div className="module-groove-v" />
      <div className="flex min-w-0 flex-1 items-center gap-2 pl-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-3 pt-2.5">
          <Caption {...resets.scale}>Scale</Caption>
          <div
            className="hw-display !h-9 !cursor-default justify-between !px-2.5 font-[family-name:var(--font-host-grotesk)] text-sm"
            title={preset.name}
          >
            <span className="font-semibold">{preset.label}</span>
            <span className="tabular-nums opacity-80">{preset.value.toFixed(3)}</span>
          </div>
        </div>
        <MiniDial index={rig.ratio} onChange={rig.setRatio} />
      </div>
    </div>
  )
}

// ── Headings + Body ─────────────────────────────────────────────

/** How the lit key behaves while auto balance is on. */
export type Lamp = 'steady' | 'breathe' | 'tight' | 'strike'

const LAMP_CLASS: Record<Lamp, string> = {
  steady: 'hw-btn-lit-bloom',
  breathe: 'hw-btn-lit-bloom hw-btn-lit-breathe',
  tight: '',
  strike: 'hw-btn-lit-bloom hw-btn-lit-strike',
}

function AutoKey({ title, on, onToggle, lamp }: { title: string; on: boolean; onToggle: () => void; lamp: Lamp }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={on}
          aria-label={`Auto balance ${title.toLowerCase()}`}
          className={cn('hw-btn hw-btn-lit shrink-0 !h-8 !w-8 !p-0', LAMP_CLASS[lamp])}
          data-active={on}
        >
          <Sparkles className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        Auto balance {title.toLowerCase()}: {on ? 'on' : 'off'}
      </TooltipContent>
    </Tooltip>
  )
}

interface DialSpec {
  key: 'fontWeight' | 'lineHeight' | 'letterSpacing' | 'wordSpacing'
  label: string
  /** Letter spacing takes its range from the group instead. */
  range?: [number, number]
  step: number
  digits: number
  unit: string
}

const GROUP_DIALS: DialSpec[] = [
  { key: 'fontWeight', label: 'Font Weight', range: [100, 900], step: 100, digits: 0, unit: '' },
  { key: 'lineHeight', label: 'Line Height', range: [0.8, 2.5], step: 0.05, digits: 2, unit: '' },
  { key: 'letterSpacing', label: 'Letter Spacing', step: 0.005, digits: 3, unit: 'em' },
  { key: 'wordSpacing', label: 'Word Spacing', range: [-0.1, 0.5], step: 0.01, digits: 2, unit: 'em' },
]

const LETTER_SPACING_RANGE: Record<GroupKey, [number, number]> = {
  headings: HEADINGS_LETTER_SPACING_RANGE,
  body: BODY_LETTER_SPACING_RANGE,
}

/** The four dials that auto balance takes over. Shown only while it is off. */
function GroupDials({ rig, id, className }: { rig: Rig; id: GroupKey; className?: string }) {
  const group = rig.groups[id]
  const defaults = GROUP_DEFAULTS[id]

  return (
    <div className={cn('grid grid-cols-2 gap-x-5 gap-y-4 pt-4', className)}>
      {GROUP_DIALS.map(({ key, label, range, step, digits, unit }) => {
        const [min, max] = range ?? LETTER_SPACING_RANGE[id]
        const reset = () => rig.update(id, { [key]: defaults[key] })
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                {group[key] !== defaults[key] && (
                  <button type="button" onClick={reset} className="text-muted-foreground hover:text-foreground">
                    <RotateCcw className="size-2.5" />
                  </button>
                )}
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {group[key].toFixed(digits)}
                {unit}
              </span>
            </div>
            <Slider
              value={[group[key]]}
              onValueChange={([value]) => rig.update(id, { [key]: value })}
              min={min}
              max={max}
              step={step}
              formatValue={(value) => value.toFixed(digits)}
              onReset={reset}
            />
          </div>
        )
      })}
    </div>
  )
}

function GroupRow({ rig, id, lamp, merged }: { rig: Rig; id: GroupKey; lamp: Lamp; merged?: boolean }) {
  const title = GROUP_TITLES[id]
  const on = rig.auto[id]

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h3 className={cn('shrink-0 text-sm font-semibold', merged && 'w-[66px]')}>{title}</h3>
        <FontPicker
          currentFont={rig.groups[id].fontFamily}
          onSelectFont={(fontFamily) => rig.update(id, { fontFamily })}
        />
        <AutoKey title={title} on={on} onToggle={() => rig.setAuto(id, !on)} lamp={lamp} />
      </div>
      <AnimateExpand open={!on}>
        <div inert={on}>
          <GroupDials rig={rig} id={id} className={cn(merged && 'pb-2')} />
        </div>
      </AnimateExpand>
    </div>
  )
}

/**
 * Headings and Body with their dials folded away while auto balance is on.
 * `merged` puts both in one module with the font displays lined up.
 */
export function GroupStack({ rig, lamp, merged }: { rig: Rig; lamp: Lamp; merged?: boolean }) {
  if (merged) {
    return (
      <div className="flex flex-col gap-2 px-4 py-3">
        <GroupRow rig={rig} id="headings" lamp={lamp} merged />
        <GroupRow rig={rig} id="body" lamp={lamp} merged />
      </div>
    )
  }

  return (
    <>
      <div className="px-4 py-3">
        <GroupRow rig={rig} id="headings" lamp={lamp} />
      </div>
      <div className="module-groove" />
      <div className="px-4 py-3">
        <GroupRow rig={rig} id="body" lamp={lamp} />
      </div>
    </>
  )
}
