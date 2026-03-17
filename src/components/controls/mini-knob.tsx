"use client"

import { memo, useRef, useCallback, useEffect } from "react"
import { RotateCcw } from "lucide-react"

const KNOB_SIZE = 96
const SNAP_THRESHOLD = 6
const SENSITIVITY = 2.4

// ── Rolling mechanical counter ──────────────────────────────────

const DIGIT_H = 16
const DIGIT_W = 9
const DIGIT_CELLS = Array.from({ length: 10 }, (_, d) => d)

const RollingDigit = memo(function RollingDigit({ digit }: { digit: number }) {
  return (
    <div style={{ height: DIGIT_H, width: DIGIT_W, overflow: "hidden" }}>
      <div
        style={{
          transform: `translateY(${-digit * DIGIT_H}px)`,
          transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {DIGIT_CELLS.map((d) => (
          <div
            key={d}
            className="text-[13px] font-bold text-stone-900/80 dark:text-white/80"
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
})

const KnobCounter = memo(function KnobCounter({ value, suffix }: { value: string; suffix?: string }) {
  const chars = value.split("")

  return (
    <div
      className="flex items-center justify-center rounded-[2px] bg-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15),inset_0_-1px_1px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.1)] dark:bg-black/50 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),inset_0_-1px_1px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.05)]"
      style={{ height: 22, padding: "0 3px" }}
    >
      {chars.map((ch, i) =>
        ch === "-" ? (
          <span key={i} className="text-[13px] font-bold text-stone-900/50 dark:text-white/50" style={{ width: 5, textAlign: "center", fontFamily: "var(--font-host-grotesk)" }}>
            −
          </span>
        ) : ch === "." ? (
          <span key={i} className="text-[13px] font-bold text-stone-900/50 dark:text-white/50" style={{ width: 5, textAlign: "center", fontFamily: "var(--font-host-grotesk)" }}>
            .
          </span>
        ) : (
          <RollingDigit key={i} digit={parseInt(ch)} />
        )
      )}
      {suffix && (
        <span className="text-[13px] font-bold text-stone-900/40 dark:text-white/40 ml-px" style={{ fontFamily: "var(--font-host-grotesk)" }}>
          {suffix}
        </span>
      )}
    </div>
  )
})

// ── Knob ────────────────────────────────────────────────────────

interface MiniKnobProps {
  value: number
  min: number
  max: number
  infinite?: boolean
  step?: number
  snapPoints?: number[]
  label: string
  formatValue?: (v: number) => string
  counterValue?: string
  counterSuffix?: string
  defaultValue?: number
  onChange: (value: number) => void
  onReset?: () => void
}

export const MiniKnob = memo(function MiniKnob({
  value,
  min,
  max,
  infinite,
  step = 1,
  snapPoints,
  label,
  counterValue,
  counterSuffix,
  defaultValue = 0,
  onChange,
  onReset,
}: MiniKnobProps) {
  const knobRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startY: number; startValue: number } | null>(null)


  const clampAndSnap = useCallback(
    (raw: number) => {
      let v: number
      if (infinite) {
        v = Math.max(min, Math.min(max, raw))
      } else {
        v = Math.max(min, Math.min(max, raw))
      }
      if (step) v = Math.round(v / step) * step
      if (snapPoints) {
        for (const sp of snapPoints) {
          if (Math.abs(v - sp) <= SNAP_THRESHOLD) {
            v = sp
            break
          }
        }
      }
      return v
    },
    [min, max, step, snapPoints, infinite]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      dragRef.current = { startY: e.clientY, startValue: value }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [value]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return
      const dy = dragRef.current.startY - e.clientY
      const raw = dragRef.current.startValue + dy * SENSITIVITY
      onChange(clampAndSnap(raw))
    },
    [onChange, clampAndSnap]
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
      const increment = step || 1
      onChange(clampAndSnap(value + dir * increment))
    }
    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [value, step, onChange, clampAndSnap])

  const indicatorAngle = ((value - min) / (max - min)) * 300 - 150

  // Counter display string
  const counterStr = counterValue ?? `${Math.round(value)}`

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Label */}
      <span className="text-xs font-medium text-muted-foreground -ml-8 flex items-center gap-1">
        {label}
        {value !== defaultValue && onReset && (
          <button type="button" onClick={onReset} className="text-muted-foreground hover:text-foreground">
            <RotateCcw className="size-2.5" />
          </button>
        )}
      </span>

      {/* Knob body — sharp corners */}
      <div
        ref={knobRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ width: KNOB_SIZE, height: KNOB_SIZE }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={onReset}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-b from-stone-200 to-stone-400 dark:from-stone-700 dark:to-stone-900 ring-1 ring-stone-400/30 dark:ring-stone-600/50"
          style={{
            boxShadow: `
              0 2px 6px rgba(0,0,0,0.25),
              0 4px 12px rgba(0,0,0,0.12),
              inset 0 1px 0 rgba(255,255,255,0.15),
              inset 0 -1px 0 rgba(0,0,0,0.15)
            `,
          }}
        />
        {/* Gripper notches — paired highlight/shadow for 3D ridges */}
        <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
          {Array.from({ length: 96 }, (_, i) => {
            const deg = (i / 96) * 360
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
                    width: 1,
                    height: 7,
                    left: x - 0.5 + Math.cos(perpRad) * off,
                    top: y - 3.5 + Math.sin(perpRad) * off,
                    transform: `rotate(${deg}deg)`,
                    background: 'rgba(0,0,0,0.1)',
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    width: 1,
                    height: 7,
                    left: x - 0.5 - Math.cos(perpRad) * off,
                    top: y - 3.5 - Math.sin(perpRad) * off,
                    transform: `rotate(${deg}deg)`,
                    background: 'rgba(255,255,255,0.08)',
                  }}
                />
              </div>
            )
          })}
        </div>
        {/* Knob face — flat top with hard edge */}
        <div
          className="absolute inset-[3px] rounded-full mini-knob-face"
        >
          {/* Green indicator */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none transition-transform duration-150 ease-out"
            style={{ transform: `rotate(${indicatorAngle}deg)` }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-stone-500 shadow-[0_0_3px_rgba(0,0,0,0.3)] dark:bg-green-400 dark:shadow-[0_0_3px_rgba(74,222,128,0.6),0_0_6px_rgba(74,222,128,0.3)]"
              style={{ top: 5, width: 2, height: 8, borderRadius: 1 }}
            />
          </div>

          {/* Counter in center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <KnobCounter value={counterStr} suffix={counterSuffix} />
          </div>
        </div>
      </div>
    </div>
  )
})
