"use client"

import { memo, useRef, useCallback, useEffect, useMemo } from "react"
import { SCALE_RATIO_PRESETS } from "@/data/scale-ratios"

const PRESET_COUNT = SCALE_RATIO_PRESETS.length

const ARC_START = 210
const ARC_END = 340
const ARC_RANGE = ARC_END - ARC_START

const KNOB_SIZE = 120
const KNOB_R = KNOB_SIZE / 2
const KNOB_BLEED = 15

const TICK_R1 = KNOB_R + 5
const TICK_R2 = KNOB_R + 14
const LABEL_R = KNOB_R + 24

const SVG_W = 280
const SVG_H = 210
const CX = SVG_W - 8
const CY = SVG_H / 2

const STEP_PX = 20

function indexToAngle(index: number): number {
  return ARC_START + (index / (PRESET_COUNT - 1)) * ARC_RANGE
}

function cssAngleToXY(cssDeg: number, r: number): [number, number] {
  const rad = (cssDeg - 90) * (Math.PI / 180)
  return [Math.round(CX + r * Math.cos(rad)), Math.round(CY + r * Math.sin(rad))]
}

function findNearestIndex(value: number): number {
  let nearest = 0
  let minDist = Infinity
  for (let i = 0; i < PRESET_COUNT; i++) {
    const dist = Math.abs(value - SCALE_RATIO_PRESETS[i].value)
    if (dist < minDist) {
      minDist = dist
      nearest = i
    }
  }
  return nearest
}

// Pre-compute tick + label positions
const LABEL_POSITIONS = SCALE_RATIO_PRESETS.map((preset, index) => {
  const a = indexToAngle(index)
  const [x1, y1] = cssAngleToXY(a, TICK_R1)
  const [x2, y2] = cssAngleToXY(a, TICK_R2)
  const [lx, ly] = cssAngleToXY(a, LABEL_R)
  return { x1, y1, x2, y2, lx, ly, label: preset.label }
})

// ── Rolling mechanical counter ──────────────────────────────────

const DIGIT_H = 16
const DIGIT_W = 9

const DIGIT_STYLE: React.CSSProperties = {
  height: DIGIT_H,
  lineHeight: `${DIGIT_H}px`,
  textAlign: "center",
  fontFamily: "var(--font-host-grotesk)",
}

const ROLLER_STYLE: React.CSSProperties = {
  height: DIGIT_H,
  width: DIGIT_W,
  overflow: "hidden",
}

const DOT_STYLE: React.CSSProperties = {
  width: 5,
  textAlign: "center",
  fontFamily: "var(--font-host-grotesk)",
}

const COUNTER_STYLE: React.CSSProperties = {
  height: 22,
  padding: "0 3px",
}

const DIGIT_CELLS = Array.from({ length: 10 }, (_, d) => d)

