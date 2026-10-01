import { useCallback, useEffect, useRef, useState } from 'react'
import type { Colorway, ColorwayBucket } from '@/data/soft-colors'
import { colorwaysIn, hexToOklch } from '@/lib/color-utils'

export interface Station extends Colorway {
  /** OKLCH hue of the colorway's most chromatic color. This is its frequency on the dial. */
  hue: number
}

export interface Band {
  id: ColorwayBucket
  label: string
  stations: Station[]
}

export const mod = (n: number, m: number) => ((n % m) + m) % m
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
/** Two decimals, so server and client markup agree whatever their trig rounding. */
export const px = (n: number) => Math.round(n * 100) / 100

function signatureHue({ bg, heading, body }: Colorway): number {
  return [bg, heading, body].map(hexToOklch).reduce((a, b) => (b.c > a.c ? b : a)).h
}

function tune(colorways: Colorway[]): Station[] {
  return colorways.map((c) => ({ ...c, hue: signatureHue(c) })).sort((a, b) => a.hue - b.hue)
}

export const BANDS: Band[] = [
  { id: 'soft', label: 'Soft', stations: tune(colorwaysIn('soft')) },
  { id: 'med', label: 'Med', stations: tune(colorwaysIn('med')) },
  { id: 'hard', label: 'Hard', stations: tune(colorwaysIn('hard')) },
]

// ── Finding colors on the dial ──────────────────────────────────

export type Tones = Pick<Colorway, 'heading' | 'body' | 'bg'>

interface Spot {
  band: number
  index: number
}

const rolesKey = ({ heading, body, bg }: Tones) => `${heading}|${body}|${bg}`.toLowerCase()

/** The colors, whatever role each plays. Swap and Cycle move colors between roles and leave this alone. */
const paletteKey = ({ heading, body, bg }: Tones) =>
  [...new Set([heading, body, bg].map((color) => color.toLowerCase()))].sort().join('|')

function spotsBy(key: (tones: Tones) => string): Map<string, Spot>[] {
  return BANDS.map(({ stations }, band) => {
    const spots = new Map<string, Spot>()
    stations.forEach((station, index) => {
      const k = key(station)
      if (!spots.has(k)) spots.set(k, { band, index })
    })
    return spots
  })
}

const BY_ROLES = spotsBy(rolesKey)
const BY_PALETTE = spotsBy(paletteKey)

/** Where colors sit on the dial, trying the `prefer` band first. The same colors in the same roles win over a swapped set. */
function locate(colors: Tones, prefer: number): Spot | null {
  const order = [prefer, ...BANDS.map((_, b) => b).filter((b) => b !== prefer)]
  for (const [spots, key] of [[BY_ROLES, rolesKey(colors)], [BY_PALETTE, paletteKey(colors)]] as const) {
    for (const band of order) {
      const spot = spots[band].get(key)
      if (spot) return spot
    }
  }
  return null
}

// ── Scale ───────────────────────────────────────────────────────

export interface ScaleMark {
  hue: number
  /** Fractional station index the hue falls on. */
  at: number
  label: boolean
}

/** Fractional station index where a hue falls on a band, or null when it's past either end. */
function hueToIndex(stations: Station[], hue: number): number | null {
  const last = stations.length - 1
  if (hue < stations[0].hue) return stations[0].hue - hue < 10 ? 0 : null
  if (hue > stations[last].hue) return hue - stations[last].hue < 10 ? last : null
  let lo = 0
  let hi = last
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (stations[mid].hue <= hue) lo = mid
    else hi = mid
  }
  const span = stations[hi].hue - stations[lo].hue
  return span === 0 ? lo : lo + (hue - stations[lo].hue) / span
}

/**
 * Stations sit evenly along a band, so the hue scale printed over them is
 * uneven, the way an AM scale bunches up towards 1600. Numbers go to the
 * roundest hues first and are dropped where they'd collide. Gaps are in stations.
 */
