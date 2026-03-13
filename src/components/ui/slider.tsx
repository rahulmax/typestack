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
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  label?: string
  formatValue?: (v: number) => string
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

  const displayValue = formatValue
    ? formatValue(_values[0])
    : _values[0].toFixed(2)

  return (
    <div className={cn("relative h-8 w-full rounded-[4px] bg-stone-200 dark:bg-stone-800 overflow-hidden ring-1 ring-inset ring-stone-300/50 dark:ring-stone-700/50", className)} data-disabled={props.disabled || undefined}>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 font-[family-name:var(--font-oswald)] text-xs font-extralight text-stone-400 tabular-nums select-none z-0">
        {Number.isInteger(min) && min >= 10 ? min : min.toFixed(1)}
      </span>
      <div className="absolute inset-y-0 left-14 right-1 flex items-center justify-evenly pointer-events-none z-0">
        {Array.from({ length: TICK_COUNT }, (_, i) => (
          <span key={i} className="h-4 w-px bg-stone-400/50" />
        ))}
      </div>
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className="absolute inset-x-[2px] inset-y-0 flex touch-none items-center select-none data-[disabled]:opacity-50"
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
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="flex h-7 w-16 shrink-0 cursor-grab active:cursor-grabbing items-center justify-center rounded-[4px] bg-stone-700 active:bg-orange-500 text-white dark:bg-stone-300 dark:text-stone-900 shadow-lg transition-colors focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="font-[family-name:var(--font-host-grotesk)] text-sm font-semibold tabular-nums pointer-events-none">
              {displayValue}
            </span>
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    </div>
  )
}

export { Slider }
