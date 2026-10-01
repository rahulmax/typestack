"use client"

import { RotateCcw } from "lucide-react"
import { Label } from "@/components/ui/label"
import { HalfMoonDial } from "./rotary-dial"
import { DEFAULT_CONFIG, BASE_FONT_SIZE_RANGE } from "@/data/default-config"
import { useTypographyStore } from "@/store/typography-store"
import { cn } from "@/lib/utils"

const [FADER_MIN, FADER_MAX] = BASE_FONT_SIZE_RANGE
const FADER_INSET = 2
const FADER_THUMB = { x: 64, y: 32 }

function FaderGrip({ axis, side }: { axis: "x" | "y"; side: "left-1.5" | "right-1.5" }) {
  return (
    <div
      className={cn(
        "absolute top-1/2 -translate-y-1/2 flex pointer-events-none",
        side,
        axis === "y" ? "flex-col gap-[3px]" : "gap-[2px]"
      )}
    >
      {Array.from({ length: axis === "y" ? 3 : 2 }, (_, i) => (
        <span key={i} className={cn("block bg-stone-400/30 dark:bg-white/25", axis === "y" ? "w-1 h-px" : "h-1.5 w-px")} />
      ))}
    </div>
  )
}

interface BaseFaderProps {
  value: number
  onChange: (v: number) => void
  onReset?: () => void
  /** Lying down or standing up */
  axis: "x" | "y"
  /** Size along the axis, in px */
  length: number
}

/** The base size fader. */
export function BaseFader({ value, onChange, onReset, axis, length }: BaseFaderProps) {
  const thumb = FADER_THUMB[axis]
  const travel = length - thumb - FADER_INSET * 2
  const position = (value - FADER_MIN) / (FADER_MAX - FADER_MIN)
  const offset = FADER_INSET + (axis === "y" ? 1 - position : position) * travel
  const atLimit = value <= FADER_MIN || value >= FADER_MAX

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const along = axis === "y" ? e.clientY - rect.top : e.clientX - rect.left
    const at = Math.max(0, Math.min(1, (along - FADER_INSET - thumb / 2) / travel))
    onChange(Math.round(FADER_MIN + (axis === "y" ? 1 - at : at) * (FADER_MAX - FADER_MIN)))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    onChange(Math.max(FADER_MIN, Math.min(FADER_MAX, value + step)))
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Base size"
      aria-orientation={axis === "y" ? "vertical" : "horizontal"}
      aria-valuemin={FADER_MIN}
      aria-valuemax={FADER_MAX}
      aria-valuenow={value}
      aria-valuetext={`${value}px`}
      className="relative shrink-0 rounded-[5px] overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing bg-gradient-to-b from-stone-200 to-stone-100 dark:from-stone-950 dark:to-stone-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-inset ring-stone-400/30 dark:ring-stone-600/40 outline-none focus-visible:ring-2 focus-visible:ring-accent-warm/70"
      style={axis === "y" ? { width: 108, height: length } : { width: length, height: 36 }}
      onPointerDown={(e) => {
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        seek(e)
      }}
      onPointerMove={(e) => {
        if (e.buttons !== 0) seek(e)
      }}
      onDoubleClick={onReset}
      onKeyDown={handleKeyDown}
    >
      {/* Ticks */}
      <div
        className={cn(
          "absolute flex items-center justify-evenly pointer-events-none",
          axis === "y" ? "inset-x-0 top-4 bottom-4 flex-col" : "inset-y-0 left-4 right-4"
        )}
      >
        {Array.from({ length: Math.round(length / 18) }, (_, i) => (
          <span key={i} className={cn("bg-stone-400/40 dark:bg-stone-600/20", axis === "y" ? "w-6 h-px" : "h-4 w-px")} />
        ))}
      </div>
      {/* Thumb */}
      <div
        className={cn(
          "absolute flex items-center justify-center rounded-[4px] shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] transition-colors duration-150 bg-stone-300 active:bg-stone-200 dark:bg-stone-900 dark:active:bg-stone-950",
          atLimit && "active:!bg-orange-500 dark:active:!bg-orange-400",
          axis === "y" ? "left-[2px] right-[2px]" : "top-[2px] bottom-[2px]"
        )}
        style={axis === "y" ? { height: thumb, top: offset } : { width: thumb, left: offset }}
      >
        <FaderGrip axis={axis} side="left-1.5" />
        <span className="font-[family-name:var(--font-host-grotesk)] text-sm font-semibold tabular-nums pointer-events-none text-stone-900 dark:text-white slider-embossed-text">
          {value}px
        </span>
        <FaderGrip axis={axis} side="right-1.5" />
      </div>
    </div>
  )
}

function Caption({ children, changed, onReset, className }: { children: string; changed: boolean; onReset: () => void; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Label className="text-xs text-muted-foreground">{children}</Label>
      <button type="button" onClick={onReset} aria-label={`Reset ${children}`} className={cn("text-muted-foreground hover:text-foreground", !changed && "invisible")}>
        <RotateCcw className="size-2.5" />
      </button>
    </div>
  )
}

export function BaseSettings() {
  const baseFontSize = useTypographyStore((s) => s.baseFontSize)
  const scaleRatio = useTypographyStore((s) => s.scaleRatio)
  const setBaseFontSize = useTypographyStore((s) => s.setBaseFontSize)
  const setScaleRatio = useTypographyStore((s) => s.setScaleRatio)
  const setScaleRatioPreset = useTypographyStore((s) => s.setScaleRatioPreset)

  const resetBase = () => setBaseFontSize(DEFAULT_CONFIG.baseFontSize)
  const resetScale = () => {
    setScaleRatio(DEFAULT_CONFIG.scaleRatio)
    setScaleRatioPreset(DEFAULT_CONFIG.scaleRatioPreset)
  }

  return (
    <div className="flex">
      {/* Base Size column. The fader sits level with the dial's counter. */}
      <div className="flex min-w-0 flex-1 flex-col justify-between pt-2.5 pb-[13px] pr-3">
        <Caption changed={baseFontSize !== DEFAULT_CONFIG.baseFontSize} onReset={resetBase}>Base Size</Caption>
        <BaseFader value={baseFontSize} onChange={setBaseFontSize} onReset={resetBase} axis="x" length={124} />
      </div>
      <div className="module-groove-v" />
      {/* Scale column */}
      <div className="relative">
        <Caption changed={scaleRatio !== DEFAULT_CONFIG.scaleRatio} onReset={resetScale} className="absolute left-3 top-2.5 z-10">Scale</Caption>
        <HalfMoonDial
          value={scaleRatio}
          onChange={setScaleRatio}
          onPresetChange={setScaleRatioPreset}
          onReset={resetScale}
        />
      </div>
    </div>
  )
}
