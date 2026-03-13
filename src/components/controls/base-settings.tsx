"use client"

import { useRef, useCallback, useState } from "react"
import { RotateCcw } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RotaryDial } from "./rotary-dial"
import { DEFAULT_CONFIG } from "@/data/default-config"
import { useTypographyStore } from "@/store/typography-store"

const VSLIDER_MIN = 8
const VSLIDER_MAX = 32
const TICK_COUNT = 10

function VerticalBaseSlider({ value, onChange, height }: { value: number; onChange: (v: number) => void; height: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [pressing, setPressing] = useState(false)

  const yToValue = useCallback((y: number) => {
    const pct = 1 - Math.max(0, Math.min(1, y / height))
    return Math.round(pct * (VSLIDER_MAX - VSLIDER_MIN) + VSLIDER_MIN)
  }, [height])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    const track = trackRef.current
    if (!track) return
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setPressing(true)
    const rect = track.getBoundingClientRect()
    onChange(yToValue(e.clientY - rect.top))
  }, [onChange, yToValue])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    onChange(yToValue(e.clientY - rect.top))
  }, [onChange, yToValue])

  const handlePointerUp = useCallback(() => {
    setPressing(false)
  }, [])

  const pct = (value - VSLIDER_MIN) / (VSLIDER_MAX - VSLIDER_MIN)
  const thumbY = (1 - pct) * height
  const atLimit = pressing && (value <= VSLIDER_MIN || value >= VSLIDER_MAX)

  return (
    <div
      ref={trackRef}
      className="relative rounded-[5px] overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-b from-stone-300 to-stone-200 dark:from-stone-900 dark:to-stone-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-inset ring-stone-400/30 dark:ring-stone-600/40"
      style={{ width: 108, height }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Ticks */}
      <div className="absolute inset-x-0 top-4 bottom-4 flex flex-col items-center justify-evenly pointer-events-none">
        {Array.from({ length: TICK_COUNT }, (_, i) => (
          <span key={i} className="w-6 h-px bg-stone-400/40 dark:bg-stone-600/50" />
        ))}
      </div>
      {/* Thumb */}
      <div
        className={`absolute left-[2px] right-[2px] flex items-center justify-center rounded-[4px] shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] transition-colors duration-150 ${
          atLimit
            ? "bg-amber-600 active:bg-amber-700 dark:bg-amber-500 dark:active:bg-amber-400"
            : "bg-stone-700 active:bg-stone-800 dark:bg-stone-300 dark:active:bg-stone-200"
        }`}
        style={{ height: 32, top: Math.max(2, Math.min(height - 34, thumbY - 16)) }}
      >
        {/* Left gripper */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-[3px] pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className="block w-1 h-px bg-white/25 dark:bg-stone-900/25" />
          ))}
        </div>
        <span className="font-[family-name:var(--font-host-grotesk)] text-sm font-semibold tabular-nums pointer-events-none text-white dark:text-stone-900 slider-embossed-text">
          {value}px
        </span>
        {/* Right gripper */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-[3px] pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className="block w-1 h-px bg-white/25 dark:bg-stone-900/25" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function BaseSettings() {
  const baseFontSize = useTypographyStore((s) => s.baseFontSize)
  const scaleRatio = useTypographyStore((s) => s.scaleRatio)
  const setBaseFontSize = useTypographyStore((s) => s.setBaseFontSize)
  const setScaleRatio = useTypographyStore((s) => s.setScaleRatio)
  const setScaleRatioPreset = useTypographyStore((s) => s.setScaleRatioPreset)
  return (
    <div className="flex">
      {/* Base Size column */}
      <div className="flex flex-1 min-w-0 flex-col gap-2 pt-3 pb-1 pr-2">
        <div className="flex items-center justify-center gap-1">
          <div className="w-1.5" />
          <Label className="text-xs text-muted-foreground">Base Size</Label>
          <button type="button" onClick={() => setBaseFontSize(DEFAULT_CONFIG.baseFontSize)} className={`text-muted-foreground hover:text-foreground ${baseFontSize === DEFAULT_CONFIG.baseFontSize ? 'invisible' : ''}`}>
            <RotateCcw className="size-2.5" />
          </button>
        </div>
        <div className="relative z-10 flex justify-center">
          <VerticalBaseSlider value={baseFontSize} onChange={setBaseFontSize} height={184} />
        </div>
      </div>
      <div className="w-[3px] min-w-[3px] flex-shrink-0 self-stretch bg-gradient-to-r from-stone-300 via-stone-200 to-stone-100 shadow-[inset_1px_0_2px_rgba(0,0,0,0.12),1px_0_0_rgba(255,255,255,0.5)] dark:from-stone-900 dark:via-stone-800 dark:to-stone-700 dark:shadow-[inset_1px_0_2px_rgba(0,0,0,0.6),1px_0_0_rgba(255,255,255,0.04)]" />
      {/* Scale column */}
      <div className="flex flex-1 min-w-0 flex-col gap-2 pt-3 pb-1 pl-2 -mt-1 -ml-1">
        <div className="flex items-center justify-end gap-1 translate-y-1.5">
          <Label className="text-xs text-muted-foreground">Scale</Label>
          <button type="button" onClick={() => { setScaleRatio(DEFAULT_CONFIG.scaleRatio); setScaleRatioPreset(DEFAULT_CONFIG.scaleRatioPreset) }} className={`text-muted-foreground hover:text-foreground ${scaleRatio === DEFAULT_CONFIG.scaleRatio ? 'invisible' : ''}`}>
            <RotateCcw className="size-2.5" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <RotaryDial
            value={scaleRatio}
            onChange={setScaleRatio}
            onPresetChange={setScaleRatioPreset}
          />
        </div>
      </div>
    </div>
  )
}
