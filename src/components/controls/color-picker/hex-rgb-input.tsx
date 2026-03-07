"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hexToOklch, oklchToHex } from "@/lib/color-utils";

interface HexRgbInputProps {
  color: string;
  onChange: (color: string) => void;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, x)).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export function HexRgbInput({ color, onChange }: HexRgbInputProps) {
  const [hex, setHex] = useState(color);

  useEffect(() => {
    setHex(color);
  }, [color]);

  const rgb = hexToRgb(color);
  const oklch = useMemo(() => (/^#[a-f\d]{6}$/i.test(color) ? hexToOklch(color) : null), [color]);

  const handleHexChange = (value: string) => {
    setHex(value);
    if (/^#[a-f\d]{6}$/i.test(value)) {
      onChange(value);
    }
  };

  const numClass = "h-7 text-xs tabular-nums px-1.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  return (
    <div className="flex items-end gap-1.5">
      {/* Hex */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-md bg-muted/50 p-1.5">
        <Label className="text-[10px] text-muted-foreground">Hex</Label>
        <Input
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="h-7 w-full font-mono text-xs px-1.5"
          maxLength={7}
        />
      </div>
      {/* RGB */}
      {rgb && (
        <div className="flex min-w-0 flex-[1.5] gap-1 rounded-md bg-muted/50 p-1.5">
          {(["r", "g", "b"] as const).map((ch) => (
            <div key={ch} className="flex min-w-0 flex-1 flex-col gap-1">
              <Label className="text-[10px] uppercase text-muted-foreground">{ch}</Label>
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) {
                    const newRgb = { ...rgb, [ch]: v };
                    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                  }
                }}
                className={`w-full ${numClass}`}
              />
            </div>
          ))}
        </div>
      )}
      {/* OKLCH */}
      {oklch && (
        <div className="flex min-w-0 flex-[1.5] gap-1 rounded-md bg-muted/50 p-1.5">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Label className="text-[10px] uppercase text-muted-foreground">L</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={parseFloat(oklch.l.toFixed(2))}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v)) onChange(oklchToHex(v, oklch.c, oklch.h));
              }}
              className={`w-full ${numClass}`}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Label className="text-[10px] uppercase text-muted-foreground">C</Label>
            <Input
              type="number"
              min={0}
              max={0.4}
              step={0.001}
              value={parseFloat(oklch.c.toFixed(3))}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v)) onChange(oklchToHex(oklch.l, v, oklch.h));
              }}
              className={`w-full ${numClass}`}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Label className="text-[10px] uppercase text-muted-foreground">H</Label>
            <Input
              type="number"
              min={0}
              max={360}
              step={0.1}
              value={parseFloat(oklch.h.toFixed(1))}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v)) onChange(oklchToHex(oklch.l, oklch.c, v));
              }}
              className={`w-full ${numClass}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