export function scaleMarks(stations: Station[], labelGap: number, tickGap: number): ScaleMark[] {
  const candidates: { hue: number; at: number; rank: number }[] = []
  for (let hue = 0; hue <= 360; hue += 5) {
    const at = hueToIndex(stations, hue)
    if (at === null) continue
    candidates.push({ hue, at, rank: hue % 90 === 0 ? 0 : hue % 30 === 0 ? 1 : hue % 10 === 0 ? 2 : 3 })
  }
  candidates.sort((a, b) => a.rank - b.rank || a.hue - b.hue)

  const marks: ScaleMark[] = []
  for (const { hue, at, rank } of candidates) {
    if (marks.some((m) => Math.abs(m.at - at) < tickGap)) continue
    const label = rank < 3 && marks.every((m) => !m.label || Math.abs(m.at - at) >= labelGap)
    marks.push({ hue, at, label })
  }
  return marks.sort((a, b) => a.at - b.at)
}

// ── Tuner state ─────────────────────────────────────────────────

export interface Tuner {
  /** Index of the lit band. */
  band: number
  /** Unbounded band counter, for drums that keep rolling the same way. */
  bandTurn: number
  /** Station position on the lit band. Unbounded when the dial wraps. */
  pos: number
  /** Station index on the lit band. */
  index: number
  /** The station under the needle. */
  station: Station
  /** False when the colors in use are not that station's: picked by hand, say. */
  onAir: boolean
  step: (delta: number) => void
  seek: (index: number) => void
  setBand: (band: number) => void
  scan: () => void
}

interface TunerOptions {
  /** Hue is circular, so a dial may run past 360 back to 0 instead of hitting an end stop. */
  wrap?: boolean
  band?: number
  /** Starting point along the band, 0 to 1. */
  start?: number
  /** The colors in use. Given these, the needle follows them when they change elsewhere. */
  colors?: Tones
  /** Called with the station a turn of the dial lands on. */
  onTune?: (station: Station) => void
}

interface TunerState {
  turn: number
  pos: number
}

const bandOf = (s: TunerState) => mod(s.turn, BANDS.length)
const countOf = (s: TunerState) => BANDS[bandOf(s)].stations.length
const indexOf = (s: TunerState, wrap: boolean) => (wrap ? mod(s.pos, countOf(s)) : s.pos)
const stationOf = (s: TunerState, wrap: boolean) => BANDS[bandOf(s)].stations[indexOf(s, wrap)]

function stepBy(s: TunerState, delta: number, wrap: boolean): TunerState {
  return { ...s, pos: wrap ? s.pos + delta : clamp(s.pos + delta, 0, countOf(s) - 1) }
}

function seekTo(s: TunerState, target: number, wrap: boolean): TunerState {
  const count = countOf(s)
  if (!wrap) return { ...s, pos: clamp(target, 0, count - 1) }
  // Go the short way round.
  let delta = mod(target - s.pos, count)
  if (delta > count / 2) delta -= count
  return { ...s, pos: s.pos + delta }
}

// The needle is one physical pointer shared by every band, so changing band
// keeps its place and lands on whatever station sits there.
function switchBand(s: TunerState, next: number, wrap: boolean): TunerState {
  const current = bandOf(s)
  if (next === current) return s
  let delta = mod(next - current, BANDS.length)
  if (delta > BANDS.length / 2) delta -= BANDS.length
  const from = BANDS[current].stations.length
  const to = BANDS[next].stations.length
  const pos = wrap ? Math.round((s.pos / from) * to) : Math.round((s.pos / (from - 1)) * (to - 1))
  return { turn: s.turn + delta, pos }
}

