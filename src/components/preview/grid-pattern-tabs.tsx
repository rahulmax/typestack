"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Grid3x3, Circle, Plus, RectangleVertical } from "lucide-react";
import type { GridPatternType } from "@/store/ui-store";

const PATTERNS: { value: GridPatternType & string; icon: React.ReactNode; label: string }[] = [
  { value: "square", icon: <Grid3x3 className="size-3.5" />, label: "Square" },
  { value: "dots", icon: <Circle className="size-2.5" />, label: "Dots" },
  { value: "plus", icon: <Plus className="size-3.5" />, label: "Plus" },
  { value: "tallrect", icon: <RectangleVertical className="size-3.5" />, label: "Tall" },
];

interface GridPatternTabsProps {
  value: GridPatternType;
  onChange: (pattern: GridPatternType) => void;
}

export function GridPatternTabs({ value, onChange }: GridPatternTabsProps) {
  return (
    <div className="inline-flex h-8 items-center rounded-md bg-muted p-0.5 text-muted-foreground">
      {PATTERNS.map(({ value: pv, icon, label }) => {
        const active = value === pv;
        return (
          <Tooltip key={pv}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onChange(active ? null : pv)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-background/50 hover:text-foreground"
                }`}
              >
                {icon}
              </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
