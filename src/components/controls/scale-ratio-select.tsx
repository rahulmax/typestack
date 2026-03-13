"use client";

import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCALE_RATIO_PRESETS } from "@/data/scale-ratios";
import { useTypographyStore } from "@/store/typography-store";

export function ScaleRatioSelect() {
  const scaleRatioPreset = useTypographyStore((s) => s.scaleRatioPreset);
  const scaleRatio = useTypographyStore((s) => s.scaleRatio);
  const setScaleRatio = useTypographyStore((s) => s.setScaleRatio);
  const setScaleRatioPreset = useTypographyStore((s) => s.setScaleRatioPreset);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState(String(scaleRatio));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (customMode) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [customMode]);

  const handlePresetChange = (value: string) => {
    if (value === "Custom") {
      setScaleRatioPreset("Custom");
      setCustomValue(String(scaleRatio));
      setCustomMode(true);
      return;
    }
    setCustomMode(false);
    const preset = SCALE_RATIO_PRESETS.find((p) => p.name === value);
    if (preset) {
      setScaleRatio(preset.value);
    }
  };

  const commitCustom = () => {
    const num = parseFloat(customValue);
    if (!isNaN(num) && num > 1 && num < 3) {
      setScaleRatio(num);
    }
  };

  if (customMode) {
    return (
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="number"
          step={0.001}
          min={1.001}
          max={2.999}
          value={customValue}
          onChange={(e) => {
            setCustomValue(e.target.value);
            const num = parseFloat(e.target.value);
            if (!isNaN(num) && num > 1 && num < 3) {
              setScaleRatio(num);
            }
          }}
          onBlur={commitCustom}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitCustom();
              setCustomMode(false);
            }
            if (e.key === "Escape") setCustomMode(false);
          }}
          className="flex w-full rounded-[4px] border-none bg-stone-200 dark:bg-stone-800 ring-1 ring-inset ring-stone-300/50 dark:ring-stone-700/50 px-3 py-2 text-sm font-semibold tabular-nums h-8 outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-stone-400/50 dark:focus-visible:ring-stone-600/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    );
  }

  return (
    <Select value={scaleRatioPreset} onValueChange={handlePresetChange} onOpenChange={(open) => {
      if (open && scaleRatioPreset === "Custom") {
        setCustomValue(String(scaleRatio));
        setCustomMode(true);
      }
    }}>
      <SelectTrigger className="w-full !h-9 text-sm font-semibold tabular-nums">
        <SelectValue>{scaleRatio}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SCALE_RATIO_PRESETS.map((preset) => (
          <SelectItem key={preset.name} value={preset.name} className="pr-3">
            <span className="flex w-full items-center justify-between gap-2">
              <span className="flex items-center gap-2 min-w-0">
                <span className="inline-flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-semibold text-muted-foreground font-mono shrink-0">
                  {preset.label}
                </span>
                <span className="truncate">{preset.name}</span>
              </span>
              <span className="tabular-nums opacity-60 font-[family-name:var(--font-host-grotesk)] shrink-0">{preset.value.toFixed(3)}</span>
            </span>
          </SelectItem>
        ))}
        <SelectItem value="Custom">Custom</SelectItem>
      </SelectContent>
    </Select>
  );
}