export function useTuner({ wrap = false, band: startBand = 0, start = 0.3, colors, onTune }: TunerOptions = {}): Tuner {
  const [held, setHeld] = useState<TunerState>(() => ({
    turn: startBand,
    pos: Math.round(start * (BANDS[startBand].stations.length - 1)),
  }))

  // Colors changed elsewhere pull the needle to wherever they sit on the dial.
  // Colors that sit nowhere leave it where it was, off air.
  const onStation = !colors || paletteKey(colors) === paletteKey(stationOf(held, wrap))
  const spot = colors && !onStation ? locate(colors, bandOf(held)) : null
  const state = spot ? seekTo(switchBand(held, spot.band, wrap), spot.index, wrap) : held
  const onAir = onStation || spot !== null

  // Gestures fire faster than renders, so each turn starts from the last one.
  const live = useRef({ state, onAir, onTune })
  useEffect(() => {
    live.current = { state, onAir, onTune }
  })

  const turn = useCallback(
    (move: (s: TunerState) => TunerState) => {
      const now = live.current
      const next = move(now.state)
      // Off air, even a turn that goes nowhere tunes in the station under the needle.
      if (now.onAir && next.turn === now.state.turn && next.pos === now.state.pos) return
      live.current = { ...now, state: next, onAir: true }
      setHeld(next)
      now.onTune?.(stationOf(next, wrap))
    },
    [wrap, setHeld]
  )

  const step = useCallback((delta: number) => turn((s) => stepBy(s, delta, wrap)), [turn, wrap])
  const seek = useCallback((target: number) => turn((s) => seekTo(s, target, wrap)), [turn, wrap])
  const setBand = useCallback((next: number) => turn((s) => switchBand(s, next, wrap)), [turn, wrap])

  // Anywhere on the band but here.
  const scan = useCallback(
    () =>
      turn((s) => {
        const count = countOf(s)
        const hop = 1 + Math.floor(Math.random() * (count - 1))
        return seekTo(s, mod(indexOf(s, wrap) + hop, count), wrap)
      }),
    [turn, wrap]
  )

  return {
    band: bandOf(state),
    bandTurn: state.turn,
    pos: state.pos,
    index: indexOf(state, wrap),
    station: stationOf(state, wrap),
    onAir,
    step,
    seek,
    setBand,
    scan,
  }
}

// ── Gestures ────────────────────────────────────────────────────

const WHEEL_PX_PER_STEP = 40
const TAP_SLOP = 4

interface GestureOptions {
  /** `both` treats right and up alike, which suits a round knob. */
  axis?: 'x' | 'y' | 'both'
  pxPerStep?: number
  /** For surfaces that follow the finger, like a tape under a fixed needle. */
  reverse?: boolean
  onTap?: (e: React.PointerEvent<HTMLElement>) => void
}

/** Turns a drag, a scroll or the arrow keys on an element into whole station steps. */
export function useTuningGesture<T extends HTMLElement>(
  tuner: Tuner,
  { axis = 'both', pxPerStep = 9, reverse = false, onTap }: GestureOptions = {}
) {
  const ref = useRef<T>(null)
  const drag = useRef<{ x: number; y: number; sent: number; moved: boolean } | null>(null)
  const { step, seek, index, station, band, onAir } = tuner
  const count = BANDS[band].stations.length

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let carry = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      carry -= Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX : e.deltaY
      const steps = Math.trunc(carry / WHEEL_PX_PER_STEP)
      if (!steps) return
      carry -= steps * WHEEL_PX_PER_STEP
      step(steps)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [step])

  const bind = {
    tabIndex: 0,
    role: 'slider',
    'aria-label': 'Tuning',
    'aria-valuemin': 1,
    'aria-valuemax': count,
    'aria-valuenow': index + 1,
    'aria-valuetext': onAir ? `${station.name}, hue ${Math.round(station.hue)}` : 'Custom colors',
    onPointerDown: (e: React.PointerEvent<T>) => {
      drag.current = { x: e.clientX, y: e.clientY, sent: 0, moved: false }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    onPointerMove: (e: React.PointerEvent<T>) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.x
      const dy = d.y - e.clientY
      if (Math.hypot(dx, dy) > TAP_SLOP) d.moved = true
      const travel = axis === 'x' ? dx : axis === 'y' ? dy : dx + dy
      const steps = Math.trunc(travel / pxPerStep) * (reverse ? -1 : 1)
      if (steps === d.sent) return
      step(steps - d.sent)
      d.sent = steps
    },
    onPointerUp: (e: React.PointerEvent<T>) => {
      if (drag.current && !drag.current.moved) onTap?.(e)
      drag.current = null
    },
    onPointerCancel: () => {
      drag.current = null
    },
    onKeyDown: (e: React.KeyboardEvent<T>) => {
      const steps: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
      if (e.key in steps) step(steps[e.key])
      else if (e.key === 'Home') seek(0)
      else if (e.key === 'End') seek(count - 1)
      else return
      e.preventDefault()
    },
  }

  return { ref, bind }
}

/** Glides after a target value, re-rendering each frame while it moves. */
export function useEased(target: number, settle = 0.00002): number {
  const [value, setValue] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let last = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const gap = target - current.current
      if (still || Math.abs(gap) < settle) {
        current.current = target
        setValue(target)
        return
      }
      current.current += gap * (1 - Math.exp(-dt / 0.07))
      setValue(current.current)
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [target, settle])

  return value
}
