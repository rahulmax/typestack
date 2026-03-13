"use client"

import { useState, useCallback, useRef } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Grid3x3, CircleDot, Plus, RectangleVertical, Slash, Hash, Minus, Diamond, Ban } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { HexRgbInput } from "@/components/controls/color-picker/hex-rgb-input"
import { TailwindPalette } from "@/components/controls/color-picker/tailwind-palette"
import { useTypographyStore } from "@/store/typography-store"
import { useUIStore, GRID_PATTERN_TYPES, type GridPatternType } from "@/store/ui-store"
import { generateRandomColorPair } from "@/lib/color-utils"
import { useTheme } from "next-themes"

function ColorPickerButton({
  color,
  onChange,
  label,
  tooltipText,
  anchorRef,
}: {
  color: string
  onChange: (color: string) => void
  label: string
  tooltipText: string
  anchorRef?: React.RefObject<HTMLDivElement | null>
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [alignOffset, setAlignOffset] = useState(-16)

  const handleOpenChange = useCallback((next: boolean) => {
    if (next && anchorRef?.current && btnRef.current) {
      const anchorLeft = anchorRef.current.getBoundingClientRect().left
      const btnLeft = btnRef.current.getBoundingClientRect().left
      setAlignOffset(-(btnLeft - anchorLeft) - 16)
    }
    setOpen(next)
  }, [anchorRef])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button ref={btnRef} type="button" className="hw-btn hw-selector-btn flex-1 flex-col !gap-0.5 justify-end pb-1.5" data-active={open} style={{ height: 52 }}>
              <span
                className="h-2.5 w-8 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
      <PopoverContent className="!w-[var(--sidebar-width,360px)] p-0 hw-module-panel" side="bottom" align="start" alignOffset={alignOffset} sideOffset={8}>
        <span className="hw-bolt hw-bolt-tl" />
        <span className="hw-bolt hw-bolt-tr" />
        <span className="hw-bolt hw-bolt-bl" />
        <span className="hw-bolt hw-bolt-br" />
        <div className="flex flex-col gap-3 px-4 py-4">
          <HexColorPicker
            color={color}
            onChange={onChange}
            style={{ width: "100%", height: 100 }}
          />
          <HexRgbInput color={color} onChange={onChange} />
          <TailwindPalette onSelect={onChange} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

const PATTERN_ICONS: Record<string, React.ReactNode> = {
  square: <Grid3x3 className="size-3.5" />,
  dots: <CircleDot className="size-3.5" />,
  plus: <Plus className="size-3.5" />,
  tallrect: <RectangleVertical className="size-3.5" />,
  diagonal: <Slash className="size-3.5" />,
  crosshatch: <Hash className="size-3.5" />,
  hlines: <Minus className="size-3.5" />,
  diamond: <Diamond className="size-3.5" />,
}

const PATTERN_TOOLTIPS: Record<string, string> = {
  square: "Square Grid",
  dots: "Dots",
  plus: "Plus",
  tallrect: "Tall Rect",
  diagonal: "Diagonal",
  crosshatch: "Crosshatch",
  hlines: "H-Lines",
  diamond: "Diamond",
}

export function SidebarToolbar() {
  const colorsRef = useRef<HTMLDivElement>(null)
  const headingColor = useTypographyStore((s) => s.headingsGroup.color)
  const bodyColor = useTypographyStore((s) => s.bodyGroup.color)
  const backgroundColor = useTypographyStore((s) => s.backgroundColor)
  const setColors = useTypographyStore((s) => s.setColors)
  const updateHeadingsGroup = useTypographyStore((s) => s.updateHeadingsGroup)
  const updateBodyGroup = useTypographyStore((s) => s.updateBodyGroup)
  const setBackgroundColor = useTypographyStore((s) => s.setBackgroundColor)
  const gridPattern = useUIStore((s) => s.gridPattern)
  const setGridPattern = useUIStore((s) => s.setGridPattern)
  const { resolvedTheme } = useTheme()

  const handleRandom = useCallback(() => {
    const { fg, bg } = generateRandomColorPair(resolvedTheme === "dark")
    setColors(fg, fg, bg)
  }, [resolvedTheme, setColors])

  const handleReverse = useCallback(() => {
    setColors(backgroundColor, backgroundColor, headingColor)
  }, [backgroundColor, headingColor, setColors])

  return (
    <div className="flex flex-col gap-4">
      {/* Colors */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Colors</h3>
        <div ref={colorsRef} className="hw-btn-group flex">
          <ColorPickerButton
            color={headingColor}
            onChange={(color) => updateHeadingsGroup({ color })}
            label="Head"
            tooltipText="Heading color"
            anchorRef={colorsRef}
          />
          <ColorPickerButton
            color={bodyColor}
            onChange={(color) => updateBodyGroup({ color })}
            label="Body"
            tooltipText="Body color"
            anchorRef={colorsRef}
          />
          <ColorPickerButton
            color={backgroundColor}
            onChange={setBackgroundColor}
            label="BG"
            tooltipText="Background color"
            anchorRef={colorsRef}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={handleRandom} className="hw-btn hw-selector-btn flex-1 flex-col !gap-0.5 justify-end pb-1.5" style={{ height: 52 }}>
                <span className="flex h-2.5 w-8 overflow-hidden rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                  <span className="flex-1 bg-[#ff5f57]" />
                  <span className="flex-1 bg-[#febc2e]" />
                  <span className="flex-1 bg-[#28c840]" />
                  <span className="flex-1 bg-[#5b9cf6]" />
                </span>
                <span className="text-[10px] text-muted-foreground">Rand</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Random accessible colors</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={handleReverse} className="hw-btn hw-selector-btn flex-1 flex-col !gap-0.5 justify-end pb-1.5" style={{ height: 52 }}>
                <span
                  className="block h-2.5 w-8 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                  style={{ background: `linear-gradient(135deg, ${headingColor} 50%, ${backgroundColor} 50%)` }}
                />
                <span className="text-[10px] text-muted-foreground">Swap</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Swap foreground / background</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Background Pattern — inline grid */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Background Pattern</h3>
          <span className="text-xs text-muted-foreground">{gridPattern ? PATTERN_TOOLTIPS[gridPattern] : "None"}</span>
        </div>
        <div className="hw-btn-group flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setGridPattern(null)}
                className="hw-btn hw-selector-btn flex-1"
                data-active={gridPattern === null}
                style={{ height: 36 }}
              >
                <Ban className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>None</TooltipContent>
          </Tooltip>
          {GRID_PATTERN_TYPES.map((p) => (
            <Tooltip key={p}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setGridPattern(p as GridPatternType)}
                  className="hw-btn hw-selector-btn flex-1"
                  data-active={gridPattern === p}
                  style={{ height: 36 }}
                >
                  {PATTERN_ICONS[p]}
                </button>
              </TooltipTrigger>
              <TooltipContent>{PATTERN_TOOLTIPS[p]}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

    </div>
  )
}
