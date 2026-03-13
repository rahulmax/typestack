"use client"

import { useRef, useCallback, useEffect } from "react"
import { SCALE_RATIO_PRESETS } from "@/data/scale-ratios"

const PRESET_COUNT = SCALE_RATIO_PRESETS.length

// Left-side arc: bottom-left (MIN) to top-left (MAX)
const ARC_START = 210
const ARC_END = 340
const ARC_RANGE = ARC_END - ARC_START

const KNOB_SIZE = 100
const KNOB_R = KNOB_SIZE / 2
const KNOB_BLEED = 15

const TICK_R1 = KNOB_R + 5
const TICK_R2 = KNOB_R + 14
const LABEL_R = KNOB_R + 22

const SVG_W = 280
const SVG_H = 210
const CX = SVG_W
const CY = SVG_H / 2

const STEP_PX = 30 // pixels of drag per preset step

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

// ── Rolling mechanical counter ──────────────────────────────────

const DIGIT_H = 16
const DIGIT_W = 9

function RollingDigit({ digit }: { digit: number }) {
  return (
    <div style={{ height: DIGIT_H, width: DIGIT_W, overflow: "hidden" }}>
      <div
        style={{
          transform: `translateY(${-digit * DIGIT_H}px)`,
          transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <div
            key={d}
            className="text-[13px] font-bold text-white/80"
            style={{
              height: DIGIT_H,
              lineHeight: `${DIGIT_H}px`,
              textAlign: "center",
              fontFamily: "var(--font-host-grotesk)",
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

function MechanicalCounter({ value }: { value: number }) {
  const str = value.toFixed(3)
  // str = "1.XXX" — split into individual characters
  const chars = str.split("")

  return (
    <div
      className="flex items-center justify-center rounded-[3px]"
      style={{
        height: 22,
        background: "rgba(0,0,0,0.5)",
        boxShadow:
          "inset 0 1px 3px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.05)",
        padding: "0 3px",
      }}
    >
      {chars.map((ch, i) =>
        ch === "." ? (
          <span
            key={i}
            className="text-[13px] font-bold text-white/50"
            style={{
              width: 5,
              textAlign: "center",
              fontFamily: "var(--font-host-grotesk)",
            }}
          >
            .
          </span>
        ) : (
          <RollingDigit key={i} digit={parseInt(ch)} />
        )
      )}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────

interface RotaryDialProps {
  value: number
  onChange: (value: number) => void
  onPresetChange?: (presetName: string) => void
}

export function RotaryDial({ value, onChange, onPresetChange }: RotaryDialProps) {
  const knobRef = useRef<HTMLDivElement>(null)
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

  return (
    <div className="relative" style={{ height: SVG_H, marginRight: -16 }}>
      {/* Tick marks and labels */}
      <svg
        className="absolute top-0 pointer-events-none"
        style={{ right: KNOB_R - KNOB_BLEED, width: SVG_W, height: SVG_H }}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      >
        {SCALE_RATIO_PRESETS.map((preset, index) => {
          const a = indexToAngle(index)
          const [x1, y1] = cssAngleToXY(a, TICK_R1)
          const [x2, y2] = cssAngleToXY(a, TICK_R2)
          const [lx, ly] = cssAngleToXY(a, LABEL_R)
          const isActive = index === currentIndex

          return (
            <g key={preset.label}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                className={isActive ? "stroke-foreground" : "stroke-muted-foreground/40"}
                strokeWidth={isActive ? 2 : 1}
                strokeLinecap="round"
              />
              {/* "Name  Code" — right-aligned so code is nearest to tick */}
              <text
                x={lx} y={ly}
                textAnchor="end"
                dominantBaseline="central"
                className={isActive ? "fill-foreground" : "fill-muted-foreground/50"}
                style={{ fontSize: 10, fontWeight: 600, fontFamily: "var(--font-host-grotesk)" }}
              >
                {preset.name}
                <tspan dx={5}>{preset.label}</tspan>
              </text>
            </g>
          )
        })}
      </svg>

      {/* Knob */}
      <div
        ref={knobRef}
        className="absolute select-none"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          right: -KNOB_BLEED,
          top: (SVG_H - KNOB_SIZE) / 2,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(0,0,0,0.15), rgba(255,255,255,0.05), rgba(0,0,0,0.15), rgba(255,255,255,0.05), rgba(0,0,0,0.15))",
            boxShadow: `
              0 2px 8px rgba(0,0,0,0.3),
              0 4px 16px rgba(0,0,0,0.15),
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.2)
            `,
          }}
        />
        {/* Knob face */}
        <div
          className="absolute inset-[3px] rounded-full cursor-grab active:cursor-grabbing"
          style={{
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
          }}
        >
          {/* Indicator */}
          <div
            className="absolute inset-0 rounded-full transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: 7,
                width: 3,
                height: 16,
                borderRadius: 2,
                backgroundColor: "#4ade80",
                boxShadow:
                  "0 0 4px rgba(74, 222, 128, 0.6), 0 0 8px rgba(74, 222, 128, 0.3)",
              }}
            />
          </div>

          {/* Counter */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <MechanicalCounter value={currentPreset.value} />
          </div>
        </div>

        {/* Knurled edge dots */}
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox={`0 0 ${KNOB_SIZE} ${KNOB_SIZE}`}
        >
          {Array.from({ length: 56 }, (_, i) => {
            const a = (i / 56) * 360
            const rad = a * (Math.PI / 180)
            const r = KNOB_R - 1.5
            return (
              <circle
                key={i}
                cx={Math.round((KNOB_R + r * Math.cos(rad)) * 10) / 10}
                cy={Math.round((KNOB_R + r * Math.sin(rad)) * 10) / 10}
                r={0.5}
                className="fill-white/10"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
