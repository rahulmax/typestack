"use client"

import { RotateCcw } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { FontPicker } from "./font-picker/font-picker"
import { DEFAULT_CONFIG } from "@/data/default-config"
import type { GroupProperties } from "@/types/typography"

interface GroupControlsProps {
  title: string
  group: GroupProperties
  onUpdate: (props: Partial<GroupProperties>) => void
  disabled?: boolean
}

export function GroupControls({
  title,
  group,
  onUpdate,
  disabled,
}: GroupControlsProps) {
  const defaults = title === "Headings"
    ? DEFAULT_CONFIG.headingsGroup
    : DEFAULT_CONFIG.bodyGroup

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold shrink-0">{title}</h3>
        <FontPicker
          currentFont={group.fontFamily}
          onSelectFont={(family) => onUpdate({ fontFamily: family })}
        />
      </div>

      <div className={`grid grid-cols-2 gap-x-5 gap-y-4 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Font Weight</Label>
              {group.fontWeight !== defaults.fontWeight && (
                <button type="button" onClick={() => onUpdate({ fontWeight: defaults.fontWeight })} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="size-2.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">{group.fontWeight}</span>
          </div>
          <Slider
            value={[group.fontWeight]}
            onValueChange={([v]) => onUpdate({ fontWeight: v })}
            min={100}
            max={900}
            step={100}
            disabled={disabled}
            formatValue={(v) => String(v)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Line Height</Label>
              {group.lineHeight !== defaults.lineHeight && (
                <button type="button" onClick={() => onUpdate({ lineHeight: defaults.lineHeight })} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="size-2.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">{group.lineHeight.toFixed(2)}</span>
          </div>
          <Slider
            value={[group.lineHeight]}
            onValueChange={([v]) => onUpdate({ lineHeight: v })}
            min={0.8}
            max={2.5}
            step={0.05}
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
              {group.letterSpacing !== defaults.letterSpacing && (
                <button type="button" onClick={() => onUpdate({ letterSpacing: defaults.letterSpacing })} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="size-2.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">{group.letterSpacing.toFixed(3)}em</span>
          </div>
          <Slider
            value={[group.letterSpacing]}
            onValueChange={([v]) => onUpdate({ letterSpacing: v })}
            min={-0.1}
            max={0.2}
            step={0.005}
            disabled={disabled}
            formatValue={(v) => v.toFixed(3)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Word Spacing</Label>
              {group.wordSpacing !== defaults.wordSpacing && (
                <button type="button" onClick={() => onUpdate({ wordSpacing: defaults.wordSpacing })} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="size-2.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">{group.wordSpacing.toFixed(2)}em</span>
          </div>
          <Slider
            value={[group.wordSpacing]}
            onValueChange={([v]) => onUpdate({ wordSpacing: v })}
            min={-0.1}
            max={0.5}
            step={0.01}
            disabled={disabled}
            formatValue={(v) => v.toFixed(2)}
          />
        </div>
      </div>

    </div>
  )
}
