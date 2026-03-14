"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const TICK_COUNT = 7

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  label,
  formatValue,
  disabledText,
  onReset,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  label?: string
  formatValue?: (v: number) => string
  disabledText?: string
  onReset?: () => void
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  const displayValue = disabledText
    ? disabledText
    : formatValue
      ? formatValue(_values[0])
      : _values[0].toFixed(2)

  const isDisabledText = !!disabledText

  return (
    <div
      className={cn(
        "relative h-9 w-full rounded-[5px] overflow-hidden",
        "bg-gradient-to-b from-stone-200 to-stone-100 dark:from-stone-950 dark:to-stone-900",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.05)]",
        "ring-1 ring-inset ring-stone-400/30 dark:ring-stone-600/40",
        className
      )}
      data-disabled={props.disabled || undefined}
      onDoubleClick={onReset}
    >
      {isDisabledText ? (
        <>
          <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-evenly pointer-events-none">
            {Array.from({ length: TICK_COUNT }, (_, i) => (
              <span key={i} className="h-3 w-px bg-stone-400/15 dark:bg-stone-600/10" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-[family-name:var(--font-host-grotesk)] text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400/65 dark:text-stone-500/40 select-none [text-shadow:0_1px_0_rgba(255,255,255,0.4)] dark:[text-shadow:0_1px_0_rgba(0,0,0,0.3)]">
              {disabledText}
            </span>
          </div>
        </>
      ) : (
        <>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 font-[family-name:var(--font-oswald)] text-xs font-extralight text-stone-400 dark:text-stone-500/50 tabular-nums select-none z-0">
            {Number.isInteger(min) && min >= 10 ? min : min.toFixed(1)}
          </span>
          <div className="absolute inset-y-0 left-14 right-1 flex items-center justify-evenly pointer-events-none z-0">
            {Array.from({ length: TICK_COUNT }, (_, i) => (
              <span key={i} className="h-4 w-px bg-stone-400/20 dark:bg-stone-600/10" />
            ))}
          </div>
          <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className="absolute inset-x-[2px] inset-y-0 flex touch-none items-center select-none"
            {...props}
          >
            <SliderPrimitive.Track
              data-slot="slider-track"
              className="relative h-full w-full"
            >
              <SliderPrimitive.Range
                data-slot="slider-range"
                className="absolute h-full"
              />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, (_, index) => {
              const atLimit = _values[index] <= min || _values[index] >= max
              return (
                <SliderPrimitive.Thumb
                  data-slot="slider-thumb"
                  key={index}
                  className={cn(
                    "flex h-8 w-16 shrink-0 cursor-grab active:cursor-grabbing items-center justify-center rounded-[4px] transition-colors focus-visible:outline-hidden disabled:pointer-events-none",
                    "bg-stone-300 active:bg-stone-200 dark:bg-stone-900 dark:active:bg-stone-950",
                    atLimit && "active:!bg-orange-500 dark:active:!bg-orange-400",
                    "shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)]"
                  )}
                >
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex gap-[2px] pointer-events-none">
                    {Array.from({ length: 2 }, (_, i) => (
                      <span key={i} className="block h-1.5 w-px bg-stone-400/30 dark:bg-white/25" />
                    ))}
                  </div>
                  <span className="font-[family-name:var(--font-host-grotesk)] text-sm font-semibold tabular-nums pointer-events-none text-stone-900 dark:text-white slider-embossed-text">
                    {displayValue}
                  </span>
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-[2px] pointer-events-none">
                    {Array.from({ length: 2 }, (_, i) => (
                      <span key={i} className="block h-1.5 w-px bg-stone-400/30 dark:bg-white/25" />
                    ))}
                  </div>
                </SliderPrimitive.Thumb>
              )
            })}
          </SliderPrimitive.Root>
        </>
      )}
    </div>
  )
}

export { Slider }
