'use client'

import { useMemo, useRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { BANDS, clamp, mod, px, scaleMarks, useTuningGesture, type Tuner } from './tuner'

/** Tick and spectrum color for a hue. The glass sets how light it prints: lit on black, inked on cream. */
export const hueTint = (hue: number) => `oklch(var(--radio-tint) ${Math.round(hue)})`

const FOCUS_RING = 'outline-none focus-visible:ring-2 focus-visible:ring-accent-warm/70'

// ── Knob and wheel ──────────────────────────────────────────────

const DEG_PER_STEP = 16

const KNOB_RING_STYLE: CSSProperties = {
  boxShadow: `
    0 2px 6px rgba(0,0,0,0.25),
    0 4px 12px rgba(0,0,0,0.12),
    inset 0 1px 0 rgba(255,255,255,0.15),
    inset 0 -1px 0 rgba(0,0,0,0.15)
  `,
}

export function TuningKnob({ tuner, size = 56, className }: { tuner: Tuner; size?: number; className?: string }) {
  const { ref, bind } = useTuningGesture<HTMLDivElement>(tuner)
  const turn = { transform: `rotate(${tuner.pos * DEG_PER_STEP}deg)` }

  return (
    <div
      ref={ref}
      {...bind}
      className={cn('relative shrink-0 cursor-grab touch-none select-none rounded-full active:cursor-grabbing', FOCUS_RING, className)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-b from-stone-200 to-stone-400 ring-1 ring-stone-400/30 dark:from-stone-700 dark:to-stone-900 dark:ring-stone-600/50"
        style={KNOB_RING_STYLE}
      />
      <div className="radio-knurl pointer-events-none absolute inset-0 rounded-full transition-transform duration-150 ease-out" style={turn} />
      <div className="mini-knob-face absolute inset-[5px] rounded-full">
        {/* Finger dimple */}
        <div className="absolute inset-0 rounded-full transition-transform duration-150 ease-out" style={turn}>
          <div className="absolute left-1/2 top-[12%] size-[20%] -translate-x-1/2 rounded-full bg-black/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.25),0_1px_0_rgba(255,255,255,0.4)] dark:bg-black/40 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.07)]" />
        </div>
      </div>
    </div>
  )
}

const ROLL_PX_PER_STEP = 2

export function Thumbwheel({
  tuner,
  axis,
  reverse,
  tint,
  className,
}: {
  tuner: Tuner
  axis: 'x' | 'y'
  reverse?: boolean
  tint?: 'orange'
  className?: string
}) {
  const { ref, bind } = useTuningGesture<HTMLDivElement>(tuner, { axis, reverse, pxPerStep: 8 })
  // The ridges travel the way the finger pushed them.
  const roll = tuner.pos * ROLL_PX_PER_STEP * (reverse ? -1 : 1) * (axis === 'y' ? -1 : 1)

  return (
    <div
      ref={ref}
      {...bind}
      data-axis={axis}
      data-tint={tint}
      className={cn('radio-thumbwheel shrink-0', FOCUS_RING, className)}
      style={{ '--roll': `${roll}px` } as CSSProperties}
    />
  )
}

// ── Readout ─────────────────────────────────────────────────────

export function StationPlate({ tuner, detail, className }: { tuner: Tuner; detail?: boolean; className?: string }) {
  const { station, onAir } = tuner
  const name = onAir ? station.name : 'Custom'
  const hue = onAir ? `${Math.round(station.hue)}°` : null

  if (detail) {
    return (
      <div className={cn('hw-display !h-9 min-w-0 !cursor-default !flex-col !items-stretch justify-center gap-0.5 !px-2.5', className)}>
        <span className="truncate text-[11px] font-medium leading-[14px] tracking-wide">{name}</span>
        <span className="flex justify-between text-[9px] leading-none tabular-nums opacity-60">
          <span>{hue ?? 'Off the dial'}</span>
          {onAir && (
            <span>
              {tuner.index + 1}/{BANDS[tuner.band].stations.length}
            </span>
          )}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('hw-display !h-7 min-w-0 !cursor-default !px-2.5', className)}>
      <span className="truncate text-[11px] font-medium tracking-wide">{name}</span>
      {hue && <span className="ml-auto pl-2 text-[10px] tabular-nums opacity-60">{hue}</span>}
    </div>
  )
}

// ── Band switches ───────────────────────────────────────────────

function Lamp({ lit, className }: { lit: boolean; className?: string }) {
  return <span className={cn('hw-selector-led transition-opacity', !lit && '!bg-black/50 !shadow-none', className)} />
}

/** Piano keys: one per band, lamp over the one that's down. */
export function BandKeys({ tuner }: { tuner: Tuner }) {
  return (
    <div className="hw-btn-group flex shrink-0" role="radiogroup" aria-label="Band">
      {BANDS.map((band, b) => (
        <button
          key={band.id}
          type="button"
          role="radio"
          aria-checked={b === tuner.band}
          data-active={b === tuner.band}
          onClick={() => tuner.setBand(b)}
          className="hw-btn hw-selector-btn !h-9 w-10 justify-center !gap-1.5"
        >
          <Lamp lit={b === tuner.band} />
          <span className="text-[9px] font-semibold uppercase tracking-widest">{band.label}</span>
        </button>
      ))}
    </div>
  )
}

const SELECTOR_ANGLES = [-52, 0, 52]
const SELECTOR_LABELS = ['bottom-3 left-0', 'left-1/2 top-0 -translate-x-1/2', 'bottom-3 right-0']

/** Three-position rotary selector. Press the knob for the next band, or a label to jump. */
export function BandSelector({ tuner }: { tuner: Tuner }) {
  return (
    <div className="relative h-[50px] w-[94px] shrink-0" role="radiogroup" aria-label="Band">
      {BANDS.map((band, b) => (
        <button
          key={band.id}
          type="button"
          role="radio"
          aria-checked={b === tuner.band}
          onClick={() => tuner.setBand(b)}
          className={cn(
            'absolute text-[8px] font-semibold uppercase leading-none tracking-widest transition-colors',
            b === tuner.band ? 'text-accent-warm' : 'text-muted-foreground/60 hover:text-muted-foreground',
            SELECTOR_LABELS[b]
          )}
        >
          {band.label}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next band"
        onClick={() => tuner.setBand(mod(tuner.band + 1, BANDS.length))}
        className={cn('absolute bottom-0 left-1/2 size-9 -translate-x-1/2 cursor-pointer rounded-full', FOCUS_RING)}
      >
        <span
          className="absolute inset-0 rounded-full bg-gradient-to-b from-stone-200 to-stone-400 ring-1 ring-stone-400/30 dark:from-stone-700 dark:to-stone-900 dark:ring-stone-600/50"
          style={KNOB_RING_STYLE}
        />
        <span
          className="mini-knob-face absolute inset-[3px] rounded-full transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${SELECTOR_ANGLES[tuner.band]}deg)` }}
        >
          <span className="absolute left-1/2 top-[3px] h-2.5 w-0.5 -translate-x-1/2 rounded-full bg-stone-600 dark:bg-[oklch(0.9_0.035_85)]" />
        </span>
      </button>
    </div>
  )
}

/** One key that steps through the bands, with a lamp per band beside it. */
export function BandCycle({ tuner, className }: { tuner: Tuner; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <button
        type="button"
        onClick={() => tuner.setBand(mod(tuner.band + 1, BANDS.length))}
        className="hw-btn !h-9 !px-2.5 !text-[9px] font-semibold uppercase tracking-widest"
      >
        Band
      </button>
      <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Band">
        {BANDS.map((band, b) => (
          <button
            key={band.id}
            type="button"
            role="radio"
            aria-checked={b === tuner.band}
            onClick={() => tuner.setBand(b)}
            className={cn(
              'flex items-center gap-1.5 text-[8px] font-semibold uppercase leading-none tracking-widest transition-colors',
              b === tuner.band ? 'text-foreground' : 'text-muted-foreground/60 hover:text-muted-foreground'
            )}
          >
            <Lamp lit={b === tuner.band} className="!w-2" />
            {band.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Slide switch whose thumb sits level with the row it lights. `rows` is the glass geometry it runs beside. */
export function BandSlide({ tuner, rows }: { tuner: Tuner; rows: { pad: number; rowHeight: number } }) {
  const height = rows.pad * 2 + rows.rowHeight * BANDS.length
  const centre = ((rows.pad + rows.rowHeight * (tuner.band + 0.5)) / height) * 100

  return (
    <div className="relative w-5 shrink-0" role="radiogroup" aria-label="Band">
      <span className="absolute inset-y-1.5 left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-black/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] dark:bg-black/60 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.06)]" />
      <span
        className="hw-btn pointer-events-none !absolute inset-x-0.5 !h-3.5 -translate-y-1/2 !rounded-[2px] !p-0 transition-[top] duration-200 ease-out"
        style={{ top: `${centre}%` }}
      >
        <span className="h-px w-2 bg-black/40 shadow-[0_2px_0_rgba(0,0,0,0.4),0_-2px_0_rgba(0,0,0,0.4)]" />
      </span>
      {BANDS.map((band, b) => (
        <button
          key={band.id}
          type="button"
          role="radio"
          aria-checked={b === tuner.band}
          aria-label={band.label}
          onClick={() => tuner.setBand(b)}
          className={cn('absolute inset-x-0 h-1/3 cursor-pointer rounded-sm', FOCUS_RING)}
          style={{ top: `${(b / BANDS.length) * 100}%` }}
        />
      ))}
    </div>
  )
}

// ── Slide-rule scale ────────────────────────────────────────────

interface BandScaleProps {
  tuner: Tuner
  width: number
  rowHeight: number
  /** Space above the first row and below the last. */
  pad: number
  /** Room left of the scale for the band name and right of it for the unit. */
  inset: [number, number]
  numSize: number
  labelSize: number
  tick: number
  /** Paint each row's baseline in the hues it runs through. */
  spectrum?: boolean
}

/** Stacked horizontal bands under one travelling needle. Click or drag the glass to seek. */
export function BandScale({ tuner, width, rowHeight, pad, inset, numSize, labelSize, tick, spectrum }: BandScaleProps) {
  const x0 = inset[0]
  const x1 = width - inset[1]
  const height = pad * 2 + rowHeight * BANDS.length
  const scrubbing = useRef<number | null>(null)

  const marks = useMemo(
    () =>
      BANDS.map(({ stations }) => {
        const perStation = (x1 - x0) / (stations.length - 1)
        return scaleMarks(stations, (numSize * 2.5) / perStation, 3 / perStation)
      }),
    [x0, x1, numSize]
  )

  const toX = (at: number, band: number) => px(x0 + (at / (BANDS[band].stations.length - 1)) * (x1 - x0))

  const seekTo = (e: React.PointerEvent<HTMLDivElement>, band: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * width
    tuner.seek(Math.round(((x - x0) / (x1 - x0)) * (BANDS[band].stations.length - 1)))
  }

  return (
    <div
      className="relative cursor-pointer"
      style={{ aspectRatio: `${width} / ${height}` }}
      onPointerDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const y = ((e.clientY - rect.top) / rect.height) * height
        const band = clamp(Math.floor((y - pad) / rowHeight), 0, BANDS.length - 1)
        scrubbing.current = band
        e.currentTarget.setPointerCapture(e.pointerId)
        tuner.setBand(band)
        seekTo(e, band)
      }}
      onPointerMove={(e) => {
        if (scrubbing.current !== null) seekTo(e, scrubbing.current)
      }}
      onPointerUp={() => {
        scrubbing.current = null
      }}
      onPointerCancel={() => {
        scrubbing.current = null
      }}
    >
      {BANDS.map((band, b) => {
        const top = pad + b * rowHeight
        const baseline = top + rowHeight - 3
        const textY = baseline - tick - 2.5
        const active = b === tuner.band
        const last = band.stations.length - 1
        return (
          <div key={band.id}>
            <div
              className="radio-backlight inset-x-0"
              data-active={active}
              style={{ top: `${(top / height) * 100}%`, height: `${(rowHeight / height) * 100}%` }}
            />
            <svg viewBox={`0 0 ${width} ${height}`} className="radio-band absolute inset-0 size-full" data-active={active} aria-hidden>
              <text x={9} y={textY} fontSize={labelSize} fontWeight={700} letterSpacing={labelSize * 0.16}>
                {band.label.toUpperCase()}
              </text>
              {spectrum ? (
                Array.from({ length: 48 }, (_, i) => {
                  const from = (i / 48) * last
                  const to = ((i + 1) / 48) * last
                  return (
                    <line
                      key={i}
                      x1={toX(from, b)}
                      x2={toX(to, b)}
                      y1={baseline}
                      y2={baseline}
                      strokeWidth={1.5}
                      style={{ stroke: hueTint(band.stations[Math.round((from + to) / 2)].hue) }}
                    />
                  )
                })
              ) : (
                <line x1={x0 - 5} x2={x1 + 5} y1={baseline} y2={baseline} strokeWidth={0.5} opacity={0.6} />
              )}
              {marks[b].map((mark) => {
                const x = toX(mark.at, b)
                return (
                  <g key={mark.hue}>
                    <line
                      x1={x}
                      x2={x}
                      y1={baseline - (spectrum ? 1.5 : 0)}
                      y2={baseline - (mark.label ? tick : tick * 0.5)}
                      strokeWidth={mark.label ? 0.8 : 0.5}
                      opacity={mark.label ? 1 : 0.7}
                    />
                    {mark.label && (
                      <text x={x} y={textY} fontSize={numSize} fontWeight={500} textAnchor="middle">
                        {mark.hue}
                      </text>
                    )}
                  </g>
                )
              })}
              {inset[1] >= 30 && (
                <text x={width - 9} y={textY} fontSize={labelSize * 0.85} fontWeight={600} letterSpacing={labelSize * 0.12} textAnchor="end" opacity={0.75}>
                  HUE°
                </text>
              )}
            </svg>
          </div>
        )
      })}
      <div
        className="radio-needle inset-y-[3px]"
        data-on-air={tuner.onAir}
        style={{ left: `${(toX(tuner.index, tuner.band) / width) * 100}%` }}
      />
    </div>
  )
}