const RollingDigit = memo(function RollingDigit({ digit }: { digit: number }) {
  return (
    <div style={ROLLER_STYLE}>
      <div
        style={{
          transform: `translateY(${-digit * DIGIT_H}px)`,
          transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {DIGIT_CELLS.map((d) => (
          <div key={d} className="text-[13px] font-bold text-stone-900/80 dark:text-white/80" style={DIGIT_STYLE}>
            {d}
          </div>
        ))}
      </div>
    </div>
  )
})

export const MechanicalCounter = memo(function MechanicalCounter({ value }: { value: number }) {
  const str = value.toFixed(3)
  const chars = str.split("")

  return (
    <div className="flex items-center justify-center rounded-[3px] bg-white/30 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),inset_0_-1px_1px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.1)] dark:bg-black/50 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.6),inset_0_-1px_1px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.05)]" style={COUNTER_STYLE}>
      {chars.map((ch, i) =>
        ch === "." ? (
          <span key={i} className="text-[13px] font-bold text-stone-900/50 dark:text-white/50" style={DOT_STYLE}>
            .
          </span>
        ) : (
          <RollingDigit key={i} digit={parseInt(ch)} />
        )
      )}
    </div>
  )
})

// ── Knob static styles ──────────────────────────────────────────

const OUTER_RING_STYLE: React.CSSProperties = {
  boxShadow: `
    0 2px 6px rgba(0,0,0,0.25),
    0 4px 12px rgba(0,0,0,0.12),
    0 8px 24px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.12),
    inset 0 -1px 0 rgba(0,0,0,0.15)
  `,
}

const KNOB_FACE_STYLE: React.CSSProperties = {
  boxShadow: `
    inset 0 2px 4px rgba(255,255,255,0.15),
    inset 0 -3px 6px rgba(0,0,0,0.12),
    inset 0 0 0 1px rgba(0,0,0,0.04)
  `,
}

const INDICATOR_STYLE: React.CSSProperties = {
  top: 5,
  width: 2,
  height: 8,
  borderRadius: 1,
}

const SVG_STYLE: React.CSSProperties = {
  right: KNOB_R - KNOB_BLEED,
  width: SVG_W,
  height: SVG_H,
}

// ── Main component ──────────────────────────────────────────────

interface RotaryDialProps {
  value: number
  onChange: (value: number) => void
  onPresetChange?: (presetName: string) => void
  onReset?: () => void
}

export const RotaryDial = memo(function RotaryDial({ value, onChange, onPresetChange, onReset }: RotaryDialProps) {
  const knobRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startY: number; startIndex: number } | null>(null)

  const currentIndex = findNearestIndex(value)
  const angle = indexToAngle(currentIndex)
  const currentPreset = SCALE_RATIO_PRESETS[currentIndex]

  const applyPreset = useCallback(
    (index: number) => {
      const preset = SCALE_RATIO_PRESETS[index]
      onChange(preset.value)
      onPresetChange?.(preset.name)
    },
    [onChange, onPresetChange]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      dragRef.current = { startY: e.clientY, startIndex: currentIndex }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [currentIndex]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return
      const dy = dragRef.current.startY - e.clientY
      const steps = Math.round(dy / STEP_PX)
      const newIndex = Math.max(0, Math.min(PRESET_COUNT - 1, dragRef.current.startIndex + steps))
      applyPreset(newIndex)
    },
    [applyPreset]
  )

  const handlePointerUp = useCallback(() => {
    dragRef.current = null
  }, [])


  useEffect(() => {
    const el = knobRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const dir = e.deltaY > 0 ? -1 : 1
      const idx = findNearestIndex(value)
      const next = Math.max(0, Math.min(PRESET_COUNT - 1, idx + dir))
      if (next !== idx) applyPreset(next)
    }
    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [value, applyPreset])

  const indicatorTransform = useMemo(
    () => ({ transform: `rotate(${angle}deg)` }),
    [angle]
  )

  const knobElement = (
    <div
      ref={knobRef}
      className="absolute select-none pointer-events-auto"
      style={{
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        right: -KNOB_BLEED + 8,
        top: (SVG_H - KNOB_SIZE) / 2,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-stone-200 to-stone-400 dark:from-stone-700 dark:to-stone-900 ring-1 ring-stone-400/30 dark:ring-stone-600/50" style={OUTER_RING_STYLE} />
      {/* Gripper notches */}
      <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
        {Array.from({ length: 120 }, (_, i) => {
          const deg = (i / 120) * 360
          const rad = ((deg - 90) * Math.PI) / 180
          const r = KNOB_SIZE / 2 - 0.5
          const cx = KNOB_SIZE / 2
          const x = cx + r * Math.cos(rad)
          const y = cx + r * Math.sin(rad)
          const perpRad = rad + Math.PI / 2
          const off = 0.6
          return (
            <div key={i}>
              <div
                className="absolute"
                style={{
                  width: '1px',
                  height: '7px',
                  left: `${(x - 0.5 + Math.cos(perpRad) * off).toFixed(2)}px`,
                  top: `${(y - 3.5 + Math.sin(perpRad) * off).toFixed(2)}px`,
                  transform: `rotate(${deg}deg)`,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }}
              />
              <div
                className="absolute"
                style={{
                  width: '1px',
                  height: '7px',
                  left: `${(x - 0.5 - Math.cos(perpRad) * off).toFixed(2)}px`,
                  top: `${(y - 3.5 - Math.sin(perpRad) * off).toFixed(2)}px`,
                  transform: `rotate(${deg}deg)`,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                }}
              />
            </div>
          )
        })}
      </div>
      {/* Knob face */}
      <div
        className="absolute inset-[3px] rounded-full cursor-grab active:cursor-grabbing bg-gradient-to-b from-stone-100 to-stone-300 dark:from-stone-800 dark:to-stone-950"
        style={KNOB_FACE_STYLE}
      >
        {/* Indicator */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-200 ease-out"
          style={indicatorTransform}
        >
          <div className="absolute left-1/2 -translate-x-1/2 bg-stone-500 shadow-[0_0_3px_rgba(0,0,0,0.3)] dark:bg-green-400 dark:shadow-[0_0_3px_rgba(74,222,128,0.6),0_0_6px_rgba(74,222,128,0.3)]" style={INDICATOR_STYLE} />
        </div>

        {/* Counter */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MechanicalCounter value={currentPreset.value} />
        </div>
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="relative" style={{ height: SVG_H, marginRight: -16 }} onDoubleClick={onReset}>
      {/* Tick lines + labels with hit areas */}
      <svg
        className="absolute top-0"
        style={SVG_STYLE}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      >
        {LABEL_POSITIONS.map((pos, index) => {
          const isActive = index === currentIndex
          return (
            <g
              key={pos.label}
              className="cursor-pointer"
              onClick={() => applyPreset(index)}
            >
              {/* Invisible hit area */}
              <rect
                x={pos.lx - 30}
                y={pos.ly - 10}
                width={30}
                height={20}
                fill="transparent"
              />
              <line
                x1={pos.x1} y1={pos.y1} x2={pos.x2} y2={pos.y2}
                className={isActive ? "stroke-foreground" : "stroke-muted-foreground/30"}
                strokeWidth={0.75}
                strokeLinecap="round"
              />
              <text
                x={pos.lx} y={pos.ly}
                textAnchor="end"
                dominantBaseline="central"
                className={isActive ? "fill-foreground" : "fill-muted-foreground/50 hover:fill-muted-foreground"}
                style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--font-host-grotesk)" }}
              >
                {pos.label}
              </text>
            </g>
          )
        })}
      </svg>

      {knobElement}
    </div>
  )
})

// ── Knob with detents ───────────────────────────────────────────

const FOCUS_RING = "outline-none focus-visible:ring-2 focus-visible:ring-accent-warm/70"

const clampIndex = (index: number) => Math.max(0, Math.min(PRESET_COUNT - 1, index))

/** Drag, scroll or arrow through the ratio presets one detent at a time. */
function useDetents(index: number, onChange: (index: number) => void, axis: "x" | "y") {
  const ref = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ start: number; from: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const next = clampIndex(index + (e.deltaY > 0 ? -1 : 1))
      if (next !== index) onChange(next)
    }
    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [index, onChange])

  const along = (e: React.PointerEvent) => (axis === "y" ? -e.clientY : e.clientX)
  const preset = SCALE_RATIO_PRESETS[index]

  const bind = {
    role: "slider",
    tabIndex: 0,
    "aria-label": "Scale ratio",
    "aria-valuemin": 0,
    "aria-valuemax": PRESET_COUNT - 1,
    "aria-valuenow": index,
    "aria-valuetext": `${preset.name}, ${preset.value}`,
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      dragRef.current = { start: along(e), from: index }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return
      const steps = Math.round((along(e) - dragRef.current.start) / STEP_PX)
      onChange(clampIndex(dragRef.current.from + steps))
    },
    onPointerUp: () => {
      dragRef.current = null
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      const step = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key]
      if (!step) return
      e.preventDefault()
      onChange(clampIndex(index + step))
    },
  }

  return { ref, bind }
}

