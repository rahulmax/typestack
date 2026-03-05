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
      setCustomValue(String(scaleRatio));
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [customMode, scaleRatio]);

  const handlePresetChange = (value: string) => {
    if (value === "Custom") {
      setScaleRatioPreset("Custom");
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
    setCustomMode(false);
  };

  if (customMode) {
    return (
      <input
        ref={inputRef}
        type="number"
        step={0.001}
        min={1.001}
        max={2.999}
        value={customValue}
        onChange={(e) => setCustomValue(e.target.value)}
        onBlur={commitCustom}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitCustom();
          if (e.key === "Escape") setCustomMode(false);
        }}
        className="flex w-full rounded-sm border border-input bg-transparent px-3 py-2 text-sm font-semibold tabular-nums h-9 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    );
  }

  return (
    <Select value={scaleRatioPreset} onValueChange={handlePresetChange}>
      <SelectTrigger className="w-full h-9 text-sm font-semibold tabular-nums">
        <SelectValue>{scaleRatio}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SCALE_RATIO_PRESETS.map((preset) => (
          <SelectItem key={preset.name} value={preset.name} className="pr-8">
            <span className="flex w-full items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 text-[10px] font-semibold text-muted-foreground font-mono">
                  {preset.label}
                </span>
                <span>{preset.name}</span>
              </span>
              <span className="tabular-nums text-muted-foreground text-right">{preset.value.toFixed(3)}</span>
            </span>
          </SelectItem>
        ))}
        <SelectItem value="Custom">Custom</SelectItem>
      </SelectContent>
    </Select>
  );
}
