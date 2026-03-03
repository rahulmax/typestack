"use client";

import { Label } from "@/components/ui/label";
import { useTypographyStore } from "@/store/typography-store";

interface BackgroundControlProps {
  onColorClick: () => void;
}

export function BackgroundControl({ onColorClick }: BackgroundControlProps) {
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">Background Color</Label>
      <button
        type="button"
        onClick={onColorClick}
        className="flex h-7 w-full items-center gap-2 rounded-md border bg-background px-2 text-xs hover:bg-accent"
      >
        <span
          className="h-3.5 w-3.5 rounded-sm border"
          style={{ backgroundColor }}
        />
        {backgroundColor}
      </button>
    </div>
  );
}
