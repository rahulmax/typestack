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
  background: "rgba(0,0,0,0.5)",
  boxShadow:
    "inset 0 1px 3px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.05)",
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
          <div key={d} className="text-[13px] font-bold text-white/80" style={DIGIT_STYLE}>
            {d}
          </div>
        ))}
      </div>
    </div>
  )
})

const MechanicalCounter = memo(function MechanicalCounter({ value }: { value: number }) {
  const str = value.toFixed(3)
  const chars = str.split("")

  return (
    <div className="flex items-center justify-center rounded-[3px]" style={COUNTER_STYLE}>
      {chars.map((ch, i) =>
        ch === "." ? (
          <span key={i} className="text-[13px] font-bold text-white/50" style={DOT_STYLE}>
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
  background:
    "conic-gradient(from 0deg, rgba(0,0,0,0.15), rgba(255,255,255,0.05), rgba(0,0,0,0.15), rgba(255,255,255,0.05), rgba(0,0,0,0.15))",
  boxShadow: `
    0 2px 8px rgba(0,0,0,0.3),
    0 4px 16px rgba(0,0,0,0.15),
    inset 0 1px 0 rgba(255,255,255,0.08),
    inset 0 -1px 0 rgba(0,0,0,0.2)
  `,
}

const KNOB_FACE_STYLE: React.CSSProperties = {
  background: `
    radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.12), transparent 60%),
    conic-gradient(
      from 0deg,
      hsl(30 2% 38%), hsl(30 2% 48%), hsl(30 2% 36%),
      hsl(30 2% 50%), hsl(30 2% 38%), hsl(30 2% 46%),
      hsl(30 2% 36%), hsl(30 2% 48%), hsl(30 2% 38%)
    )
  `,
  boxShadow: `
    inset 0 2px 4px rgba(255,255,255,0.08),
    inset 0 -2px 4px rgba(0,0,0,0.15)
  `,
}

const INDICATOR_STYLE: React.CSSProperties = {
  top: 5,
  width: 2,
  height: 8,
  borderRadius: 1,
  backgroundColor: "#4ade80",
  boxShadow: "0 0 3px rgba(74, 222, 128, 0.6), 0 0 6px rgba(74, 222, 128, 0.3)",
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
}

export const RotaryDial = memo(function RotaryDial({ value, onChange, onPresetChange }: RotaryDialProps) {
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
      <div className="absolute inset-0 rounded-full" style={OUTER_RING_STYLE} />
      {/* Knob face */}
      <div
        className="absolute inset-[3px] rounded-full cursor-grab active:cursor-grabbing"
        style={KNOB_FACE_STYLE}
      >
        {/* Indicator */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-200 ease-out"
          style={indicatorTransform}
        >
          <div className="absolute left-1/2 -translate-x-1/2" style={INDICATOR_STYLE} />
        </div>

        {/* Counter */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MechanicalCounter value={currentPreset.value} />
        </div>
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="relative" style={{ height: SVG_H, marginRight: -16 }}>
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
