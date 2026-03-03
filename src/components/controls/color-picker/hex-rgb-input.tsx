"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const handleHexChange = (value: string) => {
    setHex(value);
    if (/^#[a-f\d]{6}$/i.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Hex</Label>
        <Input
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="h-8 font-mono text-sm"
          maxLength={7}
        />
      </div>
      {rgb && (
        <div className="flex gap-2">
          {(["r", "g", "b"] as const).map((ch) => (
            <div key={ch} className="flex flex-col gap-1">
              <Label className="text-xs uppercase text-muted-foreground">
                {ch}
              </Label>
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
                className="h-8 w-16 text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