/** Knurled grip: one notch per pixel of diameter, the pitch of the full-size dial. */
const Knurl = memo(function Knurl({ size }: { size: number }) {
  const centre = size / 2
  const r = centre - 0.5
  return (
    <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
      {Array.from({ length: size }, (_, i) => {
        const deg = (i / size) * 360
        const rad = ((deg - 90) * Math.PI) / 180
        const x = centre + r * Math.cos(rad) - 0.5
        const y = centre + r * Math.sin(rad) - 3.5
        const dx = Math.cos(rad + Math.PI / 2) * 0.6
        const dy = Math.sin(rad + Math.PI / 2) * 0.6
        const transform = `rotate(${deg.toFixed(2)}deg)`
        return (
          <div key={i}>
            <div
              className="absolute h-[7px] w-px bg-black/10"
              style={{ left: `${(x + dx).toFixed(2)}px`, top: `${(y + dy).toFixed(2)}px`, transform }}
            />
            <div
              className="absolute h-[7px] w-px bg-white/[0.08]"
              style={{ left: `${(x - dx).toFixed(2)}px`, top: `${(y - dy).toFixed(2)}px`, transform }}
            />
          </div>
        )
      })}
    </div>
  )
})

interface DialKnobProps {
  size: number
  /** Where the indicator points, in CSS degrees */
  angle: number
  /** Index into SCALE_RATIO_PRESETS */
  index: number
  onChange: (index: number) => void
  /** Which way a drag turns it. Defaults to up and down. */
  axis?: "x" | "y"
  style: React.CSSProperties
  children?: React.ReactNode
}

/** The scale knob at any size. Positioned by its parent. */
export function DialKnob({ size, angle, index, onChange, axis = "y", style, children }: DialKnobProps) {
  const { ref, bind } = useDetents(index, onChange, axis)

  return (
    <div
      ref={ref}
      {...bind}
      className={`absolute select-none touch-none rounded-full cursor-grab active:cursor-grabbing ${FOCUS_RING}`}
      style={{ width: size, height: size, ...style }}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-stone-200 to-stone-400 dark:from-stone-700 dark:to-stone-900 ring-1 ring-stone-400/30 dark:ring-stone-600/50" style={OUTER_RING_STYLE} />
      <Knurl size={size} />
      {/* Knob face */}
      <div
        className="absolute inset-[3px] rounded-full bg-gradient-to-b from-stone-100 to-stone-300 dark:from-stone-800 dark:to-stone-950"
        style={KNOB_FACE_STYLE}
      >
        {/* Indicator */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="absolute left-1/2 -translate-x-1/2 bg-stone-500 shadow-[0_0_3px_rgba(0,0,0,0.3)] dark:bg-green-400 dark:shadow-[0_0_3px_rgba(74,222,128,0.6),0_0_6px_rgba(74,222,128,0.3)]" style={INDICATOR_STYLE} />
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Half-moon dial ──────────────────────────────────────────────
// A large knob sunk into the seam below. Only its crown shows, with the ratios fanned over it.

const MOON_W = 189
const MOON_H = 104
const MOON_KNOB = 140
const MOON_R = MOON_KNOB / 2
/** How much of the knob stands clear of the seam */
const MOON_RISE = 64
/** Sweep of the fan either side of straight up, in degrees */
const MOON_SWEEP = 54

// Tucked right, which leaves the top-left corner free for the caption
const MOON_CX = MOON_W - MOON_R - 11
const MOON_CY = MOON_H - MOON_RISE + MOON_R

const moonAngle = (index: number) => -MOON_SWEEP + (index / (PRESET_COUNT - 1)) * MOON_SWEEP * 2

function moonXY(deg: number, r: number): [number, number] {
  const rad = (deg * Math.PI) / 180
  return [
    Math.round((MOON_CX + r * Math.sin(rad)) * 10) / 10,
    Math.round((MOON_CY - r * Math.cos(rad)) * 10) / 10,
  ]
}

const MOON_LABELS = SCALE_RATIO_PRESETS.map((preset, index) => {
  const a = moonAngle(index)
  const [x1, y1] = moonXY(a, MOON_R + 4)
  const [x2, y2] = moonXY(a, MOON_R + 11)
  const [lx, ly] = moonXY(a, MOON_R + 19)
  return { x1, y1, x2, y2, lx, ly, label: preset.label }
})

const MOON_STYLE: React.CSSProperties = { width: MOON_W, height: MOON_H }
const MOON_KNOB_STYLE: React.CSSProperties = { left: MOON_CX - MOON_R, top: MOON_CY - MOON_R }
const MOON_LABEL_STYLE: React.CSSProperties = { fontSize: 11, fontWeight: 600, fontFamily: "var(--font-host-grotesk)" }

export const HalfMoonDial = memo(function HalfMoonDial({ value, onChange, onPresetChange, onReset }: RotaryDialProps) {
  const currentIndex = findNearestIndex(value)

  const applyPreset = useCallback(
    (index: number) => {
      const preset = SCALE_RATIO_PRESETS[index]
      onChange(preset.value)
      onPresetChange?.(preset.name)
    },
    [onChange, onPresetChange]
  )

  return (
    // clip, not hidden: a hidden box would scroll to the sunk part of the knob on focus
    <div className="relative shrink-0 overflow-clip" style={MOON_STYLE} onDoubleClick={onReset}>
      {/* Tick lines + labels with hit areas */}
      <svg className="absolute inset-0 pointer-events-none" width={MOON_W} height={MOON_H} viewBox={`0 0 ${MOON_W} ${MOON_H}`}>
        {MOON_LABELS.map((pos, index) => {
          const isActive = index === currentIndex
          return (
            <g key={pos.label} className="pointer-events-auto cursor-pointer" onClick={() => applyPreset(index)}>
              {/* Invisible hit area */}
              <rect x={pos.lx - 12} y={pos.ly - 9} width={24} height={18} fill="transparent" />
              <line
                x1={pos.x1} y1={pos.y1} x2={pos.x2} y2={pos.y2}
                className={isActive ? "stroke-foreground" : "stroke-muted-foreground/30"}
                strokeWidth={0.75}
                strokeLinecap="round"
              />
              <text
                x={pos.lx} y={pos.ly}
                textAnchor="middle"
                dominantBaseline="central"
                className={isActive ? "fill-foreground" : "fill-muted-foreground/50 hover:fill-muted-foreground"}
                style={MOON_LABEL_STYLE}
              >
                {pos.label}
              </text>
            </g>
          )
        })}
      </svg>

      <DialKnob size={MOON_KNOB} angle={moonAngle(currentIndex)} index={currentIndex} onChange={applyPreset} axis="x" style={MOON_KNOB_STYLE}>
        {/* Counter */}
        <div className="absolute left-1/2 top-[19px] -translate-x-1/2 pointer-events-none">
          <MechanicalCounter value={SCALE_RATIO_PRESETS[currentIndex].value} />
        </div>
      </DialKnob>
    </div>
  )
})
